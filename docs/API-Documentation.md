# مستندات API (API Documentation)

**عنوان پروژه:** سامانه هوشمند مدیریت درمانگاه با نوبت‌دهی آنلاین، ویزیت مجازی و نظارت نسخه‌ها

**تاریخ نگارش:** 26 جولای 2025 (5 مرداد 1404)

**نسخه:** 1.0 (در حال تکمیل)

**تهیه‌کنندگان:**
* امیرحسین عطائی (توسعه‌دهنده بک‌اند)
* نگین یونسی (توسعه‌دهنده فرانت‌اند)

---

## ۱. مقدمه

این سند به عنوان مرجعی برای APIهای RESTful سامانه هوشمند مدیریت درمانگاه عمل می‌کند. هدف آن ارائه اطلاعات جامع در مورد Endpointsها، متدهای HTTP، پارامترهای درخواست، فرمت پاسخ‌ها و کدهای وضعیت HTTP است. این مستند برای توسعه‌دهندگان فرانت‌اند و هر سرویس دیگری که قصد تعامل با بک‌اند این سامانه را دارد، ضروری است.

**نکته:** این مستند یک نسخه در حال توسعه است و با پیشرفت پروژه، جزئیات بیشتری به آن اضافه خواهد شد.

### ۱.۱. ساختار کلی API

