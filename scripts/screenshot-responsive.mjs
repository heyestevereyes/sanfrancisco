// Captura screenshots de una página en distintos anchos de viewport.
// Uso: node scripts/screenshot-responsive.mjs [url] [outDir] [width1,width2,...]
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "screenshots";
const widths = (process.argv[4] ?? "375,768,1366,1920,2560")
  .split(",")
  .map((w) => Number.parseInt(w.trim(), 10));

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1080 } });
    await page.goto(url, { waitUntil: "networkidle" });
    const filePath = path.join(outDir, `${width}px.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Saved ${filePath}`);
    await page.close();
  }
} finally {
  await browser.close();
}
