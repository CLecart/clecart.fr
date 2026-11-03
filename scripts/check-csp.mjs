/**
 * Check that every Content-Security-Policy lists exactly the inline scripts
 * @file Each page's meta CSP, and the container's header, allow inline
 * scripts by hash. Editing one byte of an inline script changes its hash and
 * the browser then blocks it: this check fails first, naming the page and the
 * hash it now needs. Run by `npm run check`.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const PAGES = [
  "index.html",
  "about-portfolio.html",
  "descriptions-projects.html",
  "privacy-policy.html",
  "404.html",
  "cv/index.html",
];
const HEADERS = "nginx-security-headers.conf";

/**
 * List the sha256 sources a policy's script-src allows
 * @function allowedHashes
 * @param {string} policy - A Content-Security-Policy value
 * @returns {Set<string>} Each 'sha256-…' source, quotes removed
 */
function allowedHashes(policy) {
  const scriptSrc = policy
    .split(";")
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith("script-src"));
  return new Set(scriptSrc?.match(/sha256-[A-Za-z0-9+/=]+/g) ?? []);
}

/**
 * Hash every inline script of a page the way browsers do for CSP
 * @function inlineHashes
 * @param {string} html - The page's markup
 * @returns {Set<string>} 'sha256-…' of each inline script's exact text
 */
function inlineHashes(html) {
  return new Set(
    [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
      ([, body]) =>
        `sha256-${createHash("sha256").update(body).digest("base64")}`
    )
  );
}

/**
 * Compare what a policy allows with what a page runs, and report the gaps
 * @function compare
 * @param {string} where - Label for the report
 * @param {Set<string>} allowed - Hashes the policy allows
 * @param {Set<string>} needed - Hashes the inline scripts have
 * @returns {string[]} One line per missing or stale hash
 */
function compare(where, allowed, needed) {
  return [
    ...[...needed]
      .filter((hash) => !allowed.has(hash))
      .map((hash) => `${where}: inline script needs '${hash}'`),
    ...[...allowed]
      .filter((hash) => !needed.has(hash))
      .map((hash) => `${where}: '${hash}' matches no inline script`),
  ];
}

const problems = [];
const allInline = new Set();

for (const page of PAGES) {
  const html = readFileSync(page, "utf8");
  const meta = html.match(
    /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/
  );
  const needed = inlineHashes(html);
  needed.forEach((hash) => allInline.add(hash));
  if (!meta) {
    problems.push(`${page}: no Content-Security-Policy meta tag`);
    continue;
  }
  problems.push(...compare(page, allowedHashes(meta[1]), needed));
}

const header = readFileSync(HEADERS, "utf8").match(
  /Content-Security-Policy\s+"([^"]+)"/
);
if (header) {
  problems.push(...compare(HEADERS, allowedHashes(header[1]), allInline));
} else {
  problems.push(`${HEADERS}: no Content-Security-Policy header`);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`CSP hashes match the inline scripts of ${PAGES.length} pages.`);
