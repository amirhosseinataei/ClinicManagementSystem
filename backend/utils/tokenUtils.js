const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenUtils {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default_secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  /**
   * تولید توکن JWT بر اساس payload (مثلاً { id: user._id })
   * @param {Object} payload
   * @returns {string} JWT Token
   */
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  /**
   * اعتبارسنجی JWT Token
   * @param {string} token
   * @returns {Object} payload (decoded) یا throws Error
   */
  verifyToken(token) {
    return jwt.verify(token, this.jwtSecret);
  }

  /**
   * هش کردن توکن با الگوریتم SHA256 برای ذخیره در پایگاه داده
   * @param {string} token
   * @returns {string} توکن هش‌شده
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * بررسی تطابق توکن ورودی با توکن هش‌شده در پایگاه داده
   * @param {string} rawToken - توکن خام (از کوکی یا Header)
   * @param {string} storedHashedToken - توکن هش‌شده ذخیره‌شده در پایگاه داده
   * @returns {boolean} آیا توکن معتبر است؟
   */
  compareHashedToken(rawToken, storedHashedToken) {
    const hashed = this.hashToken(rawToken);
    return hashed === storedHashedToken;
  }

  /**
   * ایجاد توکن و هش‌شده‌ی آن همزمان (برای ذخیره در DB)
   * @param {Object} payload
   * @returns {{ token: string, hashedToken: string }}
   */
  createTokenWithHash(payload) {
    const token = this.generateToken(payload);
    const hashedToken = this.hashToken(token);
    return { token, hashedToken };
  }

  /**
   * تولید یک رمز یکبار مصرف (OTP) ساده 6 رقمی
   * @returns {string}
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = new TokenUtils();
