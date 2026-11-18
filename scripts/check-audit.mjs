/**
 * Fail on every npm audit advisory that is not accepted by name
 * @file `npm audit` alone fails on any advisory, even one that no release
 * fixes yet. An advisory accepted on purpose is named, with its package and
 * its reason, in scripts/audit-exceptions.json. This check fails on any other
 * advisory, on an exception that no advisory matches any more, and on an
 * accepted advisory that `npm audit fix` can now fix without a major update.
 * Run by `npm run check`: npm gives the path of its own command line.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const EXCEPTIONS = "scripts/audit-exceptions.json";
const ADVISORY_ID = /^GHSA(?:-[23456789cfghjmpqrvwx]{4}){3}$/;
const ADVISORY_URL =
  /^https:\/\/github\.com\/advisories\/(GHSA(?:-[23456789cfghjmpqrvwx]{4}){3})$/;

/**
 * Wrap a message in the shape npm gives its own errors
 * @function failure
 * @param {string} summary - What went wrong
 * @returns {{error: {summary: string}}} A report that holds only the error
 */
function failure(summary) {
  return { error: { summary } };
}

/**
 * Run npm audit and read its JSON report
 * @function auditReport
 * @returns {object} The report, or an error when npm gave none
 */
function auditReport() {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    return failure("run it through npm: npm run check:audit");
  }
  const run = spawnSync(process.execPath, [npmCli, "audit", "--json"], {
    encoding: "utf8",
  });
  if (run.error) {
    return failure(run.error.message);
  }
  if (run.status !== 0 && run.status !== 1) {
    return failure(`exited with ${run.status}: ${run.stderr.trim()}`);
  }
  try {
    const report = JSON.parse(run.stdout);
    if (report?.error) {
      // A network failure leaves summary and detail empty, its text in message.
      const { summary, detail } = report.error;
      return failure(
        summary || detail || report.message || run.stderr.trim() || "no reason"
      );
    }
    return report?.vulnerabilities
      ? report
      : failure("its report lists no vulnerabilities field");
  } catch {
    return failure(`no JSON report: ${run.stderr.trim()}`);
  }
}

/**
 * Collect the advisories of an audit report, one per advisory
 * @function advisoriesOf
 * @param {object} report - The JSON report of npm audit
 * @returns {Map<string, object>} By ID: package, title, URL, and whether
 * `npm audit fix` fixes it without a major update
 */
function advisoriesOf(report) {
  const { vulnerabilities } = report;
  const advisories = new Map();
  for (const { via } of Object.values(vulnerabilities)) {
    for (const source of via.filter((entry) => typeof entry === "object")) {
      const url = source.url ?? "";
      const id = ADVISORY_URL.exec(url)?.[1] ?? `npm advisory ${source.source}`;
      const fix = vulnerabilities[source.name]?.fixAvailable;
      advisories.set(id, {
        id,
        name: source.name,
        title: source.title,
        url,
        fixable: fix === true || fix?.isSemVerMajor === false,
      });
    }
  }
  return advisories;
}

/**
 * Tell whether an exception names an advisory, its package and its reason
 * @function isWellFormed
 * @param {object} entry - One entry of the exceptions file
 * @returns {boolean} True when every field is there and the ID is valid
 */
function isWellFormed(entry) {
  return (
    typeof entry?.advisory === "string" &&
    ADVISORY_ID.test(entry.advisory) &&
    typeof entry.package === "string" &&
    entry.package !== "" &&
    typeof entry.reason === "string" &&
    entry.reason.trim() !== ""
  );
}

/**
 * Read the accepted advisories
 * @function readExceptions
 * @param {string[]} problems - Receives one line per unreadable entry
 * @returns {Map<string, object>} Each well-formed entry, by advisory ID
 */
function readExceptions(problems) {
  const exceptions = new Map();
  let entries;
  try {
    entries = JSON.parse(readFileSync(EXCEPTIONS, "utf8"));
  } catch (error) {
    problems.push(`${EXCEPTIONS}: ${error.message}`);
    return exceptions;
  }
  if (!Array.isArray(entries)) {
    problems.push(`${EXCEPTIONS}: not a list of exceptions`);
    return exceptions;
  }
  entries.forEach((entry, index) => {
    if (!isWellFormed(entry)) {
      problems.push(
        `${EXCEPTIONS}, entry ${index}: needs a GHSA advisory, its package and a reason`
      );
    } else if (exceptions.has(entry.advisory)) {
      problems.push(`${EXCEPTIONS}: ${entry.advisory} is listed twice`);
    } else {
      exceptions.set(entry.advisory, entry);
    }
  });
  return exceptions;
}

/**
 * Compare the advisories with the exceptions, and report the gaps
 * @function compare
 * @param {Map<string, object>} advisories - What npm audit reports
 * @param {Map<string, object>} exceptions - What is accepted by name
 * @returns {string[]} One line per advisory or exception that fails
 */
function compare(advisories, exceptions) {
  const problems = [];
  for (const advisory of advisories.values()) {
    const exception = exceptions.get(advisory.id);
    if (!exception) {
      problems.push(
        `${advisory.id} (${advisory.name}): ${advisory.title} ${advisory.url}`
      );
    } else if (exception.package !== advisory.name) {
      problems.push(
        `${advisory.id}: reported on ${advisory.name}, excepted for ${exception.package}`
      );
    } else if (advisory.fixable) {
      problems.push(
        `${advisory.id}: npm audit fix now fixes it without a major update; apply it, then remove its exception`
      );
    }
  }
  for (const id of exceptions.keys()) {
    if (!advisories.has(id)) {
      problems.push(
        `${id}: npm audit no longer reports it; remove its exception`
      );
    }
  }
  return problems;
}

const problems = [];
const exceptions = readExceptions(problems);
const report = auditReport();
if (report.error) {
  problems.push(`npm audit: ${report.error.summary}`);
} else {
  problems.push(...compare(advisoriesOf(report), exceptions));
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(
  exceptions.size === 0
    ? "npm audit: no advisory."
    : `npm audit: no advisory but those accepted in ${EXCEPTIONS}: ${[...exceptions.keys()].join(", ")}.`
);
