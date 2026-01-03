
import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "/var/www/.env" });

import { connectMongo } from "./lib/mongo.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import Consultation from "./models/Consultation.js";
import { sendConsultationEmails } from "./lib/sendConsultationEmails.js";
import { sendScoreMail } from "./lib/sendScoreMail.js";
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
console.log("SMTP_PASS:", process.env.SMTP_PASS ? `✅ Loaded (${process.env.SMTP_PASS.length} chars)` : "❌ Missing/Undefined");
console.log("RAZORPAY_KEY:", process.env.RAZORPAY_KEY_ID ? "✅ Loaded" : "❌ Missing");
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



async function sendEmail({ to, subject, html }) {
  console.log(`\n[MAIL] Sending to: ${to}`);
  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Conscious Karma" <no-reply@consciouskarma.co>',
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
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;line-height:1.6;color:#222;">
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
    to: "fan818199@gmail.com",
    subject: "New User Registration",
    html: adminHtml,
  });
}

app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("Received tu call registration request:", req.body);
    const { email, password } = req.body;

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
      await sendSignupEmails({ email, name: email.split("@")[0] });
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

  if (entry.code !== code)
    return res.json({ ok: false, verified: false });

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
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ ok: false, message: "Incorrect password" });
    }

    // Return user (no JWT in your current setup)
    res.json({
      ok: true,
      message: "Login successful",
      user: {
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
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
    return res.json({ ok: false, message: "Failed creating consultation order" });
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

    // Extract Info
    const general = formData?.general || {};
    const primary = formData?.primary || {};
    const phone = `${primary.isd || ""}${primary.number || ""}`;

    // 🛡️ FIX: Sanitise Price for Database (Prevents NaN Crash)
    let finalPrice = Number(String(price).replace(/[^0-9.]/g, ""));
    
    // Fallback: If price is still invalid, try getting it from form or default to 0
    if (isNaN(finalPrice)) {
        console.warn("⚠️ Price invalid, attempting fallback...");
        finalPrice = Number(formData?.price) || Number(formData?.totalPrice) || 0;
    }

    console.log(`[VERIFY] Saving to DB with Final Price: ${finalPrice}`);

    // ✅ Save to DB (Only Once!)
    const consultation = await Consultation.create({
      formData,
      name: general.name,
      email: general.email,
      phone,
      planName,
      price: finalPrice, 
      paymentStatus: "paid",
    });

    // Send Emails (Non-blocking)
    try {
      await sendConsultationEmails({
        formData,
        docId: consultation._id,
      });
    } catch (mailErr) {
      console.error("Consultation Email Failed:", mailErr.message);
    }

    return res.json({ ok: true, id: consultation._id });
  } catch (err) {
    console.error("verify-consultation error:", err);
    res.status(500).json({ ok: false, message: "Verification failed on server" });
  }
});
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
      console.log("Obtained auth token",data.token);
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
    .filter(Boolean)
);
const isAllowlisted = (c = "") => allowlist.has(String(c).toUpperCase());

/* ---------- Partner redeem ---------- */

async function redeemCoupon(code, mobile) {
  if (!code) return null;

  const url = process.env.CK_COUPON_API_URL;
  const apiKey = process.env.CK_COUPON_API_KEY;

  if (!url || !apiKey) {
    throw new Error("Coupon API env not configured");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      coupon: code,
      mobile_number: mobile,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Coupon API HTTP Error:", response.status, text);
    throw new Error(`Coupon API failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log("Redeem coupon response:", data);

  return data;
}


/* ---------- Coupon preview validate ---------- */
app.post("/api/coupon/validate", async (req, res) => {
  try {
    const { code, price, mobile } = req.body || {};
    const baseAmount = Number(price || 0);

    // 🟢 No coupon → skip API
   

    // 🔥 Trigger external coupon API
    const result = await redeemCoupon(code, mobile);
console.log("Coupon validate result:", result);

   
    // ✅ Coupon accepted by external system
    return res.json({
      valid: true,
      finalAmount: 0,
      couponApplied: true,
      coupon: code,
    });

  } catch (err) {
    console.error("Coupon validate error:", err.message);
    return res.json({
      valid: false,
      finalAmount: Number(req.body?.price || 0),
      message: "Coupon validation failed",
    });
  }
});

/* ---------- Twilio: send OTP ---------- */
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

    const { data } = await axios.post(url, {}, {
      headers: {
        authToken,
        Accept: "*/*",
      },
    });

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

    /* ---------- Instant Report detection (CORRECT) ---------- */
    const isInstantReport =
      (order.formData?.parallels?.length || 0) === 0 &&
      (order.formData?.previousNumbers?.length || 0) === 0;

    /* ---------- Send email ONLY ONCE ---------- */
    if (isInstantReport && !order.instantEmailSent) {
      const userHtml = `
        <p>Dear ${order.name},</p>

        <p>
          Thank you for your order.<br/>
          Your <strong>Instant Mobile Number Report</strong> is now being generated
          and will be delivered to this email shortly.
        </p>

        <p>
          If you have any questions, feel free to write to us at
          <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
        </p>

        <p>
          Warm regards,<br/>
          <strong>Conscious Karma</strong>
        </p>
      `;

      try {
        await sendEmail({
          to: order.email,
          subject: "Your Instant Report is being prepared",
          html: userHtml,
        });
try {
  const phone = order.phone; // already stored as full number
  const email = order.email;

  console.log("[SCORE] Generating score for:", phone, email);

  const { data: scoreResponse } = await axios.post(
    `${process.env.REACT_APP_SCORE_API}/score`,
    { mobile_number: phone },
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
      },
    }
  );

  const scoreData = scoreResponse.score || scoreResponse;

  await sendScoreMail(email, scoreData, phone);

  console.log("[SCORE] Score generated and mailed successfully");
} catch (err) {
  console.error("[SCORE] Failed:", err.response?.data || err.message);
}
        order.instantEmailSent = true; // 🔒 prevent duplicate mail
      } catch (mailErr) {
        console.error("Instant report mail failed:", mailErr);
      }
    }

    /* ---------- AUTO SCORE GENERATION (BACKEND ONLY) ---------- */

         /* ---------- AUTO SCORE GENERATION (BACKEND ONLY) ---------- */



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
      to: "fan818199@gmail.com",
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
      verificationId
    )}&code=${encodeURIComponent(code)}`;

    const { data } = await axios.get(url, {
      headers: {
        authToken,       // EXACT header name docs jaisa
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
      err.response?.data || err.message
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
        .json({ ok: false, valid: false, message: "Email and password required" });
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
    res
      .status(500)
      .json({ ok: false, valid: false, message: "Server error" });
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
      return res
        .status(404)
        .json({ ok: false, message: "User not found" });
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
    activity.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

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
      return res.status(400).json({ ok: false, message: "Payment not completed" });
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
      to: "fan818199@gmail.com",
      subject: "New Conscious Karma Report Request (Payment Successful)",
      html: adminHtml,
    });

    /* ----- User email ----- */
    /* ----- User email (REPORT IN PROGRESS) ----- */
const userHtml = `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;line-height:1.6;color:#222;">
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

    await sendScoreMail(email, scoreData, finalMobile);

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

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server listening on", port));
