import { chromium } from "/Users/superhero/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({
  headless: false,
  executablePath: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  args: ["--disable-blink-features=AutomationControlled"]
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("https://pixabay.com/3d-models/rose-flower-love-red-2154/", {
  waitUntil: "domcontentloaded",
  timeout: 60000
});
await page.waitForTimeout(25000);
console.log("title:", await page.title());
console.log("buttons:", await page.locator("button, a").evaluateAll((elements) => elements
  .map((element) => ({ text: element.textContent?.trim(), href: element.href || "" }))
  .filter((entry) => /download/i.test(`${entry.text} ${entry.href}`))));
const downloadControl = page.getByText(/Free download|Download/, { exact: false }).first();
if (await downloadControl.isVisible().catch(() => false)) {
  const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
  await downloadControl.click();
  const download = await downloadPromise;
  await download.saveAs("public/rose-model.glb");
  console.log("saved:", download.suggestedFilename());
} else {
  console.log((await page.locator("body").innerText()).slice(0, 3000));
}
await page.screenshot({ path: "artifacts/pixabay-headful.png", fullPage: true });
await browser.close();
