import { chromium } from "/Users/superhero/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("https://pixabay.com/3d-models/rose-flower-love-red-2154/", {
  waitUntil: "domcontentloaded",
  timeout: 60000
});
await page.waitForTimeout(8000);
console.log("title:", await page.title());
console.log("url:", page.url());
console.log((await page.locator("body").innerText()).slice(0, 5000));
console.log("links:", await page.locator("a").evaluateAll((links) => links
  .map((link) => ({ text: link.textContent?.trim(), href: link.href }))
  .filter((link) => /download|\.glb|3d-model/i.test(`${link.text} ${link.href}`))
  .slice(0, 30)));
await page.screenshot({ path: "artifacts/pixabay-model.png", fullPage: true });
await browser.close();
