import fs from "fs";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse bar scores from API response format
 */
async function parseBarScores(barsObj) {
  const out = [];
  if (Array.isArray(barsObj)) {
    return barsObj.map((b) => ({ label: b.label, score: b.score }));
  }
  for (let key of Object.keys(barsObj || {})) {
    let raw = (barsObj[key] || "").toString().trim();
    const parts = raw
      .split(",")
      .map((s) => s.replace("+", "").trim())
      .filter(Boolean);
    const nums = parts.map((s) => Number(s) || 0);
    const sum = nums.reduce((a, c) => a + c, 0);
    out.push({ label: key, score: sum, raw });
  }
  return out;
}

/**
 * Helper function to load image as base64
 */
function loadImageAsBase64(imagePath) {
  try {
    if (!imagePath || typeof imagePath !== "string") return null;

    const trimmed = imagePath.trim();
    // avoid accidental directory reads like './' or '.'
    if (trimmed === "." || trimmed === "./" || trimmed === path.sep) {
      throw new Error("path is a directory or invalid");
    }

    const candidates = [];
    if (path.isAbsolute(imagePath)) candidates.push(imagePath);
    candidates.push(path.resolve(__dirname, imagePath));
    candidates.push(path.resolve(__dirname, "..", "assets", imagePath));
    // try basename in assets as fallback
    candidates.push(
      path.resolve(__dirname, "..", "assets", path.basename(imagePath))
    );

    let absolutePath = null;
    for (const c of candidates) {
      try {
        if (fs.existsSync(c) && fs.statSync(c).isFile()) {
          absolutePath = c;
          break;
        }
      } catch (e) {
        // ignore and continue
      }
    }

    if (!absolutePath) {
      throw new Error(`file not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(absolutePath);
    const base64 = imageBuffer.toString("base64");
    const ext = path.extname(absolutePath).toLowerCase();
    let mimeType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".png") mimeType = "image/png";
    else if (ext === ".svg") mimeType = "image/svg+xml";

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.warn(`Could not load image: ${imagePath}`, err.message);
    return null;
  }
}

/**
 * Generate a comprehensive instant report PDF using the detailed template
 * @param {Object} scoreData - The score data from the API
 * @param {string} recipientEmail - Email of the recipient
 * @param {string} mobileNumber - Mobile number for the report
 * @returns {Promise<string>} - Path to the generated PDF file
 */
export async function generateInstantReportPDF(scoreData, email, mobileNumber) {
  try {
    console.log("🔍 Starting PDF generation...");
    console.log(
      "📊 Raw scoreData received:",
      JSON.stringify(scoreData, null, 2)
    );
    console.log("📱 Mobile number received:", mobileNumber);

    // Handle nested score object from API (in case response has { score: {...} } structure)
    const score = scoreData.score || scoreData;

    console.log("📊 Processed score object:", JSON.stringify(score, null, 2));

    // Extract values with defensive checks
    // Use parameter mobileNumber first, fallback to score data if not provided
// इस फ़ंक्शन को ढूँढें और अपडेट करें
function normalizeIndianMobile(num = "") {
  const digits = String(num).replace(/\D/g, ""); // सिर्फ नंबर रखें
  // अगर नंबर 10 अंक से बड़ा है (जैसे 9198...), तो पीछे के 10 अंक लें
  return digits.length > 10 ? digits.slice(-10) : digits;
}

// फिर generateInstantReportPDF के अंदर जहाँ formatMobileNumber है:
const rawMobileNumber = normalizeIndianMobile(mobileNumber);

const formatMobileNumber = (num) => {
  const numStr = String(num); 
  if (numStr.length === 10) {
    return `${numStr.slice(0, 5)}-${numStr.slice(5)}`;
  }
  return numStr;
};

const finalMobileNumber = formatMobileNumber(rawMobileNumber);
    const gradeValue = score.grade || score.Grade || score.gradeValue || "N/A";
    const basicNumber =
      score.basic_number || score.basicNumber || score.basic_number_score || 0;
    const numberSequence =
      score.number_sequence ||
      score.numberSequence ||
      score.sequence_score ||
      0;

    console.log("🔑 Extracted values:");
    console.log("  - mobile_number:", finalMobileNumber);
    console.log("  - grade:", gradeValue);
    console.log("  - basic_number:", basicNumber);
    console.log("  - number_sequence:", numberSequence);

    // Prepare the API data structure
    const api = {
      title: score.title || "Influence Report",
      mobile_number: finalMobileNumber,
      gradeValue: gradeValue,
      basic_number_score: basicNumber,
      sequence_score: numberSequence,

      // From API Response
      pairs: score.pairs || [],
      grade: gradeValue,
      basic_number: basicNumber,
      number_sequence: numberSequence,

      // Bar scores
      Finance: score.Finance || "0",
      Love: score.Love || "0",
      Fortune: score.Fortune || "0",
      Mind: score.Mind || "0",
      Intuition: score.Intuition || "0",

      // Influence section
      influence_section: score.influence_section || {
        title: "Influence of the mobile number on user and life.",
        points: [],
        health_note: "",
        static_paragraph:
          "A mobile number expresses its influence through many factors\nthe user's gender, age, environment and background, work, role in life, duration of use, and other active numbers.",
        instance_points: [],
        closing:
          "For a deeper look at how numbers influence life paths and choices, explore a Personalised Report.\nwww.consciouskarma.co/personalizedreport",
        as_text: "",
      },

      highlights: score.highlights || [],
      closing_note:
        score.closing_note ||
        "For a deeper look at how numbers influence life paths and choices,\nexplore a Personalised Report.\nLink: Get Personalised Report",

      links: score.links || [
        {
          title: "How a Number Shapes Everyday Life",
          href: "www.consciouskarma.co/blog/.............",
        },
        {
          title: "Blog Link 2 - Why Your Mobile Number Matters",
          href: "www.consciouskarma.co/blog/.............",
        },
        {
          title: "Blog Link 3 - Understanding Energy Through Numbers",
          href: "www.consciouskarma.co/blog/.............",
        },
        {
          title: "Blog Link 4 - The Role of Karma in Number Vibrations",
          href: "www.consciouskarma.co/blog/.............",
        },
      ],
      backnote:
        score.backnote ||
        "Thank you for exploring your number with Conscious Karma.",
    };

    // Build barsObj from API response fields
    api.barsObj = {
      Finance: api.Finance,
      Fortune: api.Fortune,
      Love: api.Love,
      Intuition: api.Intuition,
      Mind: api.Mind,
    };

    api.bars = await parseBarScores(api.barsObj);

    // Load the template
    const templatePath = path.join(
      __dirname,
      "templates",
      "report-template.ejs"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Load ALL images as base64
    const karmaLogo = loadImageAsBase64("Karma transparent.png");
    const consciouskarma = loadImageAsBase64("Conscious Karma.jpeg");
    const fullkarmalogo = loadImageAsBase64("text-circle-logo.png");
    const karmawithline = loadImageAsBase64("karma-line.png");
    const gradeLogo = loadImageAsBase64("Grade.jpg");
    const fullStar = loadImageAsBase64("full-star.jpg");
    const halfStar = loadImageAsBase64("half-star.jpg");
    const blankStar = loadImageAsBase64("blank-star.jpg");

    // Load bar icons as base64
    const financeIcon = loadImageAsBase64("Finance.jpg");
    const fortuneIcon = loadImageAsBase64("Fortune.png");
    const loveIcon = loadImageAsBase64("Love.jpg");
    const intuitionIcon = loadImageAsBase64("Intuition.jpg");
    const intelligenceIcon = loadImageAsBase64("Intelligence.jpg");

    // Load Arsenal font files as base64
    const arsenalRegular = loadImageAsBase64(
      "../public/fonts/Arsenal/Arsenal-Regular.ttf"
    );
    const arsenalBold = loadImageAsBase64(
      "../public/fonts/Arsenal/Arsenal-Bold.ttf"
    );

    // Load Open Sans font files as base64
    const openSansRegular = loadImageAsBase64(
      "../public/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf"
    );
    const openSansItalic = loadImageAsBase64(
      "../public/fonts/Open_Sans/OpenSans-Italic-VariableFont_wdth,wght.ttf"
    );

    // Render the HTML
    const html = ejs.render(template, {
      ...api,
      karmaLogo,
      fullkarmalogo,
      karmawithline,
      consciouskarma,
      gradeLogo,
      fullStar,
      halfStar,
      blankStar,
      financeIcon,
      fortuneIcon,
      loveIcon,
      intuitionIcon,
      intelligenceIcon,
      arsenalRegular,
      arsenalBold,
      openSansRegular,
      openSansItalic,
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
    });

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for fonts
    try {
      await page.evaluateHandle("document.fonts.ready");
    } catch (err) {
      console.warn("Fonts ready check timed out or failed:", err.message);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
    const pdfFilename = `instant_report_${sanitizedEmail}_${timestamp}.pdf`;
    const pdfPath = path.join(__dirname, "..", "temp", pdfFilename);

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      preferCSSPageSize: true,
    });

    await browser.close();
    console.log(`✅ PDF generated: ${pdfPath}`);

    return pdfPath;
  } catch (error) {
    console.error("❌ Error generating instant report PDF:", error);
    throw error;
  }
}
