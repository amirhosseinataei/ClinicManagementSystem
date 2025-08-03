const express = require('express');
const dotenv = require('dotenv');
const Database = require('./config/db');
const RouteManager = require('./routes/routeManager');

// بارگذاری env
dotenv.config();

// راه‌اندازی دیتابیس
const db = new Database(process.env.MONGODB_URI);
db.connect();

const app = express();
const routeManager = new RouteManager();

// Middlewareهای عمومی
app.use(express.json());
routeManager.registerRoutes(app);


module.exports = app;