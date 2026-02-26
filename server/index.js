// import "dotenv/config"; // ✅ MUST BE THE FIRST LINE

import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({
  path: "/var/www/.env",
});

// import dotenv from "dotenv";
// dotenv.config();
// //channges
import EnergyLog from "./models/EnergyLog.js";
import { protectAndLog } from "./middleware/security.js"; // Path check kar lena

import { connectMongo } from "./lib/mongo.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import Consultation from "./models/Consultation.js";
import { sendConsultationEmails } from "./lib/sendConsultationEmails.js";
import { sendScoreMail } from "./lib/sendScoreMail.js";
import ContactMessage from "./models/ContactMessage.js";
import Category from "./models/Category.js";

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

console.log({
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS_LEN: process.env.SMTP_PASS?.length,
  SMTP_PORT: process.env.SMTP_PORT,
});
const emailOtps = new Map();

const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" })); // Increased limit for safety

// --- 🔍 DEBUG: Start-up Check ---
console.log("---------------------------------------");
console.log("Checking Environment Variables...");
console.log("MONGO_DB:", process.env.MONGODB_DB ? "✅ Loaded" : "❌ Missing");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_USER:", process.env.SMTP_USER ? "✅ Loaded" : "❌ Missing");
console.log(
  "SMTP_PASS:",
  process.env.SMTP_PASS
    ? `✅ Loaded (${process.env.SMTP_PASS.length} chars)`
    : "❌ Missing/Undefined",
);
console.log(
  "RAZORPAY_KEY:",
  process.env.RAZORPAY_KEY_ID ? "✅ Loaded" : "❌ Missing",
);
console.log("---------------------------------------");

// Database Connection
await connectMongo();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // 🔴 IMPORTANT
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});

// ES Module mein __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Uploads folder create karo agar nahi hai
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ⚙️ Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "blog-img-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 🌐 Frontend ko images serve karne ke liye static route
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🚀 Admin Image Upload API
app.post("/api/admin/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ ok: false, message: "No image provided" });

    // URL return kar rahe hain jo frontend text editor me use karega
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, imageUrl });
  } catch (err) {
    console.error("Image upload error:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to upload image" });
  }
});

function normalizeIndianMobile(num = "") {
  const digits = String(num).replace(/\D/g, ""); // सिर्फ नंबर रखें
  // अगर नंबर 10 अंक से बड़ा है (जैसे 9198...), तो पीछे के 10 अंक लें
  return digits.length > 10 ? digits.slice(-10) : digits;
}

async function sendEmail({ to, subject, html }) {
  console.log(`\n[MAIL] Sending to: ${to}`);
  try {
    const result = await transporter.sendMail({
      from:
        process.env.MAIL_FROM ||
        '"Conscious Karma" <no-reply@consciouskarma.co>',
      to,
      subject,
      html,
    });
    console.log("[MAIL] Success:", result.messageId);
    return result;
  } catch (err) {
    console.error("[MAIL] FAILED:", err.message);
  }
}

const rp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// Register the consultation booking endpoint on the main app instance
// app.post("/api/consultation/book", async (req, res) => {
//   try {
//     console.log("--- Consultation formData received ---");
//     console.log(JSON.stringify(req.body, null, 2));
//     if (req.body && typeof req.body === "object") {
//       console.log("Top-level keys:", Object.keys(req.body));
//     }
//     const consultation = new Consultation({
//       formData: req.body.formData,
//       planName: req.body.planName,
//       price: req.body.price,
//     });
//     await consultation.save();
//     // Send emails to user and admin
//     try {
//       await sendConsultationEmails({
//         formData: req.body.formData,
//         docId: consultation._id,
//       });
//     } catch (mailErr) {
//       console.error("Consultation email error:", mailErr);
//     }
//     res.json({
//       ok: true,
//       message: "Consultation booked",
//       id: consultation._id,
//     });
//   } catch (err) {
//     console.error("Consultation booking error:", err);
//     res.status(500).json({ ok: false, message: "Failed to book consultation" });
//   }
// });

async function sendSignupEmails({ email, name }) {
  const userHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0;line-height:1.6;color:#222;">
      <p>Dear <strong>${name || "User"}</strong>,</p>

      <p>Your account has been created successfully.</p>

      <p>
        You can now access your dashboard anytime to view your activity and
        upcoming reports.
      </p>

      <p>
        If you need support, write to us at
        <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
      </p>

      <p style="margin-top:24px;">
        Warm regards,<br/>
        <strong>Conscious Karma</strong>
      </p>
    </div>
  `;

  const adminHtml = `
    <h2>New User Signup</h2>
    <p><strong>Name:</strong> ${name || "-"}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;

  // USER MAIL
  await sendEmail({
    to: email,
    subject: "Welcome to Conscious Karma",
    html: userHtml,
  });

  // ADMIN MAIL (unchanged)
  await sendEmail({
    to: "no-reply@consciouskarma.co",
    subject: "New User Registration",
    html: adminHtml,
  });
}

