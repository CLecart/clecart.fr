const puppeteer = require("puppeteer");
const cartes = [["index.html", ".project-card", "carte projet"],["index.html", ".skill-card", "carte compétence"],
  ["index.html", ".language-card", "carte langage"],["about-portfolio.html", ".portfolio-section", "section portfolio"],
  ["about-portfolio.html", ".tech-item", "tech-item"],["about-portfolio.html", ".approach-item", "approach-item"],
  ["descriptions-projects.html", ".description", "carte description"]];
(async () => {
  const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome-stable", args: ["--no-sandbox"] });
  console.log(`  ${process.argv[2]} — THÈME SOMBRE, bordure AU REPOS`);
  for (const [f, sel, nom] of cartes) {
    const p = await b.newPage(); await p.setViewport({width:1920,height:1080});
    await p.emulateMediaFeatures([{name:"prefers-color-scheme",value:"dark"}]);
    await p.goto(`http://localhost:8000/${f}`, { waitUntil: "networkidle2" }); await new Promise(r=>setTimeout(r,1300));
    const r = await p.evaluate(s => { const el=document.querySelector(s); const cs=getComputedStyle(el);
      return `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`; }, sel);
    console.log(`    ${nom.padEnd(20)} ${r}`);
    await p.close();
  }
  await b.close();
})();
