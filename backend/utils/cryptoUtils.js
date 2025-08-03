const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const ALGORITHM = 'aes-256-ecb'; // هشدار: استفاده از ECB توصیه نمی‌شود برای داده‌های خیلی حساس
const BLOCK_SIZE = 16;

/**
 * افزودن padding دستی برای بلاک‌های AES
 */
const addPadding = (text) => {
  const paddingLength = BLOCK_SIZE - (text.length % BLOCK_SIZE);
  return text + String.fromCharCode(paddingLength).repeat(paddingLength);
};

/**
 * حذف padding بعد از رمزگشایی
 */
const removePadding = (text) => {
  const paddingLength = text.charCodeAt(text.length - 1);
  return text.slice(0, -paddingLength);
};

/**
 * تولید کلید از رشته‌ای (مثلاً env variable)
 */
const getKeyFromSecret = (secret) => {
  if (!secret) {
    throw new Error('Encryption key (secret) is required.');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * رمزنگاری متن ساده
 */
const encrypt = (text, secretKey = process.env.ENCRYPTION_KEY) => {
  if (!text || typeof text !== 'string') return '';

  const key = getKeyFromSecret(secretKey);
  const paddedText = addPadding(text);

  const cipher = crypto.createCipheriv(ALGORITHM, key, null);
  let encrypted = cipher.update(paddedText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * رمزگشایی متن رمز شده
 */
const decrypt = (encryptedText, secretKey = process.env.ENCRYPTION_KEY) => {
  if (!encryptedText || typeof encryptedText !== 'string') return '';

  const key = getKeyFromSecret(secretKey);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, null);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return removePadding(decrypted);
};

/**
 * رمزنگاری محتوای یک فایل و بازنویسی آن
 */
const encryptFile = (filePath, secretKey = process.env.ENCRYPTION_KEY) => {
  try {
    const absolutePath = path.resolve(filePath);
    const data = fs.readFileSync(absolutePath, 'utf-8');
    const encrypted = encrypt(data, secretKey);
    fs.writeFileSync(absolutePath, encrypted, 'utf-8');
  } catch (error) {
    console.error('خطا در رمزنگاری فایل:', error.message);
  }
};

/**
 * رمزگشایی محتوای یک فایل رمزنگاری شده
 */
const decryptFile = (filePath, secretKey = process.env.ENCRYPTION_KEY) => {
  try {
    const absolutePath = path.resolve(filePath);
    const data = fs.readFileSync(absolutePath, 'utf-8');
    return decrypt(data, secretKey);
  } catch (error) {
    console.error('خطا در رمزگشایی فایل:', error.message);
    return null;
  }
};

module.exports = {
  encrypt,
  decrypt,
  encryptFile,
  decryptFile,
};
