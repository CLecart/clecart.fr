const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set viewport to match project card dimensions
  await page.setViewport({ width: 400, height: 225 });

  try {
    // Navigate to the site
    await page.goto("https://pochet-du-courval-showcase-lzfg.vercel.app/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Take multiple screenshots at different scroll positions to simulate scrolling
    const screenshots = [];
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    );

    // Capture hero + scroll a bit
    for (let i = 0; i < 8; i++) {
      await page.evaluate((scroll) => {
        window.scrollBy(0, scroll);
      }, scrollHeight / 8);

      const screenshot = await page.screenshot({ type: "png" });
      screenshots.push(screenshot);

      // Small delay between screenshots
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // For now, just save the first screenshot as the hero
    const screenshotPath = path.join(
      __dirname,
      "assets",
      "videos",
      "pochet-du-courval-preview.png"
    );
    fs.writeFileSync(screenshotPath, screenshots[0]);

    console.log(`✅ Preview screenshot saved to ${screenshotPath}`);
    console.log(`📹 Captured ${screenshots.length} frames for animation`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
