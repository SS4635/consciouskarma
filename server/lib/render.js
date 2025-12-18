import fs from "fs";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Helper function to load image as base64
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

    // helpful debug: include which file was used
    // console.info(`Loaded image ${imagePath} -> ${absolutePath}`);

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.warn(`Could not load image: ${imagePath}`, err.message);
    return null;
  }
}

(async () => {
  const api = {
    title: "Influence Report",
    // Page 5 data
    mobile_number: "82982-92654",
    gradeValue: "A",
    basic_number_score: 8,
    sequence_score: 8,

    // API Response structure
    pairs: ["38", "89", "93", "34", "44", "40"],
    grade: "D",
    basic_number: 7.5,
    number_sequence: 6,
    Finance: "-5, +1",
    Love: "-1, +4",
    Fortune: "-3, +2",
    Mind: "-3, +2",
    Intuition: "-1",
    influence_section: {
      title: "Influence of the mobile number on user and life.",
      points: [
        "Experiences internal chaos; often feels emotionally isolated amid daily busyness and carries hidden sadness.",
        "Experiences internal chaos; often feels emotionally isolated amid daily busyness and carries hidden sadness.",
        "Breaks in family harmony or trouble with relatives; possible loss of wealth through family or close ones.",
        "If focused on dharma and good deeds, has the rare potential to transform life — in about 1 in 1000 cases, may even rise from poverty to wealth.",
        "Prone to mood swings and erratic fluctuations",
        "Trusts others easily and may face backstabbing, betrayal, or hidden enmity.",
        "Experiences internal chaos; often feels emotionally isolated amid daily busyness and carries hidden sadness.",
        "Breaks in family harmony or trouble with relatives; possible loss of wealth through family or close ones.",
      ],
      health_note: "",
      // "Health depends largely on lifestyle and habits, yet numbers can make one more prone to certain tendencies.",
      static_paragraph:
        "A mobile number expresses its influence through many factors\nthe user's gender, age, environment and background, work, role in life, duration of use, and other active numbers.",
      instance_points: [],

      //["If the number is used by a female — may show tendencies toward hormonal imbalance.",
      //   " If the number is used by an elderly female — possible sensitivity to heart-related issues.",
      // ],
      closing:
        "For a deeper look at how numbers influence life paths and choices, explore a Personalised Report.\nwww.consciouskarma.co/personalizedreport",
      as_text:
        "Influence of the mobile number on user and life.\n\n• Charming and sweet in speech.\n• Experiences internal chaos; often feels emotionally isolated amid daily busyness and carries hidden sadness.\n• Breaks in family harmony or trouble with relatives; possible loss of wealth through family or close ones.\n• If focused on dharma and good deeds, has the rare potential to transform life — in about 1 in 1000 cases, may even rise from poverty to wealth.\n• Prone to mood swings and erratic fluctuations\n• Trusts others easily and may face backstabbing, betrayal, or hidden enmity.\nA mobile number expresses its influence through many factors —\nthe user's gender, age, environment and background, work, role in life, duration of use, and other active numbers.\n\nFor a deeper look at how numbers influence life paths and choices,\nexplore a Personalised Report.\nLink: Get Personalised Report",
    },
    highlights: [
      "Charming and sweet in speech.",
      "Experiences internal chaos; often feels emotionally isolated amid daily busyness and carries hidden sadness.",
      "Breaks in family harmony or trouble with relatives; possible loss of wealth through family or close ones.",
      "If focused on dharma and good deeds, has the rare potential to transform life — in about 1 in 1000 cases, may even rise from poverty to wealth.",
      "Prone to mood swings and erratic fluctuations",
      "Trusts others easily and may face backstabbing, betrayal, or hidden enmity.",
    ],
    closing_note:
      "For a deeper look at how numbers influence life paths and choices,\nexplore a Personalised Report.\nLink: Get Personalised Report",
    // Links section - kept from original
    links: [
      {
        title: "How a Number Shapes Everyday Life",
        href: "www.consciouskarma.co/blog/.............",
      },
      {
        title: "Blog Link 2 - Why Your Mobile Number Matters ",
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
    backnote: "Thank you for exploring your number with Conscious Karma.",
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

  const templatePath = path.join(__dirname, "templates", "report-template.ejs");
  const template = fs.readFileSync(templatePath, "utf8");

  // Load ALL images as base64 — use basenames; loader will resolve into server/assets
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

  // Pass all images and fonts to template
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

  fs.writeFileSync("./report_output.html", html, "utf8");

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // Add headless: false for debugging if needed (will open browser window)
    // headless: false,
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 794,
    height: 1123,
  });

  // Fix: Change waitUntil to 'domcontentloaded' (faster, less strict than networkidle0)
  // and increase timeout to 60s to handle any slow rendering/fonts
  await page.setContent(html, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Wait for fonts only if needed; this can be optional or wrapped in try-catch
  try {
    await page.evaluateHandle("document.fonts.ready");
  } catch (err) {
    console.warn("Fonts ready check timed out or failed:", err.message);
    // Continue anyway for PDF generation
  }

  await page.pdf({
    path: "instant_report.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log("PDF generated: instant_report.pdf");
})();