app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("Received tu call registration request:", req.body);
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: "Email already registered",
      });
    }

    console.log("Registering new user:", email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    console.log("User saved:", user._id);

    // Only send email AFTER successful DB save
    try {
      console.log("Sending signup emails...");
      await sendSignupEmails({ email, name });
      console.log("Signup emails sent successfully");
    } catch (emailErr) {
      console.error("Signup email error:", emailErr);
      // Not blocking the registration response
    }

    return res.json({
      ok: true,
      message: "Account created",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.post("/api/email/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ ok: false, message: "Email required" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    emailOtps.set(email, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    });

    const html = `
      <p>Your verification code is:</p>
      <h2 style="letter-spacing:3px">${code}</h2>
      <p>This code is valid for 10 minutes.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Verify your email – Conscious Karma",
      html,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.json({ ok: false, message: "Failed to send OTP" });
  }
});
app.post("/api/email/verify-otp", (req, res) => {
  const { email, code } = req.body;

  const entry = emailOtps.get(email);
  if (!entry) return res.json({ ok: false, verified: false });

  if (Date.now() > entry.expiresAt)
    return res.json({ ok: false, expired: true });

  if (entry.code !== code) return res.json({ ok: false, verified: false });

  emailOtps.delete(email);
  res.json({ ok: true, verified: true });
});

// User registration endpoint

// app.post("/api/auth/register", async (req, res) => {
//   console.log("Received registration request:", req.body);
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         ok: false,
//         message: "Email and password are required",
//       });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(409).json({
//         ok: false,
//         message: "Email already registered",
//       });
//     }

//     console.log("Registering new user:", email);

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//     });

//     console.log("User saved:", user._id);

//     // Only send email AFTER successful DB save
//     try {
//       console.log("Sending signup emails...");
//       await sendSignupEmails({ email });
//       console.log("Signup emails sent successfully");
//     } catch (emailErr) {
//       console.error("Signup email error:", emailErr);
//       // Not blocking the registration response
//     }

//     return res.json({
//       ok: true,
//       message: "Account created",
//     });

//   } catch (err) {
//     console.error("Registration error:", err);
//     return res.status(500).json({
//       ok: false,
//       message: "Server error",
//     });
//   }
// });

// User login endpoint
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ ok: false, message: "Email and password required" });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ ok: false, message: "User not found" });
//     }

//     // Compare passwords
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ ok: false, message: "Incorrect password" });
//     }

//     // Return user (no JWT in your current setup)
//     res.json({
//       ok: true,
//       message: "Login successful",
//       user: {
//         email: user.email,
//       },
//     });

//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ ok: false, message: "Server error" });
//   }
// });

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("User:", email, password);
    console.log("ENV", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Email and password required" });
    }

    // 👑 1. ADMIN CHECK (Direct from .env)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      console.log("🛡️ [AUTH] Admin logged in");

      // Bina JWT ke return kar rahe hain, frontend isko encrypt karke URL me daalega
      return res.json({
        ok: true,
        role: "admin",
        message: "Admin login successful",
        user: { email },
      });
    }

    // 👤 2. NORMAL USER CHECK (Tera existing flow)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ ok: false, message: "Incorrect password" });
    }

    res.json({
      ok: true,
      role: "user",
      message: "Login successful",
      user: { email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// 📊 GET: Admin Dashboard Today's Summary
// 📊 GET: Admin Dashboard Smart Summary
app.get("/api/admin/summary", async (req, res) => {
  try {
    const { email, range } = req.query;

    // 🛡️ Admin Security Check
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ ok: false, message: "Chal bhag yahan se! 🔒" });
    }

    let dateQuery = {};
    const now = new Date();
    const startDate = new Date();

    // 🕒 Dynamic Date Range Logic
    if (range === "today" || !range) {
      startDate.setHours(0, 0, 0, 0);
      dateQuery = { createdAt: { $gte: startDate, $lte: now } };
    } else if (range === "weekly") {
      startDate.setDate(now.getDate() - 7);
      dateQuery = { createdAt: { $gte: startDate, $lte: now } };
    } else if (range === "monthly") {
      startDate.setDate(now.getDate() - 30);
      dateQuery = { createdAt: { $gte: startDate, $lte: now } };
    } else if (range === "quarterly") {
      startDate.setDate(now.getDate() - 90);
      dateQuery = { createdAt: { $gte: startDate, $lte: now } };
    } else if (range === "yearly") {
      startDate.setDate(now.getDate() - 365);
      dateQuery = { createdAt: { $gte: startDate, $lte: now } };
    } else if (range === "all") {
      dateQuery = {}; // Poori history
    }

    // ⚡ Parallel DB Calls for Superfast Speed
    const [instantCount, personalisedCount, consultCount, contactCount] =
      await Promise.all([
        Order.countDocuments({
          ...dateQuery,
          "formData.parallels": { $size: 0 },
        }),
        Order.countDocuments({
          ...dateQuery,
          "formData.parallels": { $not: { $size: 0 } },
        }),
        Consultation.countDocuments(dateQuery),
        ContactMessage.countDocuments(dateQuery),
      ]);

    res.json({
      ok: true,
      data: {
        instant: instantCount,
        personalised: personalisedCount,
        consult: consultCount,
        contact: contactCount,
        total: instantCount + personalisedCount + consultCount + contactCount, // Pro-level overall metric
      },
    });
  } catch (err) {
    console.error("Summary API Error:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch summary" });
  }
});

// ==========================================
// 🔥 NEW APIs FOR ADMIN DASHBOARD FEATURES
// ==========================================


// ==========================================
// 🔥 CATEGORY APIs
// ==========================================
app.get("/api/admin/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: categories });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// 🌐 PUBLIC API: Fetch All Categories for Blog Page
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: categories });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.post("/api/admin/category", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    const category = await Category.create({ name });
    res.json({ ok: true, category });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to create category (Might be duplicate)" });
  }
});

app.delete("/api/admin/category/:id", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});


// ==========================================
// 🔥 BLOG APIs
// ==========================================

// 1. GET ALL BLOGS (Admin) -> Iski wajah se 404 aa raha tha
app.get("/api/admin/blogs", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ ok: false, message: "Unauthorized access" });
    }
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: blogs });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// 2. CREATE BLOG
app.post("/api/admin/blog", async (req, res) => {
  try {
    const { email, title, content, imageUrl, status, category, keywords } = req.body;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false, message: "Unauthorized" });

    if (!title || !content || !imageUrl) {
      return res.status(400).json({ ok: false, message: "Title, content and image are required" });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const newBlog = await Blog.create({ 
      title, 
      slug, 
      content, 
      imageUrl, 
      status: status || "draft", 
      category: category || "Uncategorized", 
      keywords: keywords || [] 
    });
    
    res.json({ ok: true, message: "Blog saved successfully!", blog: newBlog });
  } catch (err) {
    console.error("Blog save error:", err);
    if (err.code === 11000) return res.status(400).json({ ok: false, message: "Blog with this title already exists." });
    res.status(500).json({ ok: false, message: "Failed to save blog" });
  }
});

// 3. UPDATE BLOG
app.put("/api/admin/blog/:id", async (req, res) => {
  try {
    const { email, title, content, imageUrl, status, category, keywords } = req.body;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, slug, content, imageUrl, status, category, keywords },
      { new: true }
    );
    res.json({ ok: true, message: "Blog updated!", blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to update blog" });
  }
});

// 4. DELETE BLOG
app.delete("/api/admin/blog/:id", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// 1. UPDATE: Save sourceLink when getting energy
app.post("/api/get-energy/:routeId", protectAndLog, async (req, res) => {
  try {
    const { mobile_number, source_link } = req.body;
    const { routeId } = req.params;

    // Save BOTH the API route (routeId) and the URL Key (source_link)
    await EnergyLog.create({
      mobileNumber: mobile_number,
      routeHit: routeId,
      sourceLink: source_link || "direct", 
      ipAddress: req.userIP,
      userAgent: req.headers["user-agent"],
    });

    const CLIENT_API_URL = `https://api.consciouskarma.co/micro/${routeId}`;
    const externalResponse = await axios.post(
      CLIENT_API_URL,
      { mobile_number },
      { headers: { "Content-Type": "application/json", "X-API-Key": "CK_Score_2365abhnf895asfw" } }
    );

    return res.json(externalResponse.data);
  } catch (err) {
    console.error(`Error in route ${req.params.routeId}:`, err.message);
    if (err.response) return res.status(err.response.status).json(err.response.data);
    return res.status(500).json({ ok: false, message: "External API Failed" });
  }
});


// HELPER FUNCTION: To extract UNIQUE active routes from .env
const getActiveRoutes = () => {
  const rawKeys = process.env.LINK_ALLOWED_KEYS || "";
  const keysArray = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
  
  const activeRoutes = keysArray.map(key => {
    const apiPath = process.env[`LINK_${key.toUpperCase()}_API`] || process.env[`LINK_${key.toLowerCase()}_API`];
    return apiPath ? apiPath.replace(/^\//, '') : null; 
  }).filter(Boolean);

  // 🔥 FIX: Return only UNIQUE routes to prevent duplicates in the sidebar
  return [...new Set(activeRoutes)]; 
};

// 1. ACTIVE ROUTES API
app.get("/api/admin/available-routes", (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });
    
    // This will now send a deduplicated array to the frontend
    res.json({ ok: true, data: getActiveRoutes() });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// 2. PREVIOUS/HISTORICAL ROUTES API
app.get("/api/admin/historical-links", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    const activeRoutes = getActiveRoutes(); 
    const allRoutes = await EnergyLog.distinct("routeHit"); 
    
    // Find routes in DB that are NOT currently active
    const historicalRoutes = allRoutes.filter(route => !activeRoutes.includes(route));
    
    res.json({ ok: true, data: historicalRoutes });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// 3. ENERGY LOGS API
app.get("/api/admin/energy-logs", async (req, res) => {
  try {
    const { email, routeHit, search, filterDate, startDate, endDate } = req.query;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    let query = {};
    if (routeHit) query.routeHit = routeHit; 

    if (search && search.trim() !== "") {
      query.mobileNumber = new RegExp(search.trim(), "i");
    }

    if (filterDate && filterDate !== "all") {
      let startObj = new Date();
      startObj.setHours(0, 0, 0, 0);
      
      if (filterDate === "today") query.createdAt = { $gte: startObj };
      else if (filterDate === "last7") { startObj.setDate(startObj.getDate() - 7); query.createdAt = { $gte: startObj }; }
      else if (filterDate === "last30") { startObj.setDate(startObj.getDate() - 30); query.createdAt = { $gte: startObj }; }
      else if (filterDate === "custom" && startDate && endDate) {
        const customStart = new Date(startDate); customStart.setHours(0, 0, 0, 0);
        const customEnd = new Date(endDate); customEnd.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: customStart, $lte: customEnd };
      }
    }

    const logs = await EnergyLog.find(query).sort({ createdAt: -1 });
    res.json({ ok: true, data: logs });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error" });
  }
});
// // 🔒 GET: Admin API - Fetch ALL Blogs (Drafts & Published)
// app.get("/api/admin/blogs", async (req, res) => {
//   try {
//     const { email } = req.query;
//     if (!email || email !== process.env.ADMIN_EMAIL) {
//       return res
//         .status(403)
//         .json({ ok: false, message: "Unauthorized access" });
//     }

//     const blogs = await Blog.find().sort({ createdAt: -1 });
//     res.json({ ok: true, data: blogs });
//   } catch (err) {
//     res.status(500).json({ ok: false, message: "Server error" });
//   }
// });

// // ✏️ PUT: Admin Edit/Update Blog
// app.put("/api/admin/blog/:id", async (req, res) => {
//   try {
//     const { email, title, content, imageUrl, status } = req.body;

//     if (!email || email !== process.env.ADMIN_EMAIL) {
//       return res
//         .status(403)
//         .json({ ok: false, message: "Unauthorized access" });
//     }

//     // Slug dobara generate karenge incase title change hua ho
//     const slug = title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)+/g, "");

//     const updatedBlog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       { title, slug, content, imageUrl, status },
//       { new: true }, // Return updated document
//     );

//     if (!updatedBlog)
//       return res.status(404).json({ ok: false, message: "Blog not found" });

//     res.json({
//       ok: true,
//       message: "Blog updated successfully!",
//       blog: updatedBlog,
//     });
//   } catch (err) {
//     res.status(500).json({ ok: false, message: "Failed to update blog" });
//   }
// });

// 🗑️ DELETE: Admin Delete Blog
app.delete("/api/admin/blog/:id", async (req, res) => {
  try {
    const { email } = req.body; // Delete request me body bhejna allowed hai
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ ok: false, message: "Unauthorized access" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Blog deleted successfully!" });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to delete blog" });
  }
});

