# 🛡️ Security Plan – سامانه مدیریت درمانگاه

**نسخه: 1.0.0**  
**تاریخ بروزرسانی: 1404/05/08**  
**هدف: محافظت از اطلاعات بیماران، کاربران و زیرساخت فنی سامانه درمانگاه**

---

## 1. 🎯 اهداف امنیتی (Security Goals)

- حفاظت از محرمانگی اطلاعات شخصی و پزشکی بیماران
- تضمین صحت و یکپارچگی داده‌ها
- جلوگیری از دسترسی غیرمجاز (Unauthorized Access)
- مقابله با حملات رایج در وب‌سایت‌ها و APIها
- رمزنگاری داده‌های حساس و اطمینان از محرمانگی کلیدها

---

## 2. 🧩 فناوری‌های امنیتی مورد استفاده

| مؤلفه         | تکنولوژی                 |
|---------------|--------------------------|
| احراز هویت     | JSON Web Token (JWT)     |
| بک‌اند         | Node.js + Express        |
| پایگاه داده     | MongoDB + Mongoose       |
| زبان           | JavaScript (در آینده: TypeScript) |
| رمزنگاری       | bcryptjs, HS256          |
| محیط تنظیمات   | dotenv (.env)            |

---

## 3. 🔐 احراز هویت (Authentication)

### ✅ JWT-based Authentication

- استفاده از `JWT` با کلید امضا از فایل `.env`
- رمزنگاری با الگوریتم `HS256`
- انقضای توکن: 1 ساعت

```js
// generateToken.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    id: user._id,
    role: user.role,
    clinicId: user.clinicId
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256'
  });
}
```

### 📦 Middleware بررسی توکن

```js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
```

---

## 4. 📋 کنترل سطح دسترسی (RBAC)

```js
function allowRoles(...allowed) {
  return (req, res, next) => {
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

// استفاده:
app.post('/drugs/add', verifyToken, allowRoles('pharmacyManager'), handler);
```

---

## 5. 🔐 رمزنگاری و مدیریت رمز عبور

- هش کردن رمز عبور با `bcryptjs`
- پیچیدگی رمز: حداقل 8 کاراکتر، شامل عدد، حرف و علامت خاص

```js
const bcrypt = require('bcryptjs');

const hashPassword = (password) => bcrypt.hashSync(password, 12);
const checkPassword = (password, hash) => bcrypt.compareSync(password, hash);
```

---

## 6. 🧯 محافظت در برابر حملات رایج

| حمله            | راهکار                                                     |
| --------------- | ---------------------------------------------------------- |
| XSS             | پاکسازی ورودی با `express-validator`                       |
| CSRF            | (در نسخه آینده) استفاده از `csurf`                         |
| Brute Force     | استفاده از `express-rate-limit`                            |
| NoSQL Injection | اعتبارسنجی تمام ورودی‌ها و استفاده نکردن از کوئری‌های پویا |
| File Upload     | فیلتر نوع فایل، محدودیت حجم، آنتی‌ویروس در سمت سرور        |

```js
const rateLimit = require('express-rate-limit');

app.use('/auth/login', rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
}));
```

---

## 7. 🧱 امنیت کلاس‌های بک‌اند با کلید محیطی

### ✅ ایده پیاده‌سازی

ایجاد کلاس‌هایی که فقط در صورت داشتن کلید معتبر (از `.env`) فعال می‌شوند. همچنین الگوریتم‌های درون کلاس هر چند وقت با الگوی جدید جایگزین می‌شوند.

```js
class SecureFeature {
  constructor(mode, key) {
    if (key !== process.env.SECURE_KEY) throw new Error('Unauthorized');
    this.mode = mode;
  }

  execute() {
    switch (this.mode) {
      case 'default': return this.defaultLogic();
      case 'experimental': return this.testLogic();
      default: throw new Error('Invalid mode');
    }
  }

  defaultLogic() {
    // الگوریتم اصلی
  }

  testLogic() {
    // الگوریتم جایگزین
  }
}
```

### ✅ مزایا:

- جلوگیری از اجرای توابع حساس توسط کاربران غیرمجاز
- کنترل پویا روی منطق برنامه بدون تغییر کد اصلی
- امکان چرخش الگوریتم‌ها در بازه‌های مشخص

### ⚠️ معایب:

- وابستگی بیشتر به فایل `.env`
- افزایش پیچیدگی تست
- نیاز به مدیریت دقیق لاگ‌ها و هشدارها

---

## 8. 📁 امنیت فایل‌ها و داده‌های آزمایشگاه

- فایل‌های آزمایش/تصویربرداری با URL موقتی در دسترس قرار می‌گیرند.
- جلوگیری از آپلود فایل مخرب با `multer`:

```js
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({
  dest: 'uploads/',
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

---

## 9. 🔄 پشتیبان‌گیری و Disaster Recovery

- استفاده از ابزار `mongodump` برای بکاپ روزانه
- رمزنگاری فایل‌های پشتیبان با `openssl`
- نگهداری نسخه‌های رمزنگاری‌شده در فضای امن (مثلاً S3)

```bash
mongodump --uri=$MONGO_URI --gzip --archive=backup.gz
openssl enc -aes-256-cbc -salt -in backup.gz -out backup.enc -k $BACKUP_SECRET
```

---

## 10. 🧪 لاگ‌گیری و نظارت امنیتی

- ثبت لاگ‌ها با `winston` و ذخیره در فایل مجزا

```js
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
  ]
});

logger.info('User login success');
logger.warn('Unauthorized access attempt');
```

---

## 11. ✅ امنیت پایگاه داده MongoDB

- اتصال امن با `mongodb+srv`
- فعال‌سازی احراز هویت در MongoDB Atlas
- محدود کردن IPهای مجاز
- جلوگیری از دسترسی به فیلدهای مهم مانند `password` در پاسخ‌ها

```js
// حذف رمز از خروجی:
user = user.toObject();
delete user.password;
res.json(user);
```

---

## 12. 📎 ضمیمه‌ها

### 🎫 نمونه فایل .env

```
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=verySecretJwtKey
SECURE_KEY=privateFeatureKey
BACKUP_SECRET=backUpEncryptionKey
```

### 📦 نمونه payload توکن

```json
{
  "id": "user123",
  "role": "doctor",
  "clinicId": "clinic456",
  "iat": 1723456789,
  "exp": 1723460389
}
```

---

## 📝 جمع‌بندی

- امنیت باید در همه لایه‌ها اعمال شود: پایگاه‌داده، احراز هویت، سطح دسترسی، فایل‌ها
- استفاده از معماری کلاس امن و رمزهای محیطی یک استراتژی پیشرفته اما پیچیده است
- این فایل باید به‌صورت دوره‌ای بازبینی و به‌روزرسانی شود، خصوصاً با تغییر معماری پروژه

> 🔒 پیشنهاد: فایل `SecurityPlan.md` در مسیر `docs/security/` پروژه نگهداری و ورژن‌گذاری شود.
