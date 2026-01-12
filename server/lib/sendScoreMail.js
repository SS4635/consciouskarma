import nodemailer from "nodemailer";
import fs from "fs";
import { generateInstantReportPDF } from "./generateInstantReportPDF.js";

let transporter = null;
function normalizeIndianMobile(num = "") {
  const digits = String(num).replace(/\D/g, ""); // सिर्फ नंबर रखें
  // अगर नंबर 10 अंक से बड़ा है (जैसे 9198...), तो पीछे के 10 अंक लें
  return digits.length > 10 ? digits.slice(-10) : digits;
}

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

export async function sendScoreMail(to, scoreData, mobileNumber, userName) {
  let pdfPath;

  try {
    if (!to) throw new Error("Recipient email missing");

    const rawMobile =
      mobileNumber ||
      scoreData?.mobile_number ||
      scoreData?.mobile ||
      "";

    const finalMobile = normalizeIndianMobile(rawMobile);

const safeName = userName || to.split("@")[0] || "User";
    pdfPath = await generateInstantReportPDF(
      scoreData,
      to,
      finalMobile
    );

    const mailTransporter = getTransporter();
    await mailTransporter.sendMail({
    from: `"Conscious Karma" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Instant Mobile Number Report",
    html: `
      <p>Dear <strong>${safeName}</strong>,</p>
      <p>Your Instant Report is ready.</p>
      <p>Please find the PDF attached to this email.</p>
      <p>Warm regards,<br/>Conscious Karma</p>
    `,
      attachments: [
        {
          filename: "Instant_Mobile_Number_Report.pdf",
          path: pdfPath,
        },
      ],
    });

    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
  } catch (err) {
    if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    throw err;
  }
}
