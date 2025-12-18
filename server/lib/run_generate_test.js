// server/lib/run_generate_test.js
import path from "path";
import fs from "fs";
import { generateScorePDF } from "./generateScorePDF.js"; // adjust export if default

(async ()=>{
  try {
    const sample = {
      number: "8860968260",
      totalScore: 9,
      grade: "A",
      basicScore: 8,
      sequenceScore: 9,
      Love: 8,
      Finance: 7,
      Fortune: 9,
      Intuition: 6,
      Mind: 8,
      influences: [
        "Bold and charming, with a magnetic personality.",
        "Confident and clear communicator.",
        "Smart in generating income through multiple streams."
      ]
    };

    const output = await generateScorePDF(sample, "test@local");
    console.log("✅ Generated PDF:", output);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
