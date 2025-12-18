import nodemailer from "nodemailer";

export async function sendScoreMail(to, scoreData) {
  if (!to) throw new Error("Recipient email missing");

  const transporter = nodemailer.createTransport({
    service: "gmail", // or use your SES/SMTP settings
    auth: {
      user: process.env.EMAIL_USER, // sender email
      pass: process.env.EMAIL_PASS, // app password (not your login password)
    }, 
  });

  // 🧩 Design the HTML email
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px;">
      <h2 style="color:#ff8a3d; text-align:center;">📊 Your Mobile Number Score Report</h2>
      <p><strong>Basic Number:</strong> ${scoreData.basic_number}</p>
      <p><strong>Grade:</strong> ${scoreData.grade}</p>
      <p><strong>Number Sequence:</strong> ${scoreData.number_sequence}</p>

      <h3>Highlights</h3>
      <ul>
        ${scoreData.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>

      <h3>Detailed Pairs</h3>
      <p>${scoreData.pairs.join(', ')}</p>

      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse; margin-top:10px;">
        <thead>
          <tr style="background:#ff8a3d; color:white;">
            <th>Aspect</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Finance</td><td>${scoreData.Finance}</td></tr>
          <tr><td>Love</td><td>${scoreData.Love}</td></tr>
          <tr><td>Fortune</td><td>${scoreData.Fortune}</td></tr>
          <tr><td>Mind</td><td>${scoreData.Mind}</td></tr>
          <tr><td>Intuition</td><td>${scoreData.Intuition}</td></tr>
        </tbody>
      </table>

      <p style="margin-top:20px; color:#333;">${scoreData.closing_note}</p>

      <hr style="margin:20px 0;">
      <p style="font-size:12px; color:#777; text-align:center;">
        © ${new Date().getFullYear()} Conscious Karma — Instant Report Service
      </p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Conscious Karma" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Mobile Number Score Report",
    html,
  });

  console.log(`✅ Score mail sent to ${to}`);
}
