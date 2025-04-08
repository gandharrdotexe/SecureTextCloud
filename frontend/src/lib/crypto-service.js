// src/lib/crypto-service.js
import CryptoJS from "crypto-js";

function deriveKey(secretKey, salt) {
  return CryptoJS.PBKDF2(secretKey, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });
}

export async function encryptMessage(message, secretKey) {
  const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  const key = deriveKey(secretKey, salt);

  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC, // ✅ CBC mode works fine
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    encryptedMessage: encrypted.toString(),
    iv,
    salt,
  };
}

export async function decryptMessage(encryptedMessage, secretKey, iv, salt) {
  const key = deriveKey(secretKey, salt);

  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC, // ✅ Match CBC mode
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