// ... [Keep your other imports and setups same] ...

// 🔍 GET: Admin Data with Search & Filters (Updated for Limit 10 and Deep Search)
app.get("/api/admin/data", async (req, res) => {
  try {
    const { email, type, search, filterDate, page = 1, limit = 10 } = req.query; // ✅ Changed default limit to 10

    // 🛡️ Admin Security Check
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ ok: false, message: "Unauthorized access" });
    }

    let query = {};

    // 📅 1. DATE FILTER LOGIC
    if (filterDate && filterDate !== "all") {
      let startDateObj = new Date();
      startDateObj.setHours(0, 0, 0, 0); 
      
      if (filterDate === "today") {
        query.createdAt = { $gte: startDateObj };
      } else if (filterDate === "last7") {
        startDateObj.setDate(startDateObj.getDate() - 7);
        query.createdAt = { $gte: startDateObj };
      } else if (filterDate === "last30") {
        startDateObj.setDate(startDateObj.getDate() - 30);
        query.createdAt = { $gte: startDateObj };
      } else if (filterDate === "custom" && req.query.startDate && req.query.endDate) {
        const customStart = new Date(req.query.startDate);
        customStart.setHours(0, 0, 0, 0);
        const customEnd = new Date(req.query.endDate);
        customEnd.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: customStart, $lte: customEnd };
      }
    }

    // 🔎 2. DEEP SEARCH LOGIC (Matches all labels across modules)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { couponCode: searchRegex },
        { planName: searchRegex },
        { message: searchRegex },
        { "formData.general.name": searchRegex },
        { "formData.general.email": searchRegex },
        { "formData.primary.number": searchRegex }
      ];
    }

    let results = [];
    let totalCount = 0;
    const skip = (Number(page) - 1) * Number(limit);
    const sort = { createdAt: -1 };

    // 📂 3. FETCH DATA BASED ON 'TYPE'
    switch (type) {
      case "instant":
        query["formData.parallels"] = { $size: 0 };
        results = await Order.find(query).sort(sort).skip(skip).limit(Number(limit)).lean();
        totalCount = await Order.countDocuments(query);
        break;
      case "personalised":
        query["formData.parallels"] = { $not: { $size: 0 } };
        results = await Order.find(query).sort(sort).skip(skip).limit(Number(limit)).lean();
        totalCount = await Order.countDocuments(query);
        break;
      case "consult":
        results = await Consultation.find(query).sort(sort).skip(skip).limit(Number(limit)).lean();
        totalCount = await Consultation.countDocuments(query);
        break;
      case "contact":
        results = await ContactMessage.find(query).sort(sort).skip(skip).limit(Number(limit)).lean();
        totalCount = await ContactMessage.countDocuments(query);
        break;
      default:
        return res.status(400).json({ ok: false, message: "Invalid type parameter" });
    }

    res.json({
      ok: true,
      data: results,
      pagination: {
        total: totalCount,
        page: Number(page),
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (err) {
    console.error("Admin Data API Error:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch data" });
  }
});

// 3. ENERGY LOGS API (Updated Search)
app.get("/api/admin/energy-logs", async (req, res) => {
  try {
    const { email, routeHit, search, filterDate, startDate, endDate } = req.query;
    if (!email || email !== process.env.ADMIN_EMAIL) return res.status(403).json({ ok: false });

    let query = {};
    if (routeHit) query.routeHit = routeHit; 

    // ✅ Deep Search for Energy Logs
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { mobileNumber: searchRegex },
        { sourceLink: searchRegex },
        { routeHit: searchRegex },
        { ipAddress: searchRegex }
      ];
    }

    if (filterDate && filterDate !== "all") {
      let startObj = new Date();
      startObj.setHours(0, 0, 0, 0);
      
      if (filterDate === "today") query.createdAt = { $gte: startObj };
      else if (filterDate === "last7") { startObj.setDate(startObj.getDate() - 7); query.createdAt = { $gte: startObj }; }
      else if (filterDate === "last30") { startObj.setDate(startObj.getDate() - 30); query.createdAt = { $gte: startObj }; }
      else if (filterDate === "custom" && startDate && endDate) {
        const customStart = new Date(startDate); customStart.setHours(0, 0, 0, 0);
        const customEnd = new Date(endDate); customEnd.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: customStart, $lte: customEnd };
      }
    }

    const logs = await EnergyLog.find(query).sort({ createdAt: -1 });
    res.json({ ok: true, data: logs });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ... [Keep the rest of your server.js same] ...

import Blog from "./models/Blog.js";

// 📝 POST: Admin Add Blog (Save as Draft or Publish)
app.post("/api/admin/blog", async (req, res) => {
  try {
    // Frontend se email (for security), title, content, image path aur status aayega
    const { email, title, content, imageUrl, status } = req.body;

    // 🛡️ Admin Security Check
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ ok: false, message: "Unauthorized access" });
    }

    if (!title || !content || !imageUrl) {
      return res
        .status(400)
        .json({ ok: false, message: "Title, content and image are required" });
    }

    // URL friendly slug bana rahe hain (E.g., "My First Blog" -> "my-first-blog")
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      imageUrl, // Ye tera local path aayega jaise: "/uploads/blog-img-123.jpg"
      status: status || "draft", // Agar status nahi aaya toh default 'draft'
    });

    res.json({
      ok: true,
      message:
        status === "published"
          ? "Blog published successfully!"
          : "Blog saved as draft!",
      blog: newBlog,
    });
  } catch (err) {
    console.error("Blog save error:", err);
    // Agar same title dobara use kiya toh slug duplicate ka error aayega
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ ok: false, message: "Blog with this title already exists." });
    }
    res.status(500).json({ ok: false, message: "Failed to save blog" });
  }
});

// server.js mein is route ko replace karein agar nahi kiya hai toh
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .select("title slug imageUrl content createdAt category keywords") 
      .sort({ createdAt: -1 });
    res.json({ ok: true, data: blogs });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// 📖 GET: Public API - Fetch Single Blog Detail (Read More ke liye)
