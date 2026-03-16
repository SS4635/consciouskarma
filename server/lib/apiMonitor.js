import axios from "axios";
import Order from "../models/Order.js";
import Consultation from "../models/Consultation.js";
import Category from "../models/Category.js";
import Blog from "../models/Blog.js";

/* ---------------- helpers ---------------- */

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function nowIstString() {
  return new Date().toLocaleString("en-IN", {
    timeZone: process.env.CRON_TIMEZONE || "Asia/Kolkata",
  });
}

function getBaseUrl() {
  return (process.env.APP_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");
}

async function runStep(name, fn) {
  const startedAt = Date.now();
  try {
    const data = await fn();
    return {
      name,
      ok: true,
      ms: Date.now() - startedAt,
      data,
    };
  } catch (err) {
    return {
      name,
      ok: false,
      ms: Date.now() - startedAt,
      error:
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "Unknown error",
      raw:
        err?.response?.data ||
        null,
    };
  }
}

function failCountFrom(results) {
  return results.filter((r) => !r.ok).length;
}

function buildMonitorHtml(results) {
  const successCount = results.filter((r) => r.ok).length;
  const failCount = results.length - successCount;

  const rows = results
    .map((r) => {
      const bg = r.ok ? "#ecfdf3" : "#fef2f2";
      const color = r.ok ? "#067647" : "#b42318";
      const status = r.ok ? "RUNNING" : "FAILED";
      const detail = r.ok
        ? esc(JSON.stringify(r.data || {}))
        : esc(JSON.stringify(r.raw || r.error || "Unknown error"));

      return `
        <tr style="background:${bg}">
          <td style="padding:10px;border:1px solid #ddd;vertical-align:top;">${esc(r.name)}</td>
          <td style="padding:10px;border:1px solid #ddd;color:${color};font-weight:700;vertical-align:top;">${status}</td>
          <td style="padding:10px;border:1px solid #ddd;vertical-align:top;">${r.ms} ms</td>
          <td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap;vertical-align:top;">${detail}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
      <h2>Daily API Monitor Report</h2>
      <p><strong>Run Time:</strong> ${esc(nowIstString())}</p>
      <p><strong>Total Checks:</strong> ${results.length}</p>
      <p><strong>Success:</strong> ${successCount} | <strong>Failed:</strong> ${failCount}</p>

      <table style="border-collapse:collapse;width:100%;margin-top:16px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">API / Check</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Status</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Time</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Details</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/* ---------------- main monitor ---------------- */

export async function runDailyApiMonitor({ sendEmail, processInstantReport }) {
  const results = [];
  const baseUrl = getBaseUrl();
  const testEmail = process.env.MONITOR_TO_EMAIL;
  const testMobile = "9999999999";
  const uniqueEmail = `monitor+${Date.now()}@consciouskarma.co`;
  const testName = "Monitor Bot";

  /* ======================================================
     A) PUBLIC / BASIC APIS
  ====================================================== */

  results.push(
    await runStep("GET /api/health", async () => {
      const { data } = await axios.get(`${baseUrl}/api/health`, {
        timeout: 10000,
      });

      if (!data?.ok) throw new Error("Health response invalid");
      return data;
    })
  );

  results.push(
    await runStep("GET /api/config/price", async () => {
      const { data } = await axios.get(`${baseUrl}/api/config/price`, {
        timeout: 10000,
      });

      if (typeof data?.price !== "number") {
        throw new Error("Price response invalid");
      }
      return data;
    })
  );

  results.push(
    await runStep("GET /api/consultation/plans", async () => {
      const { data } = await axios.get(`${baseUrl}/api/consultation/plans`, {
        timeout: 10000,
      });

      if (!data?.ok || !Array.isArray(data?.plans)) {
        throw new Error("Consultation plans response invalid");
      }

      return {
        ok: data.ok,
        totalPlans: data.plans.length,
        titles: data.plans.map((p) => p.title).filter(Boolean),
      };
    })
  );

  results.push(
    await runStep("GET /api/categories", async () => {
      const { data } = await axios.get(`${baseUrl}/api/categories`, {
        timeout: 10000,
      });

      if (!data?.ok || !Array.isArray(data?.data)) {
        throw new Error("Categories response invalid");
      }

      return {
        ok: data.ok,
        totalCategories: data.data.length,
      };
    })
  );

  results.push(
    await runStep("GET /api/blogs", async () => {
      const { data } = await axios.get(`${baseUrl}/api/blogs`, {
        timeout: 10000,
      });

      if (!data?.ok || !Array.isArray(data?.data)) {
        throw new Error("Blogs response invalid");
      }

      return {
        ok: data.ok,
        totalBlogs: data.data.length,
      };
    })
  );

  /* ======================================================
     B) DB SANITY CHECKS
  ====================================================== */

  results.push(
    await runStep("DB check - Category model", async () => {
      const count = await Category.countDocuments();
      return { totalCategoriesInDb: count };
    })
  );

  results.push(
    await runStep("DB check - Blog model", async () => {
      const count = await Blog.countDocuments();
      return { totalBlogsInDb: count };
    })
  );

  /* ======================================================
     C) POST-PAYMENT INSTANT FLOW SIMULATION
  ====================================================== */

  const orderCreateResult = await runStep("Create synthetic paid instant order", async () => {
    const order = await Order.create({
      name: testName,
      email: uniqueEmail,
      phone: testMobile,
      amount: 0,
      currency: "INR",
      status: "paid",
      couponCode: "MONITOR",
      couponRedeemed: true,
      otpVerified: true,
      instantEmailSent: false,
      emailSent: false,
      monitorRun: true,
      monitorType: "daily-9pm",
      formData: {
        general: {
          name: testName,
          email: uniqueEmail,
          gender: "NA",
          ageYears: "30",
          ageMonths: "0",
        },
        primary: {
          isd: "+91",
          number: testMobile,
          sinceMonth: "January",
          sinceYear: "2020",
          usageType: "personal",
          role: "self",
          lineOfWork: "monitoring",
        },
        parallels: [],
        previousNumbers: [],
        totalPrice: 0,
      },
    });

    return { orderId: String(order._id) };
  });

  results.push(orderCreateResult);

  let createdOrderId = null;
  if (orderCreateResult.ok) {
    createdOrderId = orderCreateResult.data.orderId;
  }

  if (createdOrderId) {
    results.push(
      await runStep("Run processInstantReport(order)", async () => {
        const order = await Order.findById(createdOrderId);
        if (!order) throw new Error("Created synthetic order not found");

        await processInstantReport(order);

        const updated = await Order.findById(createdOrderId).lean();
        if (!updated) throw new Error("Updated synthetic order not found");

        return {
          orderId: String(updated._id),
          status: updated.status,
          instantEmailSent: updated.instantEmailSent,
        };
      })
    );
  }

  /* ======================================================
     D) CONSULTATION SYNTHETIC ENTRY CHECK
  ====================================================== */

  
  /* ======================================================
     E) SCORE API DEPENDENCY CHECK
  ====================================================== */

  results.push(
    await runStep("Score API dependency check", async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_SCORE_API}/score`,
        { mobile_number: testMobile },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key":
              process.env.REACT_APP_SCORE_API_KEY || "CK_Score_2365abhnf895asfw",
          },
          timeout: 15000,
        }
      );

      const data = response.data?.score || response.data;

      if (!data || typeof data !== "object") {
        throw new Error("Invalid score API response");
      }

      return {
        received: true,
        topKeys: Object.keys(data).slice(0, 8),
      };
    })
  );

  /* ======================================================
     F) SMTP CHECK
  ====================================================== */

  results.push(
    await runStep("SMTP email check", async () => {
      await sendEmail({
        to: testEmail,
        subject: "SMTP Check - Conscious Karma Monitor",
        html: `
          <div style="font-family:Arial,sans-serif">
            <p>This is an automatic SMTP test from the 9 PM monitor.</p>
            <p><strong>Time:</strong> ${esc(nowIstString())}</p>
          </div>
        `,
      });

      return { sentTo: testEmail };
    })
  );

  /* ======================================================
     G) FINAL SUMMARY EMAIL
  ====================================================== */

  const summaryHtml = buildMonitorHtml(results);
  const failed = failCountFrom(results);

  await sendEmail({
    to: testEmail,
    subject: `Daily API Monitor Report - ${failed > 0 ? "ATTENTION" : "OK"}`,
    html: summaryHtml,
  });

  return results;
}