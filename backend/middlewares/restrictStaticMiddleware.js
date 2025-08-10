const winston = require('winston');
const path = require('path');

// تنظیم لاگینگ با winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/restrict-static.log') })
  ]
});

const restrictStaticMiddleware = (req, res, next) => {
  // لاگ درخواست
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    referer: req.headers.referer || 'none'
  });

  next(); // بدون بلاک کردن، فقط لاگ می‌کنه
};

module.exports = restrictStaticMiddleware;