app.get("/api/blogs/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({ ok: false, message: "Blog not found" });
    }

    res.json({ ok: true, data: blog });
  } catch (err) {
    console.error("Fetch single blog error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.post("/api/pay/create-consultation-order", async (req, res) => {
  try {
    const { formData, planName, price } = req.body;

    if (!formData || !planName || !price) {
      return res.json({ ok: false, message: "Missing form data" });
    }

    // 🛡️ FIX: Remove "₹" and spaces, convert to number
    const numericPrice = Number(String(price).replace(/[^0-9.]/g, ""));

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.json({ ok: false, message: "Invalid price format" });
    }

    const amountInPaise = numericPrice * 100;

    const rzpOrder = await rp.orders.create({
      amount: amountInPaise,
      currency: "INR",
    });

    return res.json({
      ok: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: rzpOrder.id,
      amount: amountInPaise,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.json({
      ok: false,
      message: "Failed creating consultation order",
    });
  }
});



app.post("/api/pay/verify-consultation", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
      planName,
      price,
    } = req.body;

    console.log(`[VERIFY] Processing for plan: ${planName}, Price Input: ${price}`);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ ok: false, message: "Missing Razorpay params" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.json({ ok: false, message: "Invalid signature" });
    }

    // 🚀 BULLETPROOF DATA EXTRACTION
    const step1 = formData?.["1"] || {};
    const step2 = formData?.["2"] || {};
    const general = formData?.general || {};
    const primary = formData?.primary || {};

    const finalName = general.name || step1["Name"] || formData?.name || "User";
    const finalEmail = general.email || step1["Email-id"] || formData?.email || "";
    
    let finalPhone = "";
    if (primary.number) {
        finalPhone = `${primary.isd || ""}${primary.number}`;
    } else if (step2["Mobile Number"]?.mobile) {
        finalPhone = `${step2["Mobile Number"].isd || ""}${step2["Mobile Number"].mobile}`;
    } else {
        finalPhone = formData?.phone || formData?.mobile || "";
    }

    // 🛡️ Price Sanitization
    let finalPrice = Number(String(price).replace(/[^0-9.]/g, ""));
    if (isNaN(finalPrice)) {
        finalPrice = Number(formData?.price) || Number(formData?.totalPrice) || 0;
    }

    // 🚨 ULTIMATE MAGIC FIX: Har jagah email daal do taaki mailer function crash na ho!
    const safeFormData = {
        ...formData,
        name: finalName,       
        email: finalEmail,     
        phone: finalPhone,     
        general: {
            ...general,
            name: finalName,
            email: finalEmail  
        },
        "1": {                 
            ...step1,
            "Name": finalName,
            "Email-id": finalEmail 
        },
        primary: {
            ...primary,
            number: finalPhone,
            isd: primary.isd || step2["Mobile Number"]?.isd || "+91"
        }
    };

    console.log(`[VERIFY] Saving to DB -> Name: ${finalName} | Email: ${finalEmail} | Phone: ${finalPhone}`);

    // ✅ Save to DB
    const consultation = await Consultation.create({
      formData: safeFormData,
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      planName,
      price: finalPrice, 
      paymentStatus: "paid",
    });

    // Send Emails (Non-blocking)
    try {
      await sendConsultationEmails({
        formData: safeFormData, 
        docId: consultation._id,
      });
      // Email success hui toh Status Update karo
      consultation.emailSent = true;
      await consultation.save();
    } catch (mailErr) {
      console.error("Consultation Email Failed:", mailErr.message);
    }

    return res.json({ ok: true, id: consultation._id });
  } catch (err) {
    console.error("verify-consultation error:", err);
    res.status(500).json({ ok: false, message: "Verification failed on server" });
  }
});
// app.post("/api/pay/verify-consultation", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       formData,
//       planName,
//       price,
//     } = req.body;

