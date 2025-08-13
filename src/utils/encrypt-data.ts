import CryptoJS from "crypto-js";

export function hashPin(pin: string, salt: string) {
  return CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 200000,
  }).toString();
}

export function deriveKey(pin: string, salt: string) {
  return CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 200000,
  }).toString();
}

export function encryptData(data: string, keyHex: string) {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv }).toString();
  return JSON.stringify({ iv: iv.toString(), ciphertext: encrypted });
}

export function decryptData(encryptedPayload: string, keyHex: string) {
  const { iv, ciphertext } = JSON.parse(encryptedPayload);
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}
