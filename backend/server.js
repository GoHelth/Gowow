// 🏆 Gowow Server - إعداد السيرفر الأساسي

// 🛠️ تحميل إعدادات البيئة في البداية
require('dotenv').config();

// استيراد الحزم المطلوبة
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet'); // 🛡️ أمان إضافي
const rateLimit = require('express-rate-limit'); // ⏳ تحديد عدد الطلبات لكل IP
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// استيراد ملف الاتصال بقاعدة البيانات
const connectDB = require('./config/database');
const settings = require('./config/settings'); // استيراد ملف الإعدادات

// استيراد الملفات الداخلية
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');

// 🛠️ تشغيل الاتصال بقاعدة البيانات
connectDB()
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // إنهاء التشغيل إذا فشل الاتصال
    });

// إنشاء تطبيق Express
const app = express();

// 🛠️ الإعدادات العامة
app.use(express.json()); // دعم JSON
app.use(cors()); // السماح بالاتصال بين الواجهة الخلفية والأمامية
app.use(morgan('dev')); // تسجيل الطلبات القادمة للسيرفر
app.use(helmet()); // 🛡️ حماية ضد الهجمات
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // ⏳ 15 دقيقة
    max: 100 // ⏳ الحد الأقصى للطلبات من نفس IP
}));

// 🚀 إعداد المسارات (Routes)
app.use('/api/auth', authRoutes);       // تسجيل الدخول والمستخدمين
app.use('/api/products', productRoutes); // إدارة المنتجات والمخزون
app.use('/api/sales', salesRoutes);      // إدارة الفواتير والمبيعات

// 🛡️ التعامل مع الأخطاء (Middleware)
app.use((err, req, res, next) => {
    console.error(`❌ [ERROR] ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || '⚠️ حدث خطأ في السيرفر' });
});

// 🚀 تشغيل السيرفر بعد التأكد من نجاح الاتصال
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
