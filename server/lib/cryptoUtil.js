import crypto from "crypto";

const ALGO = "aes-256-cbc";

export function decrypt(text, secret) {
  const data = Buffer.from(text, "base64");
  const iv = data.subarray(0, 16);
  const encrypted = data.subarray(16);

  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv(ALGO, key, iv);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}
