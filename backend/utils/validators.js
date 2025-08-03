const validator = require('validator');

module.exports = {
  /**
   * بررسی فرمت ایمیل
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    return validator.isEmail(email);
  },

  /**
   * بررسی قوی بودن رمز عبور
   * @param {string} password
   * @returns {boolean}
   */
  isStrongPassword(password) {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    });
  },

  /**
   * بررسی فرمت شماره موبایل ایران (با +98 یا 09)
   * @param {string} phone
   * @returns {boolean}
   */
  isValidIranianPhone(phone) {
    return /^(\+98|0)?9\d{9}$/.test(phone);
  },

  /**
   * بررسی کد ملی ایران
   * @param {string} code
   * @returns {boolean}
   */
  isValidIranianNationalCode(code) {
    if (!/^\d{10}$/.test(code)) return false;

    const check = +code[9];
    const sum = code
      .split('')
      .slice(0, 9)
      .reduce((total, num, i) => total + +num * (10 - i), 0);

    const remainder = sum % 11;
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  },

  /**
   * بررسی رشته خالی یا فقط فاصله
   * @param {string} str
   * @returns {boolean}
   */
  isNotEmpty(str) {
    return typeof str === 'string' && str.trim().length > 0;
  },

  /**
   * بررسی اینکه مقدار عدد صحیح است
   * @param {any} value
   * @returns {boolean}
   */
  isInteger(value) {
    return Number.isInteger(value);
  },

  /**
   * بررسی UUID یا ObjectId (مخصوص MongoDB)
   * @param {string} id
   * @returns {boolean}
   */
  isMongoId(id) {
    return validator.isMongoId(id);
  }
};
