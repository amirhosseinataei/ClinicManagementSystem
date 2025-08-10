require('dotenv').config();

class IPWhitelistMiddleware {
  constructor(initialList = []) {
    // اگر env باشد از آن، در غیر این صورت لیست دستی
    this.whitelist = process.env.ALLOWED_IPS
      ? process.env.ALLOWED_IPS.split(',').map(ip => ip.trim())
      : initialList;

    this.debug = process.env.DEBUG_IP_MIDDLEWARE === 'true';
  }

  /**
   * بررسی اینکه آیا IP در لیست سفید وجود دارد یا نه
   * @param {string} ip
   * @returns {boolean}
   */
  isAllowed(ip) {
    return this.whitelist.includes(ip);
  }

  /**
   * middleware Express برای استفاده مستقیم
   * @returns middleware function
   */
  middleware() {
    return (req, res, next) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if (this.debug) console.log(`[IP Check] Incoming IP: ${ip}`);

      if (this.isAllowed(ip)) {
        return next();
      } else {
        if (this.debug) console.warn(`[IP BLOCKED] ${ip} is not in whitelist`);
        return res.status(403).json({ message: 'Access denied: IP not allowed' });
      }
    };
  }

  /**
   * اضافه کردن IP جدید
   * @param {string} ip
   */
  addIP(ip) {
    if (!this.whitelist.includes(ip)) {
      this.whitelist.push(ip);
    }
  }

  /**
   * حذف IP خاص
   * @param {string} ip
   */
  removeIP(ip) {
    this.whitelist = this.whitelist.filter(item => item !== ip);
  }

  /**
   * گرفتن لیست فعلی
   * @returns {string[]}
   */
  getList() {
    return this.whitelist;
  }

  /**
   * ریست کامل لیست
   * @param {string[]} newList
   */
  resetList(newList = []) {
    this.whitelist = newList;
  }

  /**
   * فعال یا غیرفعال کردن لاگ‌گیری
   * @param {boolean} flag
   */
  setDebug(flag) {
    this.debug = flag;
  }
}

module.exports = IPWhitelistMiddleware;
