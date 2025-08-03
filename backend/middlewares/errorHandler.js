const fs = require('fs');
const path = require('path');
const AppError = require('../utils/AppError');

// مسیر فایل لاگ خطا
const logPath = path.join(__dirname, '..', 'logs', 'error-log.json');

// اطمینان از وجود دایرکتوری logs
if (!fs.existsSync(path.dirname(logPath))) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
}

/**
 * ذخیره خودکار خطا در فایل JSON
 */
const logErrorToFile = (errorObj) => {
  let logs = [];

  // خواندن لاگ‌های قبلی اگر وجود دارد
  if (fs.existsSync(logPath)) {
    try {
      const data = fs.readFileSync(logPath, 'utf8');
      logs = JSON.parse(data);
    } catch (err) {
      console.error('❌ خواندن لاگ خطا شکست خورد:', err);
    }
  }

  // اضافه کردن خطای جدید به ابتدای آرایه
  logs.unshift({
    timestamp: new Date().toISOString(),
    statusCode: errorObj.statusCode,
    message: errorObj.message,
    stack: errorObj.stack || null,
    url: errorObj.url || null,
    method: errorObj.method || null
  });

  // حداکثر 100 خطا نگه داریم
  logs = logs.slice(0, 100);

  // نوشتن مجدد فایل
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
};

/**
 * Middleware مدیریت خطاها
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err);

  if (!(err instanceof AppError)) {
    err = new AppError('خطای داخلی سرور', 500);
  }

  // ذخیره خطا در فایل
  logErrorToFile({
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

module.exports = globalErrorHandler;
