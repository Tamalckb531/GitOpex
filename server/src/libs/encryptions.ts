import crypto from "crypto";

const IV_LENGTH = 12;

export const encryptApiKey = (apiKey: string, encryptKey: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptKey),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(apiKey, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, encrypted, authTag]).toString("base64");
};
export const decryptApiKey = (
  encryptedBase64: string,
  encryptKey: string
): string => {
  const raw = Buffer.from(encryptedBase64, "base64");
  const data = new Uint8Array(raw);

  const iv = data.slice(0, IV_LENGTH);
  const encrypted = data.slice(IV_LENGTH, data.length - 16);
  const authTag = data.slice(data.length - 16);

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(encryptKey),
    iv
  );
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