//     console.log(
//       `[VERIFY] Processing for plan: ${planName}, Price Input: ${price}`,
//     );

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.json({ ok: false, message: "Missing Razorpay params" });
//     }

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expected = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expected !== razorpay_signature) {
//       return res.json({ ok: false, message: "Invalid signature" });
//     }

//     // Extract Info
//     const general = formData?.general || {};
//     const primary = formData?.primary || {};
//     const phone = `${primary.isd || ""}${primary.number || ""}`;

//     // 🛡️ FIX: Sanitise Price for Database (Prevents NaN Crash)
//     let finalPrice = Number(String(price).replace(/[^0-9.]/g, ""));

//     // Fallback: If price is still invalid, try getting it from form or default to 0
//     if (isNaN(finalPrice)) {
//       console.warn("⚠️ Price invalid, attempting fallback...");
//       finalPrice = Number(formData?.price) || Number(formData?.totalPrice) || 0;
//     }

//     console.log(`[VERIFY] Saving to DB with Final Price: ${finalPrice}`);

//     // ✅ Save to DB (Only Once!)
//     const consultation = await Consultation.create({
//       formData,
//       name: general.name,
//       email: general.email,
//       phone,
//       planName,
//       price: finalPrice,
//       paymentStatus: "paid",
//     });

//     // Send Emails (Non-blocking)
//     try {
//       await sendConsultationEmails({
//         formData,
//         docId: consultation._id,
//       });
//       consultation.emailSent = true;
//   await consultation.save();
//     } catch (mailErr) {
//       console.error("Consultation Email Failed:", mailErr.message);
//     }

//     return res.json({ ok: true, id: consultation._id });
//   } catch (err) {
//     console.error("verify-consultation error:", err);
//     res
//       .status(500)
//       .json({ ok: false, message: "Verification failed on server" });
//   }
// });
/* ---------- Twilio Verify ---------- */

async function getAuthToken() {
  try {
    const params = new URLSearchParams({
      customerId: process.env.MC_CUSTOMER_ID,
      key: process.env.MC_API_KEY,
      scope: "NEW",
      country: process.env.MC_COUNTRY_CODE || "91",
      email: process.env.MC_AUTH_EMAIL, // ADD THIS
    });

    const url = `https://cpaas.messagecentral.com/auth/v1/authentication/token?${params.toString()}`;

    console.log("Auth Token URL:", url);

    const { data } = await axios.get(url, {
      headers: { Accept: "*/*" },
    });

    console.log("Auth Token Response:", data);

    if (data?.token) {
      console.log("Obtained auth token", data.token);
      return data.token;
    }

    throw new Error("No auth token returned");
  } catch (err) {
    console.error("Auth Token Error:", err.response?.data || err);
    throw err;
  }
}

/* ---------- Coupon allowlist ---------- */

const allowlist = new Set(
  (process.env.COUPON_ALLOWLIST || "")
    .split(/\s|,|;/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean),
);
const isAllowlisted = (c = "") => allowlist.has(String(c).toUpperCase());

/* ---------- Partner redeem ---------- */

// async function redeemCoupon(code, mobile) {
//   if (!code) return null;

//   const url = process.env.CK_COUPON_API_URL;
//   const apiKey = process.env.CK_COUPON_API_KEY;

//   if (!url || !apiKey) {
//     throw new Error("Coupon API env not configured");
//   }

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-API-Key": apiKey,
//     },
//     body: JSON.stringify({
//       coupon: code,
//       mobile_number: mobile,
//     }),
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     console.error("Coupon API HTTP Error:", response.status, text);
//     throw new Error(`Coupon API failed with status ${response.status}`);
//   }

//   const data = await response.json();
//   console.log("Redeem coupon response:", data);

//   return data;
// }

// app.post("/api/coupon/validate", async (req, res) => {
//   try {
//     const { code, price, mobile, email } = req.body || {};
//     const baseAmount = Number(price || 0);

//     const result = await redeemCoupon(code, mobile);

//     console.log("Coupon validate result:", result);

//     if (result.status === "success") {
//       try {
//         const phone = mobile;

//         console.log("[SCORE] Generating score for:", phone, email);

//         const { data: scoreResponse } = await axios.post(
//           `${process.env.REACT_APP_SCORE_API}/score`,
//           { mobile_number: phone },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
//             },
//           }
//         );

//         const scoreData = scoreResponse.score || scoreResponse;

//         await sendScoreMail(email, scoreData, phone);

//         console.log("[SCORE] Score generated and mailed successfully");
//       } catch (err) {
//         console.error("[SCORE] Failed:", err.response?.data || err.message);
//       }
//     }

//     return res.json({
//       valid: true,
//       finalAmount: 0,
//       couponApplied: true,
//       coupon: code,
//     });
//   } catch (err) {
//     console.error("Coupon validate error:", err.message);
//     return res.json({
//       valid: false,
//       finalAmount: Number(req.body?.price || 0),
//       message: "Coupon validation failed",
//     });
//   }
// });

// app.post("/api/coupon/validate", async (req, res) => {
//   try {
//     const { code, price, mobile, email, name } = req.body || {};

//     const baseAmount = Number(price || 0);

//     const result = await redeemCoupon(code, mobile);

//     console.log("Coupon validate result:", result);

//     // ✅ SEND RESPONSE FIRST (FAST)
//     res.json({
//       valid: true,
//       finalAmount: 0,
//       couponApplied: true,
//       coupon: code,
//     });

//     // 🔥 BACKGROUND TASK (DO NOT AWAIT)
//     if (result.status === "success") {
//       (async () => {
//         try {
//           const phone = mobile;

//           console.log("[SCORE] Background score generation:", phone, email);

//           const { data: scoreResponse } = await axios.post(
//             `${process.env.REACT_APP_SCORE_API}/score`,
//             { mobile_number: phone },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
//               },
//               timeout: 15000, // ⏱ safety
//             }
//           );

//           const scoreData = scoreResponse.score || scoreResponse;
// const userName =
//   name ||
//   email?.split("@")[0] ||
//   "User";

// await sendScoreMail(email, scoreData, phone, userName);

//           console.log("[SCORE] Background score + mail done");
//         } catch (err) {
//           console.error(
//             "[SCORE] Background failed:",
//             err.response?.data || err.message
//           );
//         }
//       })();
//     }
//   } catch (err) {
//     console.error("Coupon validate error:", err.message);
//     return res.json({
//       valid: false,
//       finalAmount: Number(req.body?.price || 0),
//       message: "Coupon validation failed",
//     });
//   }
// });
// ✅ Final Redeem Function (Using New Key)
async function redeemCoupon(code, mobile) {
  const url = process.env.CK_COUPON_API_URL;
  const apiKey = process.env.CK_COUPON_API_KEY; // Nayi key use hogi yahan

  try {
    const response = await axios.post(
      url,
      { coupon: code, mobile_number: mobile },
      { headers: { "X-API-Key": apiKey } },
    );
    return response.data;
  } catch (err) {
    console.error("Coupon API Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "Invalid coupon");
  }
}

// ✅ Final Validate Route
app.post("/api/coupon/validate", async (req, res) => {
  try {
    const { code, price, mobile, email, name } = req.body;

    // Partner API se check karo
    const result = await redeemCoupon(code, mobile);

    if (result.status === "success") {
      // 1. Database mein entry (Taaki mail engine trigger ho)
      const order = await Order.create({
        name: name || email.split("@")[0],
        email: email,
        phone: mobile,
        amount: 0,
        status: "free",
        couponCode: String(code).toUpperCase(),
        formData: {
          general: { name, email },
          primary: { isd: "+91", number: mobile },
          totalPrice: Number(price) / 100,
          parallels: [],
          previousNumbers: [],
        },
      });

      // 2. Client ko Response
      res.json({ valid: true, finalAmount: 0, orderId: order._id });

      // 3. Background Process (Email + Score)
      processInstantReport(order).catch(console.error);
    }
  } catch (err) {
    res.status(400).json({ valid: false, message: err.message });
  }
});

app.post("/api/coupon/validate", async (req, res) => {
  try {
    const { code, price, mobile, email, name } = req.body || {};

    // 1. Coupon check karo
    const result = await redeemCoupon(code, mobile);

    if (result.status === "success") {
      // ✅ Sabse pehle Order create karo (Isi ki wajah se mail nahi ja rahi thi)
      const order = await Order.create({
        name: name || email.split("@")[0],
        email: email,
        phone: mobile,
        amount: 0,
        currency: "INR",
        status: "free",
        couponCode: code.toUpperCase(),
        instantEmailSent: "processing", // Lock lagao
        formData: {
          general: { name, email },
          primary: { isd: "+91", number: mobile },
          parallels: [],
          previousNumbers: [],
          totalPrice: Number(price) / 100,
        },
      });

      // ✅ Response bhejo taaki Frontend success dikhaye
      res.json({
        valid: true,
        finalAmount: 0,
        couponApplied: true,
        coupon: code,
        orderId: order._id,
      });

      // ✅ Background mein Report aur Mail trigger karo
      // Hum wahi function use karenge jo paid flow mein use hota hai
      processInstantReport(order).catch((err) =>
        console.error("Coupon Mail Error:", err.message),
      );
    } else {
      return res.json({
        valid: false,
        message: result.message || "Invalid coupon",
      });
    }
  } catch (err) {
    console.error("Coupon validate error:", err.message);
    return res
      .status(500)
      .json({ valid: false, message: "Server error during validation" });
  }
});

app.post("/api/send-otp", async (req, res) => {
  try {
    const { number } = req.body;
    console.log("Send OTP request for number:", req.body);
    if (!number) {
      return res.status(400).json({
        ok: false,
        message: "Number is required",
      });
    }

    const authToken = await getAuthToken();

    const url = `https://cpaas.messagecentral.com/verification/v3/send?customerId=${process.env.MC_CUSTOMER_ID}&countryCode=${process.env.MC_COUNTRY_CODE}&flowType=SMS&mobileNumber=${number}`;

    const { data } = await axios.post(
      url,
      {},
      {
        headers: {
          authToken,
          Accept: "*/*",
        },
      },
    );

    console.log("Send OTP Response:", data);

    if (data?.data?.verificationId) {
      res.json({
        ok: true,
        verificationId: data.data.verificationId,
        timeout: data.data.timeout,
      });
    } else {
      res.json({
        ok: false,
        message: "Could not generate verificationId",
        response: data,
      });
    }
  } catch (err) {
    console.error("Send OTP Error:", err.response?.data || err.message);
    res.status(500).json({
      ok: false,
      message: "Failed to send OTP",
    });
  }
});

app.get("/api/consultation/plans", (req, res) => {
  const plans = [
    {
      id: 1,
      title: process.env.REACT_APP_PLAN_1_TITLE,
      price: Number(
        String(process.env.REACT_APP_PLAN_1_PRICE || "").replace(
          /[^0-9.]/g,
          "",
        ),
      ),
      displayPrice: process.env.REACT_APP_PLAN_1_PRICE,
      description: process.env.REACT_APP_PLAN_1_DESC,
      maxSteps: 4,
      isExtended: false,
    },
    {
      id: 2,
      title: process.env.REACT_APP_PLAN_2_TITLE,
      price: Number(
        String(process.env.REACT_APP_PLAN_2_PRICE || "").replace(
          /[^0-9.]/g,
          "",
        ),
      ),
      displayPrice: process.env.REACT_APP_PLAN_2_PRICE,
      description: process.env.REACT_APP_PLAN_2_DESC,
      maxSteps: 5,
      isExtended: false,
    },
    {
      id: 3,
      title: process.env.REACT_APP_PLAN_3_TITLE,
      price: Number(
        String(process.env.REACT_APP_PLAN_3_PRICE || "").replace(
          /[^0-9.]/g,
          "",
        ),
      ),
      displayPrice: process.env.REACT_APP_PLAN_3_PRICE,
      description: process.env.REACT_APP_PLAN_3_DESC,
      maxSteps: 5,
      isExtended: true,
    },
  ];

  res.json({ ok: true, plans });
});

/* ---------- Create order AFTER OTP verified ---------- */
/* Frontend sends full form + price once all OTPs are verified */
app.post("/api/pay/create-order", async (req, res) => {
  try {
    const {
      general,
      primary,
      parallels,
      previousNumbers,
      coupon,
      accountChoice,
      price,
    } = req.body || {};

    if (!general?.name || !general?.email || !primary?.number) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields" });
    }

    const basePrice = Number(price || 0);

    const hasCoupon = Boolean(coupon);

    const amount = hasCoupon ? 0 : basePrice * 100;

    // ALWAYS LATEST NUMBER
    const primaryFull = `${primary.isd}${primary.number}`;

    const order = await Order.create({
      name: general.name,
      email: general.email,
      phone: primaryFull,
      amount,
      currency: "INR",
      status: amount === 0 ? "free" : "pending",
      couponCode: coupon ? String(coupon).toUpperCase() : null,
      couponRedeemed: false,
      accountChoice: accountChoice || "guest",
      otpVerified: true,
      formData: {
        general,
        primary: {
          isd: primary.isd,
          number: primary.number,
        },
        parallels,
        previousNumbers,
        totalPrice: basePrice,
      },
    });

    // If coupon made it fully free, no Razorpay
    if (amount === 0) {
      processInstantReport(order).catch(console.error);
      return res.json({
        ok: true,
        free: true,
        orderId: order._id,
        amount,
      });
    }

    // Create Razorpay order (fast network hit)
    const rOrder = await rp.orders.create({
      amount,
      currency: "INR",
      receipt: String(order._id),
    });

    order.razorpay = { orderId: rOrder.id };
    await order.save();

    // ❌ NO EMAIL HERE – only return data
    return res.json({
      ok: true,
      free: false,
      orderId: order._id,
      order: rOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/* ---------- Verify Razorpay payment ---------- */

// app.post("/api/pay/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       orderId,
//     } = req.body || {};

//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature ||
//       !orderId
//     ) {
//       return res.status(400).json({
//         ok: false,
//         message: "Missing Razorpay parameters",
//       });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         ok: false,
//         message: "Order not found",
//       });
//     }

//     /* ---------- Verify Razorpay signature ---------- */
//     const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expected = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(payload)
//       .digest("hex");

//     if (expected !== razorpay_signature) {
//       return res.status(400).json({
//         ok: false,
//         message: "Invalid Razorpay signature",
//       });
//     }

//     /* ---------- Mark order paid ---------- */
//     order.status = "paid";
//     order.razorpay = {
//       ...(order.razorpay || {}),
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//     };

//     /* ---------- Instant Report detection (CORRECT) ---------- */
//     const isInstantReport =
//       (order.formData?.parallels?.length || 0) === 0 &&
//       (order.formData?.previousNumbers?.length || 0) === 0;

//     /* ---------- Send email ONLY ONCE ---------- */
//     if (isInstantReport && !order.instantEmailSent) {
//       const userHtml = `
//         <p>Dear ${order.name},</p>

//         <p>
//           Thank you for your order.<br/>
//           Your <strong>Instant Mobile Number Report</strong> is now being generated
//           and will be delivered to this email shortly.
//         </p>

//         <p>
//           If you have any questions, feel free to write to us at
//           <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
//         </p>

//         <p>
//           Warm regards,<br/>
//           <strong>Conscious Karma</strong>
//         </p>
//       `;

//       try {
//         await sendEmail({
//           to: order.email,
//           subject: "Your Instant Report is being prepared",
//           html: userHtml,
//         });

//           if (process.env.INTERNAL_SCORE_SECRET !== process.env.FINAL_SECRET) {
//   throw new Error("Internal security misconfigured");

// }

// try {
//   const phone = order.phone; // already stored as full number
//   const email = order.email;

//   console.log("[SCORE] Generating score for:", phone, email);

//   const { data: scoreResponse } = await axios.post(
//     `${process.env.REACT_APP_SCORE_API}/score`,
//     { mobile_number: phone },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
//       },
//     }
//   );

//   const scoreData = scoreResponse.score || scoreResponse;

//   await sendScoreMail(email, scoreData, phone);

//   console.log("[SCORE] Score generated and mailed successfully");
// } catch (err) {
//   console.error("[SCORE] Failed:", err.response?.data || err.message);
// }
//         order.instantEmailSent = true; // 🔒 prevent duplicate mail
//       } catch (mailErr) {
//         console.error("Instant report mail failed:", mailErr);
//       }
//     }

//     await order.save();

//     return res.json({ ok: true });
//   } catch (err) {
//     console.error("pay/verify error:", err);
//     return res.status(500).json({
//       ok: false,
//       message: "Server error",
//     });
//   }
// });

app.post("/api/pay/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ ok: false, message: "Missing params" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ ok: false, message: "Order not found" });
    }

    // 🔐 Verify Razorpay signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ ok: false, message: "Invalid signature" });
    }

    // ✅ Mark order paid
    order.status = "paid";
    order.razorpay = {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    };

    await order.save();

    // 🚀 IMPORTANT: SEND RESPONSE IMMEDIATELY
    res.json({ ok: true });

    // ===============================
    // 🔁 BACKGROUND TASKS (NO AWAIT)
    // ===============================
    processInstantReport(order).catch((err) => {
      console.error("Background task failed:", err);
    });
  } catch (err) {
    console.error("pay/verify error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});
async function processInstantReport(order) {
  // 1️⃣ Check: Instant report hai ya nahi
  const isInstantReport =
    (order.formData?.parallels?.length || 0) === 0 &&
    (order.formData?.previousNumbers?.length || 0) === 0;

  if (!isInstantReport) return;

  // 2️⃣ Atomic lock (duplicate email protection)
  const freshOrder = await Order.findOneAndUpdate(
    { _id: order._id, instantEmailSent: { $ne: true } },
    { $set: { instantEmailSent: "processing", status: "processing" } },
    { new: true },
  );

  if (!freshOrder) return; // already processed or in-progress

  try {
    const fd = freshOrder.formData || {};
    const general = fd.general || {};

    // नाम निकालने का सही क्रम: पहले Form का नाम, फिर Order का नाम, फिर Email
    const userName =
      general.name ||
      freshOrder.name ||
      (freshOrder.email ? freshOrder.email.split("@")[0] : "User");

    const primary = fd.primary || {};
    const userPhone = `${primary.number || ""}`;

    // 3️⃣ ईमेल भेजते समय userName पास करें
    await sendEmail({
      to: freshOrder.email,
      subject: "Your Instant Report is being prepared",
      html: `
    <p>Dear ${userName},</p>

    <p>Thank you for your order.</p>

    <p>
      Your Instant Mobile Number Report is now being generated and will be
      delivered to this email shortly.
    </p>

    <p>
      If you have any questions, feel free to write to us at
      <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
    </p>

    <p>
      Warm regards,<br/>
      Conscious Karma
    </p>
  `,
    });

    console.log("✅ Instant report email sent to:");
    // 4️⃣ Internal security check
    if (process.env.INTERNAL_SCORE_SECRET !== process.env.FINAL_SECRET) {
      throw new Error("Security misconfigured");
    }

    console.log("🔐 Internal security check passed");

    // 5️⃣ Generate score
    // const { data } = await axios.post(
    //   `${process.env.REACT_APP_SCORE_API}/score`,
    //   { mobile_number: userPhone },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
    //     },
    //     timeout: 15000,
    //   }
    // );

    // const scoreData = data.score || data;

    let scoreData;

    try {
      console.log("📡 [SCORE] Calling score API...");
      const startTime = Date.now();

      // Generate score logic inside processInstantReport
      const response = await axios.post(
        `${process.env.REACT_APP_SCORE_API}/score`,
        { mobile_number: userPhone },
        {
          headers: {
            "Content-Type": "application/json",
            // ✅ Yahan confirm karein ki hum vahi key bhej rahe hain jo client ne di hai
            "X-API-Key":
              process.env.REACT_APP_SCORE_API_KEY ||
              "CK_Score_2365abhnf895asfw",
          },
          timeout: 15000,
        },
      );

      console.log("✅ [SCORE] API success in", Date.now() - startTime, "ms");

      const { data } = response;

      if (!data) {
        throw new Error("Empty response from score API");
      }

      scoreData = data.score || data;

      if (!scoreData || typeof scoreData !== "object") {
        throw new Error("Invalid score data structure");
      }

      console.log(
        "📊 [SCORE] Parsed score data:\n",
        JSON.stringify(scoreData, null, 2),
      );
    } catch (err) {
      console.error("❌ [SCORE] API failed");

      if (err.response) {
        console.error("➡️ Status:", err.response.status);
        console.error(
          "➡️ Response:",
          JSON.stringify(err.response.data, null, 2),
        );
      } else if (err.request) {
        console.error("➡️ No response received:", err.message);
      } else {
        console.error("➡️ Internal error:", err.message);
      }

      // rethrow or return early depending on your flow
      throw err;
    }

    console.log("[SCORE] Generated score for:", scoreData);
    // 6️⃣ Send score email
    try {
      console.log("✉️ Sending score email...");
      await sendScoreMail(freshOrder.email, scoreData, userPhone, userName);
      console.log("✅ Score email sent");
await Order.updateOne({ _id: freshOrder._id }, { $set: { instantEmailSent: true } });
    } catch (mailErr) {
      console.error("⚠️ Email failed (PDF generated):", mailErr.message);
    }

    // ...
  } catch (err) {
    console.error("❌ Instant report failed:", err.message);
  }
}

import rateLimit from "express-rate-limit";
const linkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/link", linkLimiter, async (req, res) => {
  try {
    const { key } = req.body;
    console.log("--- LINK DEBUG START ---");
    console.log("Received Key:", key);

    if (!key) {
      return res.status(400).json({ ok: false, code: "MISSING_KEY" });
    }

    // 1. Check if key exists in the allowed list (Case Insensitive)
    const allowed = (process.env.LINK_ALLOWED_KEYS || "")
      .split(",")
      .map((k) => k.trim().toLowerCase());

    if (!allowed.includes(key.toLowerCase())) {
      console.log("Access Denied: Key not in allowed list.");
      return res.status(401).json({ ok: false, code: "INVALID_KEY" });
    }

    // 2. Map Key -> Route (Try both uppercase and lowercase)
    // If key is "abc", looks for LINK_ABC_API or LINK_abc_API
    const apiPath =
      process.env[`LINK_${key.toUpperCase()}_API`] ||
      process.env[`LINK_${key.toLowerCase()}_API`];

    if (!apiPath) {
      console.error(
        `CONFIG ERROR: Variable LINK_${key.toUpperCase()}_API is missing in .env`,
      );
      // Return 404 instead of 500 so it's easier to debug
      return res.status(404).json({
        ok: false,
        code: "API_NOT_MAPPED",
        details: `Missing environment variable for: ${key}`,
      });
    }

    console.log("Success! Routing to:", apiPath);
    return res.json({ ok: true, route: apiPath });
  } catch (err) {
    console.error("CRITICAL LINK ERROR:", err.message);
    return res.status(500).json({ ok: false, code: "SERVER_ERROR" });
  }
});

app.get("/api/link/check", (req, res) => {
  const { key } = req.query;

  if (!key) return res.json({ valid: false });

  const allowed = (process.env.LINK_ALLOWED_KEYS || "")
    .split(",")
    .map((k) => k.trim());

  res.json({ valid: allowed.includes(key) });
});

app.post("/api/pay/verify-report", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        ok: false,
        message: "Missing Razorpay parameters",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    /* ---------- Verify Razorpay signature ---------- */
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        ok: false,
        message: "Invalid Razorpay signature",
      });
    }

    /* ---------- Mark order paid ---------- */
    order.status = "paid";
    order.razorpay = {
      ...(order.razorpay || {}),
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    };

    await order.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error("pay/verify error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

// routes/config.js or directly in server.js
app.get("/api/config/price", (req, res) => {
  res.json({
    price: Number(process.env.REACT_APP_INSTANT_REPORT_PRICE || 0),
  });
});
app.get("/api/config/personalizereportprice", (req, res) => {
  res.json({ price: Number(process.env.REACT_APP_REPORT_BASE_PRICE || 1) });
});

/* ---------- Final submit AFTER payment verified ---------- */
/* Frontend calls this with orderId once /api/pay/verify is ok */

app.get("/test-mail", async (req, res) => {
  try {
    await sendEmail({
      to: "ahanaoberoi2001@gmail.com",
      subject: "Test Hostinger Email",
      html: "<h2>Hello! Hostinger SMTP working!</h2>",
    });
    res.json({ ok: true, message: "Mail sent" });
  } catch (err) {
    console.error("Mail Test Error:", err);
    res.json({ ok: false, error: err.message });
  }
});
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { verificationId, code } = req.body || {};
    console.log("Verify OTP request body:", req.body);

    if (!verificationId || !code) {
      return res.status(400).json({
        ok: false,
        verified: false,
        message: "verificationId and code are required",
      });
    }

    const authToken = await getAuthToken(); // yahi token send-otp me bhi use ho raha hai

    // ❗ API docs ke according validateOtp ko GET se call karna hai
    const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${encodeURIComponent(
      verificationId,
    )}&code=${encodeURIComponent(code)}`;

    const { data } = await axios.get(url, {
      headers: {
        authToken, // EXACT header name docs jaisa
        Accept: "*/*",
      },
    });

    console.log("Verify OTP Response:", data);

    const verified =
      data?.data?.verificationStatus === "VERIFICATION_COMPLETED";

    return res.json({
      ok: true,
      verified,
    });
  } catch (err) {
    console.error(
      "Verify OTP Error:",
      err.response?.status,
      err.response?.data || err.message,
    );

    // Debug ke liye providerStatus/body bhej sakte ho – baad me hata dena
    return res.status(200).json({
      ok: false,
      verified: false,
      message: "OTP verification failed",
      providerStatus: err.response?.status,
      providerBody: err.response?.data,
    });
  }
});

app.post("/api/auth/check-password", async (req, res) => {
  try {
    const { email, oldPassword } = req.body || {};

    if (!email || !oldPassword) {
      return res
        .status(400)
        .json({
          ok: false,
          valid: false,
          message: "Email and password required",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, valid: false, message: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ ok: false, valid: false, message: "Incorrect password" });
    }

    res.json({ ok: true, valid: true });
  } catch (err) {
    console.error("check-password error:", err);
    res.status(500).json({ ok: false, valid: false, message: "Server error" });
  }
});
app.post("/api/auth/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body || {};

    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ ok: false, message: "Email, old, and new password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ ok: false, message: "Incorrect current password" });
    }

    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.json({ ok: true, message: "Password updated" });
  } catch (err) {
    console.error("change-password error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});
// After other APIs, before /api/health
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message, page } = req.body || {};

    if (!firstName || !email || !message) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ SAVE TO DB
    const contact = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      message,
      page: page || "Contact Us",
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });

    // 2️⃣ ADMIN EMAIL
    const adminHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Page:</strong> ${page || "Contact Us"}</p>

      <h3>Message</h3>
      <pre style="white-space:pre-wrap;">${message}</pre>

      <hr/>
      <p><strong>ID:</strong> ${contact._id}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `;

    // non-blocking mail
    sendEmail({
      to: "hello@consciouskarma.co",
      subject: "New Contact Message – Conscious Karma",
      html: adminHtml,
    }).catch((err) => console.error("Contact mail failed:", err.message));

    return res.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.get("/api/user-activity", async (req, res) => {
  try {
    const { email } = req.query || {};
    if (!email) {
      return res
        .status(400)
        .json({ ok: false, message: "Email query param is required" });
    }

    // Instant + personalized reports
    const orders = await Order.find({ email }).sort({ createdAt: -1 }).lean();

    // Consultations – assuming email stored under formData.general.email
    const consultations = await Consultation.find({
      "formData.general.email": email,
    })
      .sort({ createdAt: -1 })
      .lean();

    const activity = [];

    for (const o of orders) {
      const hasFormData =
        o.formData && Object.keys(o.formData || {}).length > 0;

      activity.push({
        kind: hasFormData ? "personalized-report" : "instant-report",
        _id: o._id,
        createdAt: o.createdAt,
        status: o.status,
        amount: o.amount,
        phone: o.phone,
        pdfUrl: o.pdfUrl || null,
      });
    }

    for (const c of consultations) {
      activity.push({
        kind: "consultation",
        _id: c._id,
        createdAt: c.createdAt,
        planName: c.planName,
        price: c.price,
      });
    }

    // Sort all together (latest first)
    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ ok: true, data: activity });
  } catch (err) {
    console.error("user-activity error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.post("/api/report/submit", async (req, res) => {
  try {
    const { orderId } = req.body || {};
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ ok: false, message: "Order not found" });

    if (!(order.status === "paid" || order.status === "free")) {
      return res
        .status(400)
        .json({ ok: false, message: "Payment not completed" });
    }

    const fd = order.formData || {};
    const general = fd.general || {};
    const primary = fd.primary || {};

    // ALWAYS latest mobile from formData
    const primaryFull = `${primary.isd}${primary.number}`;

    const totalPrice = fd.totalPrice || order.amount / 100;

    /* ----- Admin email ----- */
    const adminHtml = `
      <h2>New Personalized Report Request (Paid)</h2>
      <p><strong>Name:</strong> ${general.name}</p>
      <p><strong>Email:</strong> ${general.email}</p>
      <p><strong>Primary Mobile:</strong> ${primaryFull}</p>
      <p><strong>Total Price:</strong> ₹${totalPrice}</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <h3>Full Form Data</h3>
      <pre>${JSON.stringify(fd, null, 2)}</pre>
    `;

    await sendEmail({
      to: "no-reply@consciouskarma.co",
      subject: "New Conscious Karma Report Request (Payment Successful)",
      html: adminHtml,
    });

    /* ----- User email ----- */
    /* ----- User email (REPORT IN PROGRESS) ----- */
    const userHtml = `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0;line-height:1.6;color:#222;">
    <p>Dear <strong>${general.name || "User"}</strong>,</p>

    <p>
      Thank you for choosing the <strong>Personalised Mobile Number Report</strong>.
    </p>

    <p>
      Your details have been received and your report is now under preparation.
    </p>

    <p>
      <strong>Delivery timeline:</strong> 5–7 days<br/>
      Your completed report will be sent to this email once it’s ready.
    </p>

    <p>
      If you need to share anything additional, feel free to write to us at
      <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
    </p>

    <p style="margin-top:24px;">
      Warm regards,<br/>
      <strong>Conscious Karma</strong>
    </p>
  </div>
`;

    await sendEmail({
      to: general.email,
      subject: "Your Personalised Report is Now in Progress",
      html: userHtml,
    });

    order.status = "submitted";
    order.emailSent = true;
    await order.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("report/submit error:", err);
    res.status(500).json({ ok: false, message: "Failed to finalize report" });
  }
});

/* ---------- Optional: existing async pipeline (if you still want it) ---------- */
/* You can keep /api/report/start calling triggerReportAndEmail separately if needed */

app.post("/api/mail/score", async (req, res) => {
  try {
    const { email, mobileNumber, scoreData } = req.body;
    console.log("Final mobile for score mail:", req.body, mobileNumber);
    // ALWAYS latest mobile
    const finalMobile =
      mobileNumber ||
      scoreData?.mobile_number ||
      scoreData?.mobile ||
      scoreData?.primaryMobile ||
      scoreData?.phone ||
      "";
    const userName =
      scoreData?.name || scoreData?.user_name || email?.split("@")[0] || "User";

    await sendScoreMail(email, scoreData, finalMobile, userName);

    res.json({ ok: true });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ ok: false, message: "Mail send failed" });
  }
});
const resetCodes = new Map(); // Temporary store: { email -> { code, expiresAt } }

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send email code
app.post("/api/auth/send-reset-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ ok: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, message: "User not found" });

    const code = generateCode();
    resetCodes.set(email, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    });

    const userHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;line-height:1.6;color:#222;">
        <p>Dear <strong>${user.name || "User"}</strong>,</p>

        <p>We received a request to reset your password.</p>

        <p><strong>Here is the code below to set a new password:</strong></p>

        <div style="font-size:22px;font-weight:bold;letter-spacing:3px;
                    background:#f4f4f4;padding:12px 16px;
                    display:inline-block;border-radius:6px;">
          ${code}
        </div>

        <p style="margin-top:16px;">
          If you did not request this change, please ignore this email.
        </p>

        <p style="margin-top:24px;">
          Warm regards,<br/>
          <strong>Conscious Karma</strong>
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: userHtml,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.json({ ok: false, message: "Failed to send reset email" });
  }
});

