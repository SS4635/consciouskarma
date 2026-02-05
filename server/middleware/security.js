export const protectAndLog = (req, res, next) => {
  // 1. Define Origins based on Environment
  let allowedOrigins = [
    "https://consciouskarma.co",
    "https://www.consciouskarma.co"
  ];

  // Sirf tab localhost allow karo jab hum development mode mein hon
  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:3000");
  }

  const origin = req.headers.origin;
  const apiKey = req.headers["x-api-key"];

  // 2. API Key Check
  if (apiKey !== "CK_Score_2365abhnf895asfw") { // Better: process.env.API_KEY use karo
    return res.status(401).json({ ok: false, message: "Invalid API Key" });
  }

  // 3. Origin Check (Strict)
  // Agar Origin missing hai YA allowed list mein nahi hai -> BLOCK
  if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({ 
        ok: false, 
        message: "Unauthorized Source detected" 
      });
  }

  // 4. IP Extraction
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }
  req.userIP = ip;

  next();
};