const express = require('express');
const dotenv = require('dotenv');
const Database = require('./config/db');

// بارگذاری env
dotenv.config();

// راه‌اندازی دیتابیس
const db = new Database(process.env.MONGODB_URI);
db.connect();

const app = express();

// Middlewareهای عمومی
app.use(express.json());

// مثال route تستی
app.get('/', (req, res) => {
  res.send('Clinic Management System is running...');
});


module.exports = app;
