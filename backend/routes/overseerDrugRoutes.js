const express = require('express');
const router = express.Router();

const DrugModel = require('../models/Drug');
const UserModel = require('../models/User');

const OverseerDrugService = require('../services/OverseerDrugService');
const OverseerDrugController = require('../controllers/OverseerDrugController');
const IPWhitelistMiddleware = require('../middlewares/ipWhitelistMiddleware');
const multer = require('multer'); // اضافه کردن multer

require('dotenv').config();
const allowedIPs = process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [];
const debugIPMiddleware = process.env.DEBUG_IP_MIDDLEWARE === 'true';
const ipWhitelist = new IPWhitelistMiddleware(allowedIPs, debugIPMiddleware);

// تنظیمات multer برای آپلود فایل
const upload = multer({ 
  dest: 'uploads/', // پوشه موقت برای ذخیره فایل‌ها
  fileFilter: (req, file, cb) => {
    // فقط فایل‌های اکسل رو قبول کن
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های اکسل مجاز هستند'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // محدودیت 5MB
});

// DI
const drugService = new OverseerDrugService({ DrugModel, UserModel });
const overseerDrugController = new OverseerDrugController(drugService);

// مسیرها بدون /overseer
router.get('/drugs/:drugId', ipWhitelist.middleware(), overseerDrugController.getDrugById.bind(overseerDrugController));
router.post('/drugs', ipWhitelist.middleware(), overseerDrugController.createDrug.bind(overseerDrugController));
router.put('/drugs/:drugId', ipWhitelist.middleware(), overseerDrugController.updateDrug.bind(overseerDrugController));
router.patch('/drugs/:drugId/status', ipWhitelist.middleware(), overseerDrugController.toggleDrugStatus.bind(overseerDrugController));
router.post('/drugs/upload', ipWhitelist.middleware(), upload.single('excelFile'), overseerDrugController.uploadDrugFromExcel.bind(overseerDrugController));

module.exports = router;