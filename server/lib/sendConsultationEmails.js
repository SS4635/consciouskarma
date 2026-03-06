import nodemailer from "nodemailer";

export async function sendConsultationEmails({ formData, docId }) {
  // 1. Extract Details Safely
  const name = formData?.general?.name || formData?.rawStepData?.[1]?.["Name"] || formData?.[1]?.["Name"] || "Customer";
  const email = formData?.general?.email || formData?.rawStepData?.[1]?.["Email-id"] || formData?.[1]?.["Email-id"];
  const phone = formData?.primary?.number || formData?.rawStepData?.[2]?.["Mobile Number"]?.mobile || formData?.[2]?.["Mobile Number"]?.mobile || "";

  if (!email) throw new Error("Missing user email for consultation");

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  /* ================= BUILD USER GREY BOX IN THIS FILE (With Compatibility) ================= */
  const general = formData?.general || {};
  const primary = formData?.primary || {};
  const parallels = formData?.parallels || [];
  const previous = formData?.previousNumbers || [];
  const comp = formData?.compatibility || {}; 

  let userDetailsHtml = `
    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #333;">
      <h3 style="margin-top: 0; color: #ff914d;">Your Submitted Details:</h3>
      <p style="margin-top: 0;">
        <strong>Name:</strong> ${general.name || "-"}<br/>
        <strong>Email:</strong> ${general.email || "-"}<br/>
        <strong>Gender:</strong> ${general.gender || "-"}<br/>
        <strong>DOB:</strong> ${general.dob || "-"} <br/>
        <strong>Time of Birth:</strong> ${general.tob || "-"}
      </p>

      <h4 style="margin-bottom: 5px; color: #333;">Primary Number</h4>
      <p style="margin-top: 0;">
        <strong>Number:</strong> ${primary.isd || ""}${primary.number || "-"}<br/>
        <strong>Since:</strong> ${primary.sinceMonth || "-"} ${primary.sinceYear || "-"}<br/>
        <strong>Usage Type:</strong> ${primary.usageType || "-"}<br/>
        <strong>Role:</strong> ${primary.role || "-"}<br/>
        <strong>Line of Work:</strong> ${primary.lineOfWork || "-"}
      </p>
  `;

  if (parallels.length > 0) {
    userDetailsHtml += `<h4 style="margin-bottom: 5px; color: #333;">Parallel Numbers</h4><ul style="margin-top: 0; padding-left: 20px;">`;
    parallels.forEach((p, i) => {
      userDetailsHtml += `<li style="margin-bottom: 4px;"><strong>#${i + 1}:</strong> ${p.isd || ""}${p.mobile || p.number || "-"} (Usage: ${p.usageType || "-"})</li>`;
    });
    userDetailsHtml += `</ul>`;
  }

  if (previous.length > 0) {
    userDetailsHtml += `<h4 style="margin-bottom: 5px; color: #333;">Previous Numbers</h4><ul style="margin-top: 0; padding-left: 20px;">`;
    previous.forEach((p, i) => {
      userDetailsHtml += `<li style="margin-bottom: 4px;"><strong>#${i + 1}:</strong> ${p.isd || ""}${p.mobile || p.number || "-"} (Usage: ${p.usageType || "-"})</li>`;
    });
    userDetailsHtml += `</ul>`;
  }

  // 🔥 COMPATIBILITY NUMBERS IN USER MAIL
  if (comp?.primary?.number) {
    userDetailsHtml += `<h4 style="margin-bottom: 5px; color: #333;">Compatibility Numbers</h4><ul style="margin-top: 0; padding-left: 20px;">`;
    userDetailsHtml += `<li style="margin-bottom: 4px;"><strong>Primary:</strong> ${comp.primary.isd || ""}${comp.primary.number} (Relation: ${comp.primary.relationship || "-"})</li>`;
    
    if (comp.extra && comp.extra.length > 0) {
      comp.extra.forEach((p, i) => {
        if(p.mobile) {
          userDetailsHtml += `<li style="margin-bottom: 4px;"><strong>Extra #${i + 1}:</strong> ${p.isd || ""}${p.mobile}</li>`;
        }
      });
    }
    userDetailsHtml += `</ul>`;
  }
  userDetailsHtml += `</div>`;

  /* ================= USER MAIL (REMOVED DYNAMIC TEXT) ================= */
  const userHTML = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0;line-height:1.6;color:#222;">
  <p>Dear <strong>${name}</strong>,</p>
  <p>Thank you for booking a consultation with <strong>Conscious Karma</strong>.</p>
  <p>Your payment was successful and your booking details have been received.</p>

  ${userDetailsHtml}

  <p>We will review your details and get in touch with you shortly to schedule your consultation.</p>
  <p>If you need to share anything additional, feel free to write to us at <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.</p>
  <p style="margin-top:24px;">Warm regards,<br/><strong>Conscious Karma</strong></p>
</div>
`;

  /* ================= ADMIN TABLE ================= */
  function renderStep(stepIdx) {
    const step = formData?.rawStepData?.[stepIdx] || formData?.[stepIdx];
    if (!step) return "";
    
    return Object.entries(step)
      .map(([k, v]) => {
        let val = v;
        
        // Handle Dynamic Arrays properly for Admin table so it doesn't print [object Object]
        if (k === "dynamicNumbers" && Array.isArray(v)) {
            val = v.map((num) => {
                if(num.usedSince) return `Number: ${num.isd || ""}${num.mobile} (Since: ${num.usedSince.join('/')} to ${num.usedTill.join('/')}, Usage: ${num.usageType}, Role: ${num.role})`;
                if(num.since) return `Number: ${num.isd || ""}${num.mobile} (Since: ${num.since.join('/')}, Usage: ${num.usageType}, Role: ${num.role})`;
                return `Number: ${num.isd || ""}${num.mobile}`;
            }).join("<br/><br/>");
            k = "Additional Numbers";
        } 
        else if (typeof v === "object" && v !== null) {
          if (Array.isArray(v)) val = v.join(" / ");
          else if ("isd" in v || "mobile" in v)
            val = `${v.isd || ""} ${v.mobile || ""}`.trim();
          else val = JSON.stringify(v);
        }
        
        return `<tr>
          <th style="text-align:left;padding:8px;border-bottom:1px solid #eee;vertical-align:top;">${k}</th>
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
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  await transporter.sendMail({
    from: `"Conscious Karma System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Consultation: ${name} ${phone ? "(" + phone + ")" : ""}`,
    html: adminHTML,
  });

  console.log(`✅ Consultation emails sent - User: ${email}, Admin: ${adminEmail}`);
}