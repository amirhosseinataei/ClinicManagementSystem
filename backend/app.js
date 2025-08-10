const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// امنیت و بهینه‌سازی
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require("express-slow-down");
const toobusy = require('toobusy-js');
const morgan = require('morgan');
const expressStatusMonitor = require('express-status-monitor');
const logger = require('./utils/logger'); // فایل لاگر

// اتصال به دیتابیس
const Database = require('./config/db');
const RouteManager = require('./routes/routeManager');
const overseerClinicsRoutes = require('./routes/overseerClinicsRoutes');
const overseerDrugRoutes = require('./routes/overseerDrugRoutes');

// بارگذاری env
dotenv.config();

// اتصال دیتابیس
const db = new Database(process.env.MONGODB_URI);
db.connect();

const app = express();
const routeManager = new RouteManager();

// ویو انجین
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// مانیتورینگ
app.use(expressStatusMonitor());

// جلوگیری از overload سرور
app.use((req, res, next) => {
    if (toobusy()) {
        return res.status(503).send("Server is busy, please try again later.");
    }
    next();
});

// امنیت
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(hpp());
app.use(mongoSanitize());
app.use(xssClean());

// بهینه‌سازی
app.use(compression());

// محدودیت درخواست‌ها (ضد DDoS و Brute Force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 100, // حداکثر 100 درخواست
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);


app.use(
  slowDown({
    windowMs: 60 * 1000, // 1 دقیقه
    delayAfter: 20, // بعد از 20 درخواست در دقیقه
    delayMs: () => 500, // هر درخواست اضافی 0.5 ثانیه تاخیر
  })
);


// Middlewareهای عمومی
app.use(express.json());
app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
// ثبت روت‌ها
app.use('/overseer', overseerClinicsRoutes);
app.use('/overseer', overseerDrugRoutes);

routeManager.registerRoutes(app);

// هندل کردن خطاها
app.use(require('./middlewares/errorHandler'));

module.exports = app;
