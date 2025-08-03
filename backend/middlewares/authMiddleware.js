// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // مدل Mongoose

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'توکن ارسال نشده یا نامعتبر است.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'کاربر یافت نشد.' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error('خطا در احراز هویت:', err.message);
    return res.status(401).json({ message: 'توکن منقضی شده یا نامعتبر است.' });
  }
};

module.exports = authMiddleware;
