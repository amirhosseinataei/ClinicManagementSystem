// src/middleware/roleMiddleware.js

const Roles = require('../config/roles');
const AppError = require('../utils/AppError');

class RoleMiddleware {
  /**
   * بررسی نقش‌های مجاز برای دسترسی به یک مسیر خاص
   * @param {string[]} allowedRoles - لیست نقش‌های مجاز برای این مسیر
   * @returns Middleware function
   */
  allowRoles(allowedRoles) {
    return (req, res, next) => {
      const user = req.user;

      // اگر کاربر در سیستم شناسایی نشده باشد
      if (!user || !user.role) {
        return next(new AppError('Unauthorized: No user role found', 401));
      }

      // اگر نقش کاربر جزء لیست نقش‌های مجاز نیست
      if (!allowedRoles.includes(user.role)) {
        return next(new AppError('Forbidden: You do not have access to this resource', 403));
      }

      next(); // نقش کاربر مجاز است، ادامه بده
    };
  }

  /**
   * فقط نقش خاصی را مجاز می‌کند (شورت‌کات)
   * @param {string} role - یک نقش خاص
   * @returns Middleware function
   */
  allowOnly(role) {
    return this.allowRoles([role]);
  }

  /**
   * بررسی اینکه کاربر فقط مدیر (admin) است
   */
  isAdmin() {
    return this.allowOnly(Roles.ADMIN);
  }

  /**
   * بررسی اینکه کاربر پزشک است
   */
  isDoctor() {
    return this.allowOnly(Roles.DOCTOR);
  }

  /**
   * بررسی اینکه کاربر بیمار است
   */
  isPatient() {
    return this.allowOnly(Roles.PATIENT);
  }
}

module.exports = new RoleMiddleware();
