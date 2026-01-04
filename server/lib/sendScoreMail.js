import nodemailer from "nodemailer";
import fs from "fs";
import { generateInstantReportPDF } from "./generateInstantReportPDF.js";

// Create transporter once and reuse (connection pooling)
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendScoreMail(to, scoreData, mobileNumber) {
  let pdfPath;

  try {
    if (!to) throw new Error("Recipient email missing");

    // Always pick latest mobile number
    const finalMobile =
      mobileNumber ||
      scoreData?.mobile_number ||
      scoreData?.mobile ||
      scoreData?.primaryMobile ||
      scoreData?.phone ||
      "";

    const name =
      scoreData?.name ||
      scoreData?.user_name ||
      scoreData?.full_name ||
      "User";

    console.log("📱 FINAL MOBILE USED IN SCORE REPORT:", finalMobile);

    // Generate PDF
    pdfPath = await generateInstantReportPDF(
      scoreData,
      to,
      finalMobile
    );

    const mailTransporter = getTransporter();
    await mailTransporter.verify();

    const mailOptions = {
      from: `"Conscious Karma" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your Instant Mobile Number Report",
    html: `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0;line-height:1.6;color:#222;text-align:left;">
    <p>Dear <strong>${name}</strong>,</p>

    <p>Your Instant Report is ready.</p>

    <p>Please find the PDF attached to this email.</p>

    <p>
      If you have any questions about the report, feel free to write to us at
      <a href="mailto:hello@consciouskarma.co">hello@consciouskarma.co</a>.
    </p>

    <p style="margin-top:24px;">
      Warm regards,<br/>
      <strong>Conscious Karma</strong>
    </p>
  </div>
`
,
      attachments: [
        {
          filename: "Instant_Mobile_Number_Report.pdf",
          path: pdfPath,
        },
      ],
    };

    await mailTransporter.sendMail(mailOptions);

    // Cleanup temp PDF
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlink(pdfPath, () => {});
    }
  } catch (error) {
    console.error("❌ Error in sendScoreMail:", error);
    if (pdfPath && fs.existsSync(pdfPath)) fs.unlink(pdfPath, () => {});
    throw error;
  }
}
