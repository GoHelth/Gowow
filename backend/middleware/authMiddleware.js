const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

// تحميل إعدادات البيئة
dotenv.config();

// 🛠️ التحقق من صحة التوكن JWT وحماية المسارات
const protectRoute = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // فك تشفير التوكن
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // جلب بيانات المستخدم من قاعدة البيانات بدون كلمة المرور
            req.user = await User.findById(decoded.id).select('-password');

            next(); // السماح بالوصول إلى المسار المطلوب
        } catch (error) {
            res.status(401).json({ message: '⚠️ التوكن غير صالح أو منتهي الصلاحية' });
        }
    } else {
        res.status(401).json({ message: '⚠️ لا يوجد توكن مصادقة، الوصول غير مسموح' });
    }
};

// 🛠️ التحقق من صلاحيات المدير فقط
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // السماح بالوصول
    } else {
        res.status(403).json({ message: '🚫 غير مصرح لك بالوصول إلى هذا المسار' });
    }
};

// 🛠️ التحقق من صلاحيات الموظفين والمدير
const staffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
        next(); // السماح بالوصول
    } else {
        res.status(403).json({ message: '🚫 غير مصرح لك بالوصول إلى هذا المسار' });
    }
};

// 📤 تصدير الوظائف
module.exports = {
    protectRoute,
    adminOnly,
    staffOrAdmin
};
