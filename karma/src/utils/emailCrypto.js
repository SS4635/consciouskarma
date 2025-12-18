// src/utils/emailCrypto.js
import CryptoJS from "crypto-js";

// For production, move this into an env var
const SECRET = "ck-email-secret-2025";

export function encryptEmail(email) {
  if (!email) return "";
  return CryptoJS.AES.encrypt(email, SECRET).toString();
}

export function decryptEmail(cipher) {
  if (!cipher) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    return plain || "";
  } catch (e) {
    console.error("Failed to decrypt email:", e);
    return "";
  }
}