* **Base URL (محیط توسعه):** `http://localhost:5000/api/v1`
* **Base URL (محیط تولید):** `https://api.yourclinic.com/api/v1` (نام دامنه خود را جایگزین کنید)
* **فرمت داده‌ها:** JSON
* **کدهای وضعیت HTTP:** مطابق با استانداردهای HTTP (مثلاً `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).

### ۱.۲. احراز هویت (Authentication)

* **روش:** از JWT (JSON Web Tokens) برای احراز هویت استفاده می‌شود.
* **ارسال توکن:** توکن JWT باید در هدر `Authorization` به صورت `Bearer <token>` ارسال شود.
* **مثال هدر:** `Authorization: Bearer eyJhbGciOiJIUzI1Ni...`

---

## ۲. Endpointsهای اصلی API (در حال حاضر)

در این بخش، Endpointsهای کلیدی که در مراحل اولیه توسعه یافته‌اند، همراه با جزئیات آورده شده است.

### ۲.۱. احراز هویت (Auth)

* **`POST /auth/register`**
    * **توضیح:** ثبت‌نام کاربر جدید به عنوان بیمار.
    * **مجوز مورد نیاز:** عمومی (Public).
    * **درخواست (Request):**
        * **Header:** `Content-Type: application/json`
        * **Body (JSON):**
            ```json
            {
                "email": "user@example.com",
                "phone": "09123456789",
                "password": "password123",
                "passwordConfirm": "password123"
            }
            ```
    * **پاسخ موفق (Response - 201 Created):**
        ```json
        {
            "status": "success",
            "token": "eyJhbGciOiJIUzI1Ni...",
            "data": {
                "user": {
                    "_id": "60c72b1f9b1d8e001c8a1b2c",
                    "email": "user@example.com",
                    "phone": "09123456789",
                    "roles": ["patient"],
                    "isActive": true,
                    "createdAt": "2025-07-26T10:00:00.000Z"
                }
            }
        }
        ```
    * **پاسخ خطا (Response - 400 Bad Request):**
        ```json
        {
            "status": "fail",
            "message": "Please provide email, phone, and password"
        }
        ```

* **`POST /auth/login`**
    * **توضیح:** ورود کاربر به سیستم.
    * **مجوز مورد نیاز:** عمومی (Public).
    * **درخواست (Request):**
        * **Header:** `Content-Type: application/json`
        * **Body (JSON):**
            ```json
            {
                "email": "user@example.com",
                "password": "password123"
            }
            ```
    * **پاسخ موفق (Response - 200 OK):**
        ```json
        {
            "status": "success",
            "token": "eyJhbGciOiJIUzI1Ni...",
            "data": {
                "user": {
                    "_id": "60c72b1f9b1d8e001c8a1b2c",
                    "email": "user@example.com",
                    "roles": ["patient"]
                }
            }
        }
        ```
    * **پاسخ خطا (Response - 401 Unauthorized):**
        ```json
        {
            "status": "fail",
            "message": "Incorrect email or password"
        }
        ```

### ۲.۲. کاربران (Users)

* **`GET /users/me`**
    * **توضیح:** دریافت پروفایل کاربر وارد شده.
    * **مجوز مورد نیاز:** احراز هویت شده (Authenticated).
    * **درخواست (Request):**
        * **Header:** `Authorization: Bearer <JWT_TOKEN>`
    * **پاسخ موفق (Response - 200 OK):**
        ```json
        {
            "status": "success",
            "data": {
                "user": {
                    "_id": "60c72b1f9b1d8e001c8a1b2c",
                    "email": "user@example.com",
                    "phone": "09123456789",
                    "roles": ["patient"],
                    "isActive": true,
                    "createdAt": "2025-07-26T10:00:00.000Z",
                    "__v": 0
                }
            }
        }
        ```
    * **پاسخ خطا (Response - 401 Unauthorized):**
        ```json
        {
            "status": "fail",
            "message": "You are not logged in! Please log in to get access."
        }
        ```

* **`PATCH /users/me`**
    * **توضیح:** ویرایش پروفایل کاربر وارد شده.
    * **مجوز مورد نیاز:** احراز هویت شده (Authenticated).
    * **درخواست (Request):**
        * **Header:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
        * **Body (JSON):**
            ```json
            {
                "email": "new_email@example.com",
                "phone": "09100000000"
            }
            ```
    * **پاسخ موفق (Response - 200 OK):**
        ```json
        {
            "status": "success",
            "data": {
                "user": {
                    "_id": "60c72b1f9b1d8e001c8a1b2c",
                    "email": "new_email@example.com",
                    "phone": "09100000000",
                    "roles": ["patient"],
                    // ... سایر فیلدها
                }
            }
        }
        ```
    * **پاسخ خطا (Response - 400 Bad Request):**
        ```json
        {
            "status": "fail",
            "message": "Email is already taken"
        }
        ```

### ۲.۳. مدیریت پزشکان (Doctors)

* **`GET /doctors`**
    * **توضیح:** دریافت لیست پزشکان. (قابل فیلتر و جستجو).
    * **مجوز مورد نیاز:** عمومی (Public) یا احراز هویت شده (Authenticated).
    * **درخواست (Request):**
        * **Query Parameters (اختیاری):** `?specialization=Cardiology&name=ali&page=1&limit=10`
    * **پاسخ موفق (Response - 200 OK):**
        ```json
        {
            "status": "success",
            "results": 5, // تعداد پزشکان در این صفحه
            "data": {
                "doctors": [
                    {
                        "_id": "60c72b1f9b1d8e001c8a1b2d",
                        "userId": "60c72b1f9b1d8e001c8a1b2c",
                        "firstName": "علی",
                        "lastName": "رضایی",
                        "specialization": "قلب و عروق",
                        "clinicAddress": "تهران، خیابان ولیعصر"
                        // ...
                    }
                ]
            }
        }
        ```

* **`GET /doctors/:id`**
    * **توضیح:** دریافت جزئیات یک پزشک خاص.
    * **مجوز مورد نیاز:** عمومی (Public) یا احراز هویت شده (Authenticated).
    * **Path Parameters:** `:id` (شناسه پزشک)

---

## ۳. Endpointsهای آتی (Future Endpoints)

این بخش Endpointsهایی را که در فازهای بعدی توسعه خواهند یافت، به صورت خلاصه نشان می‌دهد.

### ۳.۱. نوبت‌دهی (Appointments)

* `GET /appointments`: مشاهده نوبت‌ها (برای بیمار/پزشک/مدیر).
* `GET /doctors/:id/available-slots`: مشاهده اسلات‌های خالی یک پزشک.
* `POST /appointments`: رزرو نوبت.
* `PATCH /appointments/:id/status`: تغییر وضعیت نوبت.

### ۳.۲. نسخه‌ها (Prescriptions)

* `POST /prescriptions`: ثبت نسخه جدید توسط پزشک.
* `GET /prescriptions/:id`: مشاهده جزئیات نسخه.
* `PATCH /prescriptions/:id/oversee`: تأیید/رد نسخه توسط ناظر.
* `GET /patients/:patientId/prescriptions`: مشاهده نسخه‌های یک بیمار.

### ۳.۳. ویزیت مجازی (Telemedicine)

* `POST /telemedicine/call/:appointmentId/start`: شروع تماس ویزیت مجازی.
* `POST /messages`: ارسال پیام چت.
* `GET /messages/:appointmentId`: دریافت تاریخچه چت یک ویزیت.

### ۳.۴. پنل مدیریت (Admin)

* `GET /admin/users`: مدیریت کاربران (اضافه/ویرایش/حذف).
* `PATCH /admin/users/:id/role`: تغییر نقش کاربر.
* `GET /admin/reports/summary`: گزارشات کلی سیستم.

---

## ۴. کدهای خطا (Error Codes)

پاسخ‌های خطا در قالب JSON و با کد وضعیت HTTP مناسب ارسال می‌شوند.

* **400 Bad Request:** داده‌های ورودی نامعتبر.
* **401 Unauthorized:** کاربر احراز هویت نشده یا توکن نامعتبر.
* **403 Forbidden:** کاربر دسترسی لازم برای انجام عملیات را ندارد.
* **404 Not Found:** منبع مورد نظر یافت نشد.
* **409 Conflict:** تداخل (مثلاً ایمیل یا شماره تلفن تکراری).
* **500 Internal Server Error:** خطای سرور.

**ساختار کلی پاسخ خطا:**
```json
{
    "status": "fail" | "error",
    "message": "Descriptive error message"
}