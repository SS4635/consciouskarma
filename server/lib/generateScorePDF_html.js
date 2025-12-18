// server/lib/generateScorePDF_html.js
import fs from "fs/promises";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// data URI helper (safe: returns null if missing)
async function safeDataUri(absPath) {
  try {
    const b64 = await fs.readFile(absPath, { encoding: "base64" });
    const ext = path.extname(absPath).slice(1).toLowerCase();
    const mime =
      ext === "svg" ? "image/svg+xml" :
      ext === "png" ? "image/png" :
      (ext === "jpg" || ext === "jpeg") ? "image/jpeg" :
      "application/octet-stream";
    return `data:${mime};base64,${b64}`;
  } catch (e) {
    console.warn("⚠️  Icon missing or unreadable:", absPath);
    return null;
  }
}

export async function generateScorePDF_HTML(scoreData) {
  const templatePath = path.join(__dirname, "templates", "score-report.ejs");

  const bars = await Promise.all(
    (scoreData.bars || []).map(async (b) => {
      const iconAbs = b.iconFile
        ? (path.isAbsolute(b.iconFile)
            ? b.iconFile
            : path.join(__dirname, "..", b.iconFile)) // e.g. "assets/love.png"
        : null;
      return { ...b, icon: iconAbs ? await safeDataUri(iconAbs) : null };
    })
  );

  const html = await ejs.renderFile(
    templatePath,
    { data: { ...scoreData, bars } },
    { async: true }
  );

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--font-render-hinting=medium"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "14mm", left: "12mm" },
  });

  await browser.close();
  return pdf;
}
