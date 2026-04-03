const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set viewport to match typical project card size
  await page.setViewport({ width: 400, height: 225 });

  try {
    // Navigate to the showcase site
    await page.goto("https://pochet-du-courval-showcase-lzfg.vercel.app/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Take screenshot
    const screenshotPath = path.join(
      __dirname,
      "assets",
      "images",
      "pochet-du-courval.png"
    );
    await page.screenshot({ path: screenshotPath, type: "png" });

    console.log(`✅ Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error("Error taking screenshot:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
