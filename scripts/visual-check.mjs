import { chromium } from "/Users/superhero/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
});

const cases = [
  { name: "desktop", width: 1440, height: 1000, scale: 1 },
  { name: "mobile", width: 390, height: 844, scale: 1 }
];

for (const testCase of cases) {
  const page = await browser.newPage({
    viewport: { width: testCase.width, height: testCase.height },
    deviceScaleFactor: testCase.scale
  });

  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`page: ${error.message}`));

  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: `artifacts/${testCase.name}.png`,
    fullPage: true
  });

  if (testCase.name === "desktop") {
    await page.mouse.move(880, 480);
    await page.mouse.down();
    await page.mouse.move(1080, 500, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(800);
    const musicState = await page.locator("#background-music").evaluate((audio) => ({
      paused: audio.paused,
      volume: audio.volume,
      loop: audio.loop
    }));
    console.log("music:", JSON.stringify(musicState));
    await page.screenshot({ path: "artifacts/desktop-side.png", fullPage: true });

    await page.getByRole("button", { name: "切换玫瑰绽放状态" }).click();
    await page.waitForTimeout(1600);
    await page.screenshot({ path: "artifacts/desktop-bloom.png", fullPage: true });
  }

  console.log(`${testCase.name}: ${problems.length ? problems.join(" | ") : "ok"}`);
  await page.close();
}

await browser.close();
