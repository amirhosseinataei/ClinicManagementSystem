const User = require('../models/User');
const LoginSession = require('../models/LoginSession');
const tokenUtils = require('../utils/tokenUtils');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const userAgent = require('express-useragent');

class AuthController {
  constructor() {
    this.register = catchAsync(this.register.bind(this));
    this.verifyOtp = catchAsync(this.verifyOtp.bind(this));
    this.login = catchAsync(this.login.bind(this));
    this.logout = catchAsync(this.logout.bind(this));
    this.getCurrentUser = catchAsync(this.getCurrentUser.bind(this));
    this.recoverPhone = catchAsync(this.recoverPhone.bind(this));
    this.confirmRecoveredPhone = catchAsync(this.confirmRecoveredPhone.bind(this));
  }

  async register(req, res) {
    const { phone } = req.body;

    if (!phone) throw new AppError('شماره موبایل الزامی است.', 400);

    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone });

    const otp = tokenUtils.generateOTP();
    user.sms_code = otp;
    await user.save();
    console.log(otp   );
    
    // OTP فرضی است
    res.status(200).json({ message: 'کد تأیید ارسال شد (فرضی)', otp });
  }

  async verifyOtp(req, res) {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user || user.sms_code !== otp) throw new AppError('کد اشتباه است.', 401);

    user.is_phone_verified = true;
    user.sms_code = null;
    await user.save();

    const { token, hashedToken } = tokenUtils.createTokenWithHash({ id: user._id });
    const source = userAgent.parse(req.headers['user-agent']);

    await LoginSession.create({
      user_id: user._id,
      token: hashedToken,
      os: source.os,
      browser: source.browser,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      created_at: new Date(),
    });

    user.current_login_token = hashedToken;
    await user.save();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ message: 'ورود موفقیت‌آمیز بود.' });
  }

  async login(req, res) {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) throw new AppError('کاربر یافت نشد.', 404);

    const otp = tokenUtils.generateOTP();
    user.sms_code = otp;
    await user.save();

    res.status(200).json({ message: 'OTP مجدداً ارسال شد (فرضی)', otp });
  }

  async logout(req, res) {
    const token = req.cookies.token;
    const hashedToken = tokenUtils.hashToken(token);

    await LoginSession.deleteOne({ user_id: req.user.id, token: hashedToken });
    await User.findByIdAndUpdate(req.user.id, { current_login_token: null });

    res.clearCookie('token');
    res.status(200).json({ message: 'خروج موفقیت‌آمیز.' });
  }

  async getCurrentUser(req, res) {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  }

  async recoverPhone(req, res) {
    const { national_code } = req.body;
    const user = await User.findOne({ national_code });

    if (!user) throw new AppError('کاربر با این کد ملی یافت نشد.', 404);
    const phone = user.phone;
    const hint = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

    res.status(200).json({ hint });
  }

  async confirmRecoveredPhone(req, res) {
    const { national_code, phone } = req.body;
    const user = await User.findOne({ national_code, phone });
    if (!user) throw new AppError('اطلاعات تطابق ندارد.', 404);

    const otp = tokenUtils.generateOTP();
    user.sms_code = otp;
    await user.save();

    res.status(200).json({ message: 'کد مجدداً ارسال شد (فرضی)', otp });
  }
}

module.exports = new AuthController();
