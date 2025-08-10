// backend/utils/logger.js
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// فرمت زمان + پیام
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// تنظیم ذخیره روزانه
const transportAll = new transports.DailyRotateFile({
  filename: path.join(__dirname, '../logs/app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '14d'
});

const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    transportAll,
    new transports.Console() // نمایش همزمان در کنسول
  ]
});

module.exports = logger;
