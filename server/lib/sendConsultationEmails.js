import nodemailer from "nodemailer";

// 👇 FIX 1: Add submittedDetailsHtml to the function parameters
export async function sendConsultationEmails({ formData, docId, submittedDetailsHtml }) {
  // 👇 FIX 2: Safely extract Name, Email, and Phone using the mapped data or fallback to old structure
  const name = formData?.general?.name || formData?.rawStepData?.[1]?.["Name"] || formData?.[1]?.["Name"] || "Customer";
  const email = formData?.general?.email || formData?.rawStepData?.[1]?.["Email-id"] || formData?.[1]?.["Email-id"];
  const phone = formData?.primary?.number || formData?.rawStepData?.[2]?.["Mobile Number"]?.mobile || formData?.[2]?.["Mobile Number"]?.mobile || "";

  if (!email) throw new Error("Missing user email for consultation");

  // ✅ HOSTINGER SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER, // no-reply@consciouskarma.co
      pass: process.env.SMTP_PASS,
    },
  });

  /* ================= USER MAIL (UPDATED WITH FORM DETAILS) ================= */
  const userHTML = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0;line-height:1.6;color:#222;">
  <p>Dear <strong>${name}</strong>,</p>

  <p>
    Thank you for booking a consultation with
    <strong>Conscious Karma</strong>.
  </p>

  <p>Your payment was successful and your booking details have been received.</p>

  ${submittedDetailsHtml || ""}

  <p>
    We will review your details and get in touch with you shortly to schedule your consultation.
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

  /* ================= ADMIN TABLE (UPDATED DATA SOURCE) ================= */
  function renderStep(stepIdx) {
    // 🔥 Fix: Check for rawStepData first (which we sent from server.js)
    const step = formData?.rawStepData?.[stepIdx] || formData?.[stepIdx];
    if (!step) return "";
    return Object.entries(step)
      .map(([k, v]) => {
        let val = v;
        if (typeof v === "object" && v !== null) {
          if (Array.isArray(v)) val = v.join(" / ");
          else if ("isd" in v || "mobile" in v)
            val = `${v.isd || ""} ${v.mobile || ""}`.trim();
          else val = JSON.stringify(v);
        }
        return `<tr>
          <th style="text-align:left;padding:8px;border-bottom:1px solid #eee;">${k}</th>
          <td style="padding:8px;border-bottom:1px solid #eee;">${val || ""}</td>
        </tr>`;
      })
      .join("");
  }

  const adminHTML = `
  <div style="font-family:Arial,sans-serif;max-width:840px;margin:auto;">
    <div style="background:#2c3e50;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;">
      <h3 style="margin:0;">New Consultation Request</h3>
    </div>
    <table style="width:100%;border:1px solid #eee;border-top:none;border-collapse:collapse;">
      <tr><td colspan="2" style="background:#ff6b35;color:#fff;padding:10px 12px;font-weight:bold;">General Information</td></tr>
      ${renderStep(1)}
      <tr><td colspan="2" style="background:#ff6b35;color:#fff;padding:10px 12px;font-weight:bold;">Primary Number</td></tr>
      ${renderStep(2)}
      <tr><td colspan="2" style="background:#ff6b35;color:#fff;padding:10px 12px;font-weight:bold;">Parallel Number</td></tr>
      ${renderStep(3)}
      <tr><td colspan="2" style="background:#ff6b35;color:#fff;padding:10px 12px;font-weight:bold;">Previous Number</td></tr>
      ${renderStep(4)}
      <tr><td colspan="2" style="background:#ff6b35;color:#fff;padding:10px 12px;font-weight:bold;">Compatibility 1</td></tr>
      ${renderStep(5)}
      <tr><td colspan="2" style="background:#ff6b35;color:#fff;padding:10px 12px;font-weight:bold;">Compatibility 2</td></tr>
      ${renderStep(6)}
      <tr><th style="text-align:left;padding:8px;">Ref ID</th><td style="padding:8px;">${docId}</td></tr>
    </table>
  </div>`;

  /* ================= SEND USER MAIL ================= */
  await transporter.sendMail({
    from: `"Conscious Karma" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Consultation Booking is Confirmed",
    html: userHTML,
  });

  /* ================= SEND ADMIN MAIL ================= */
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.INTERNAL_EMAIL ||
    process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"Conscious Karma System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Consultation: ${name} ${phone ? "(" + phone + ")" : ""}`,
    html: adminHTML,
  });

  console.log(`✅ Consultation emails sent - User: ${email}, Admin: ${adminEmail}`);
}