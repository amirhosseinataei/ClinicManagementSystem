class AppError extends Error {
    /**
     * @param {string} message - پیام خطا
     * @param {number} statusCode - کد وضعیت HTTP (مثلاً 404، 401، 500)
     */
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // برای تفکیک خطاهای برنامه‌ریزی‌شده از خطاهای سیستمی
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  