import nodemailer from "nodemailer";

export async function sendOrderEmails(orderData) {
  const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // no-reply@consciouskarma.co
        pass: process.env.SMTP_PASS,
      },
    });
  

  // Email to User - Thank you message
  const userEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        h1 { margin: 0; font-size: 28px; }
        .highlight { color: #ff6b35; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${orderData.general?.name || 'Valued Customer'}</strong>,</p>
          
          <p>Thank you for choosing <span class="highlight">Conscious Karma</span> for your personalized numerology report.</p>
          
          <p>We have received your order successfully. Our team is working on preparing your detailed personalized report.</p>
          
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Order ID: <strong>${orderData.orderId || 'Processing...'}</strong></li>
            <li>Amount Paid: <strong>₹${orderData.price || 'N/A'}</strong></li>
            <li>Status: <strong>Confirmed</strong></li>
          </ul>
          
          <p>You will receive your personalized numerology report within 24-48 hours at this email address.</p>
          
          <p>If you have any questions, feel free to reach out to us.</p>
          
          <p>With gratitude,<br><strong>Conscious Karma Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Conscious Karma. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email to Admin - Complete order details in table format
  const adminEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th { background: #34495e; color: white; padding: 12px; text-align: left; font-weight: bold; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f5f5f5; }
        .section-title { background: #ff6b35; color: white; font-weight: bold; }
        .subsection { background: #e8e8e8; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Personalized Report Order Received</h2>
        </div>
        
        <table>
          <tr class="section-title">
            <td colspan="2">GENERAL INFORMATION</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>${orderData.general?.name || 'N/A'}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>${orderData.general?.email || 'N/A'}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>${orderData.general?.gender || 'N/A'}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>${orderData.general?.dob || 'N/A'}</td>
          </tr>
          <tr>
            <th>Age</th>
            <td>${orderData.general?.age || 'N/A'}</td>
          </tr>
          
          <tr class="section-title">
            <td colspan="2">PRIMARY NUMBER</td>
          </tr>
          <tr>
            <th>Mobile Number (ISD)</th>
            <td>${orderData.primary?.isd || ''} ${orderData.primary?.number || 'N/A'}</td>
          </tr>
          <tr>
            <th>OTP Verified</th>
            <td>${orderData.primary?.verified ? '✅ Yes' : '❌ No'}</td>
          </tr>
          
          ${orderData.parallels && orderData.parallels.length > 0 ? `
          <tr class="section-title">
            <td colspan="2">PARALLEL NUMBERS</td>
          </tr>
          ${orderData.parallels.map((parallel, idx) => `
            <tr class="subsection">
              <td colspan="2">Parallel Number ${idx + 1}</td>
            </tr>
            <tr>
              <th>Number</th>
              <td>${parallel.isd || ''} ${parallel.number || 'N/A'}</td>
            </tr>
            <tr>
              <th>OTP Verified</th>
              <td>${parallel.verified ? '✅ Yes' : '❌ No'}</td>
            </tr>
          `).join('')}
          ` : ''}
          
          ${orderData.previousNumbers && orderData.previousNumbers.length > 0 ? `
          <tr class="section-title">
            <td colspan="2">PREVIOUS NUMBERS</td>
          </tr>
          ${orderData.previousNumbers.map((prev, idx) => `
            <tr>
              <th>Previous Number ${idx + 1}</th>
              <td>${prev.isd || ''} ${prev.number || 'N/A'}</td>
            </tr>
          `).join('')}
          ` : ''}
          
          <tr class="section-title">
            <td colspan="2">ORDER INFORMATION</td>
          </tr>
          <tr>
            <th>Order ID</th>
            <td>${orderData.orderId || 'Processing...'}</td>
          </tr>
          <tr>
            <th>Payment ID</th>
            <td>${orderData.paymentId || 'N/A'}</td>
          </tr>
          <tr>
            <th>Amount Paid</th>
            <td><strong>₹${orderData.price || 'N/A'}</strong></td>
          </tr>
          <tr>
            <th>Order Date</th>
            <td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td><strong style="color: green;">PAID & CONFIRMED</strong></td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ff6b35;">
          <strong>Action Required:</strong> Process this personalized report and send to customer within 24-48 hours.
        </p>
      </div>
    </body>
    </html>
  `;

  // Send email to User
  await transporter.sendMail({
    from: `"Conscious Karma" <${process.env.EMAIL_USER}>`,
    to: orderData.general?.email,
    subject: "Thank You for Your Order - Conscious Karma",
    html: userEmailHTML,
  });

  // Send email to Admin
  const adminEmail = process.env.ADMIN_EMAIL || process.env.INTERNAL_EMAIL || 'ops@yourdomain.com';
  await transporter.sendMail({
    from: `"Conscious Karma System" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🔔 New Order: ${orderData.general?.name || 'Customer'} - ₹${orderData.price}`,
    html: adminEmailHTML,
  });

  console.log(`✅ Emails sent - User: ${orderData.general?.email}, Admin: ${adminEmail}`);
}