// Verify code
app.post("/api/auth/verify-reset-code", (req, res) => {
  const { email, code } = req.body;

  const entry = resetCodes.get(email);
  if (!entry) return res.json({ ok: false, verified: false });

  if (entry.code !== code) return res.json({ ok: false, verified: false });

  if (Date.now() > entry.expiresAt)
    return res.json({ ok: false, expired: true });

  return res.json({ ok: true, verified: true });
});

// Apply new password after verification
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const entry = resetCodes.get(email);

    if (!entry || entry.code !== code)
      return res.json({ ok: false, message: "Invalid/expired code" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, message: "User not found" });

    // 🔐 Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    resetCodes.delete(email);

    // 📧 SEND PASSWORD RESET CONFIRMATION EMAIL
    const userHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;line-height:1.6;color:#222;">
        <p>Dear <strong>${user.name || "User"}</strong>,</p>

        <p>Your password has been successfully reset.</p>

        <p>
          If this wasn’t done by you, contact us immediately at
          <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
        </p>

        <p style="margin-top:24px;">
          Warm regards,<br/>
          <strong>Conscious Karma</strong>
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "Your Password Has Been Updated",
        html: userHtml,
      });
    } catch (mailErr) {
      console.error("Password update mail failed:", mailErr);
      // ❌ password reset ko fail mat karo
    }

    return res.json({
      ok: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.json({
      ok: false,
      message: "Error updating password",
    });
  }
});

