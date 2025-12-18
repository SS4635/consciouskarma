// import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
// import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// const REGION = process.env.AWS_REGION;
// const LAMBDA_FN = process.env.AWS_LAMBDA_NAME; // e.g. ck-generate-report
// const BUCKET = process.env.S3_BUCKET;
// const FROM = process.env.SES_SENDER;          // verified SES sender
// const INTERNAL = process.env.INTERNAL_EMAIL;  // internal Bcc (optional)

// const credentials = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// };

// const lambda = new LambdaClient({ region: REGION });
// const s3 = new S3Client({ region: REGION });
// const ses = new SESClient({ region: REGION });

// export async function triggerReportAndEmail(order) {
//   // 1) Generate PDF via Lambda
//   const invoke = await lambda.send(
//     new InvokeCommand({
//       FunctionName: LAMBDA_FN,
//       Payload: Buffer.from(
//         JSON.stringify({
//           name: order.name,
//           email: order.email,
//           phone: order.phone,
//           orderId: String(order._id),
//         })
//       ),
//     })
//   );

//   const lambdaRes = JSON.parse(new TextDecoder().decode(invoke.Payload));
//   if (!lambdaRes.ok) throw new Error(lambdaRes.message || 'Lambda failed');
//   const pdfKey = lambdaRes.key;

//   // 2) Signed URL (1 hour)
//   const pdfUrl = await getSignedUrl(
//     s3,
//     new GetObjectCommand({ Bucket: BUCKET, Key: pdfKey }),
//     { expiresIn: 60 * 60 }
//   );

//   // 3) Email via SES
//   const subject = 'Your Conscious Karma Instant Report';
//   const html = `
//     <div style="font-family:system-ui,Segoe UI,Arial">
//       <p>Hi ${order.name},</p>
//       <p>Your Instant Report is ready. Download it here (valid for 1 hour):</p>
//       <p><a href="${pdfUrl}">Download your PDF</a></p>
//       <hr/>
//       <p style="font-size:12px;color:#666">Order: ${order._id}</p>
//     </div>`;

//   await ses.send(
//     new SendEmailCommand({
//       Destination: { ToAddresses: [order.email], BccAddresses: INTERNAL ? [INTERNAL] : [] },
//       Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } },
//       Source: FROM,
//     })
//   );

//   return { pdfKey, pdfUrl };
// }


import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const REGION = process.env.AWS_REGION;
const LAMBDA_FN = process.env.AWS_LAMBDA_NAME; // e.g. ck-generate-report
const BUCKET = process.env.S3_BUCKET;
const FROM = process.env.SES_SENDER;          // verified SES sender
const INTERNAL = process.env.INTERNAL_EMAIL;  // optional BCC

// ✅ Explicitly include credentials from environment
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// ✅ Pass credentials to every AWS client
const lambda = new LambdaClient({ region: REGION, credentials });
const s3 = new S3Client({ region: REGION, credentials });
const ses = new SESClient({ region: REGION, credentials });

export async function triggerReportAndEmail(order) {
  // 1️⃣ Generate PDF via Lambda
  const invoke = await lambda.send(
    new InvokeCommand({
      FunctionName: LAMBDA_FN,
      Payload: Buffer.from(
        JSON.stringify({
          name: order.name,
          email: order.email,
          phone: order.phone,
          orderId: String(order._id),
        })
      ),
    })
  );

  const lambdaRes = JSON.parse(new TextDecoder().decode(invoke.Payload));
  if (!lambdaRes.ok) throw new Error(lambdaRes.message || 'Lambda failed');
  const pdfKey = lambdaRes.key;

  // 2️⃣ Create signed URL (valid 1 hour)
  const pdfUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: pdfKey }),
    { expiresIn: 60 * 60 }
  );

  // 3️⃣ Send email via SES
  const subject = 'Your Conscious Karma Instant Report';
  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial">
      <p>Hi ${order.name},</p>
      <p>Your Instant Report is ready. Download it here (valid for 1 hour):</p>
      <p><a href="${pdfUrl}">Download your PDF</a></p>
      <hr/>
      <p style="font-size:12px;color:#666">Order: ${order._id}</p>
    </div>`;

  await ses.send(
    new SendEmailCommand({
      Destination: { ToAddresses: [order.email], BccAddresses: INTERNAL ? [INTERNAL] : [] },
      Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } },
      Source: FROM,
    })
  );

  return { pdfKey, pdfUrl };
}
