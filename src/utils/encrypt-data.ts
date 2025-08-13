import CryptoJS from "crypto-js";

function getEncryptionKey(userId: string) {
  // TO-DO: change secret key
  const SECRET_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return CryptoJS.SHA256(userId + SECRET_KEY).toString();
}

export function encryptData(data: string, userId: string) {
  if (!data) return "";
  const key = getEncryptionKey(userId);
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return encrypted;
}

export function decryptData(encryptedData: string, userId: string) {
  if (!encryptedData) return "";
  const key = getEncryptionKey(userId);
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted || encryptedData;
}