// 👇 MANUAL FREE REPORT TRIGGER ROUTE (With Console Logs)
app.post("/api/admin/force-send-report", async (req, res) => {
  try {
    const { mobile, email, name, secretKey } = req.body;

    console.log("🚀 Force Sending Report to:", email);

    // 🔒 Security Check
    if (secretKey !== "admin_power_123") {
      return res
        .status(401)
        .json({ ok: false, message: "Chal bhag yahan se! 🔒" });
    }

    if (!mobile || !email) {
      return res
        .status(400)
        .json({ ok: false, message: "Mobile aur Email dono chahiye" });
    }

    // 1️⃣ Score API se Data mangwana
    console.log("📡 Fetching Score Data...");
    const apiUrl = `${process.env.REACT_APP_SCORE_API}/score`;
    const apiKey =
      process.env.REACT_APP_SCORE_API_KEY || "CK_Score_2365abhnf895asfw";

    const { data } = await axios.post(
      apiUrl,
      { mobile_number: mobile },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        timeout: 20000,
      },
    );

    const scoreData = data.score || data;

    // 🔥🔥 YE RAHA WOH LOGIC JO TUJHE CHAHIYE 🔥🔥
    console.log("\n👇👇👇 [DEBUG] SCORE API RESPONSE START 👇👇👇");
    console.log(JSON.stringify(scoreData, null, 2));
    console.log("👆👆👆 [DEBUG] SCORE API RESPONSE END 👆👆👆\n");

    // 2️⃣ PDF Generate karke Mail Bhejna
    console.log("✉️ Generating PDF & Sending Mail...");

    // 'sendScoreMail' import hona chahiye upar
    await sendScoreMail(email, scoreData, mobile, name || "Special User");

    console.log("✅ Mail Sent Successfully!");
    return res.json({
      ok: true,
      message: "Mail sent!",
      apiResponseSummary: "Check console for full JSON",
    });
  } catch (err) {
    console.error("❌ Force Send Failed:", err.message);
    if (err.response) {
      console.error("API Error Data:", err.response.data);
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// 👇 BULK TEST ROUTE (15 Reports in One Click)
app.post("/api/admin/bulk-test-custom", async (req, res) => {
  try {
    // 30 minute timeout for this request (kyunki 15 PDF time legi)
    req.setTimeout(1800000);

    const { email, mobile, samples, secretKey } = req.body;

    // 🔒 Security
    if (secretKey !== "admin_power_123") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (!samples || !Array.isArray(samples) || samples.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Samples array is empty!" });
    }

    console.log(`🚀 Starting Bulk Test for ${samples.length} samples...`);

    // 1️⃣ STEP 1: Fetch Real Score Data (Sirf ek baar)
    console.log("📡 Fetching Base Data from Score API...");
    const apiUrl = `${process.env.REACT_APP_SCORE_API}/score`;
    const apiKey =
      process.env.REACT_APP_SCORE_API_KEY || "CK_Score_2365abhnf895asfw";

    const apiRes = await axios.post(
      apiUrl,
      { mobile_number: mobile || "9999999999" }, // Default dummy agar mobile nahi diya
      { headers: { "Content-Type": "application/json", "X-API-Key": apiKey } },
    );

    const baseScoreData = apiRes.data.score || apiRes.data;
    console.log("✅ Base Data Received.");

    // 2️⃣ STEP 2: Loop Through Samples & Send Mails
    let successCount = 0;

    // Helper function for delay (taaki server crash na ho)
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const [index, textContent] of samples.entries()) {
      console.log(`\n📄 Processing Sample ${index + 1}/${samples.length}...`);

      // 🛠️ Clone data & Inject Custom Text
      const customScoreData = {
        ...baseScoreData,
        influence_section: {
          ...baseScoreData.influence_section,
          as_text: textContent, // 🔥 Yahan tera custom text jayega
        },
      };

      try {
        // PDF Generate & Email
        // Name mein "Sample 1", "Sample 2" bhej rahe hain taaki email mein pehchan sako
        await sendScoreMail(
          email,
          customScoreData,
          mobile || "9999999999",
          `Test User (Sample ${index + 1})`,
        );

        console.log(`✅ Sample ${index + 1} Sent!`);
        successCount++;

        // ⏳ 2 Second wait between emails to be safe
        await wait(2000);
      } catch (err) {
        console.error(`❌ Failed Sample ${index + 1}:`, err.message);
      }
    }

    return res.json({
      ok: true,
      message: `Bulk Process Complete. Sent ${successCount}/${samples.length} reports.`,
    });
  } catch (err) {
    console.error("❌ Bulk Route Error:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server listening on", port));
