import nodemailer from "nodemailer";

export async function sendConsultationEmails({ formData, docId }) {
  const name = formData?.[1]?.["Name"] || "Customer";
  const email = formData?.[1]?.["Email-id"];
  const phone = formData?.[2]?.["Mobile Number"]?.mobile || "";

  if (!email) throw new Error("Missing user email for consultation");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const userHTML = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;line-height:1.6;color:#222;">
  <p>Dear <strong>${name}</strong>,</p>

  <p>
    Thank you for booking a consultation with
    <strong>Conscious Karma</strong>.
  </p>

  <p>Your request has been received.</p>

  <p>
    You will receive your consultation details and next steps shortly.
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

  // Admin table builder
  function renderStep(stepIdx) {
    const step = formData?.[stepIdx];
    if (!step) return '';
    const rows = Object.entries(step).map(([k, v]) => {
      let val = v;
      if (typeof v === 'object' && v !== null) {
        if (Array.isArray(v)) val = v.join(' / ');
        else if ('isd' in v || 'mobile' in v) val = `${v.isd || ''} ${v.mobile || ''}`.trim();
        else val = JSON.stringify(v);
      }
      return `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #eee;">${k}</th><td style="padding:8px;border-bottom:1px solid #eee;">${val || ''}</td></tr>`;
    }).join('');
    return rows;
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

  await transporter.sendMail({
  from: `"Conscious Karma" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your Consultation Booking is Confirmed",
  html: userHTML,
});


  const adminEmail = process.env.ADMIN_EMAIL || process.env.INTERNAL_EMAIL || process.env.EMAIL_USER;
  await transporter.sendMail({
    from: `"Conscious Karma System" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Consultation: ${name} ${phone ? '('+phone+')' : ''}`,
    html: adminHTML,
  });

  console.log(`✅ Consultation emails sent - User: ${email}, Admin: ${adminEmail}`);
}
