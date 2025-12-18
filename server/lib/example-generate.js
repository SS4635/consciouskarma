// server/lib/example-generate.js
import fs from "fs/promises";
import path from "path";
import { generateScorePDF_HTML } from "./generateScorePDF_html.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const scoreData = {
  title: "Instant Report",
  user: { name: "ABCXYZ", email: "abc@gmail.com" },
  // Run without icons first; add iconFile: "assets/xxx.png" later
  bars: [
    { label: "Charm / Love",   score: 6 },
    { label: "Work / Finance", score: -3 },
    { label: "Intelligence",   score: 2 },
  ],
};

const outPath = path.join(__dirname, "..", "Instant_Report_HTML.pdf");

const pdf = await generateScorePDF_HTML(scoreData);
await fs.writeFile(outPath, pdf);
console.log("✅ Saved:", outPath);
