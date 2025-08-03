const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    ثبت‌نام با شماره موبایل (مرحله ارسال OTP)
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    تأیید کد OTP ارسال‌شده
 */
router.post('/verify-otp', authController.verifyOtp);

/**
 * @route   POST /api/auth/login
 * @desc    ورود با شماره موبایل و OTP (ارسال دوباره OTP)
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    خروج از سیستم (حذف session)
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    دریافت اطلاعات کاربر لاگین‌شده
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route   POST /api/auth/recover-phone
 * @desc    بازیابی شماره موبایل با کد ملی (ارسال چند رقم اول/آخر موبایل)
 */
router.post('/recover-phone', authController.recoverPhone);

/**
 * @route   POST /api/auth/confirm-recovered-phone
 * @desc    تأیید شماره بازیابی‌شده و ارسال مجدد OTP
 */
router.post('/confirm-recovered-phone', authController.confirmRecoveredPhone);

module.exports = router;
