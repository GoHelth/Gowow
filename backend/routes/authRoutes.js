const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
} = require('../controllers/authController');
const { protectRoute, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// 📝 تسجيل مستخدم جديد
router.post('/register', registerUser);

// 🔐 تسجيل الدخول
router.post('/login', loginUser);

// 🛡️ جلب بيانات المستخدم (محمي بـ JWT)
router.get('/profile', protectRoute, getUserProfile);

// 🔄 تحديث بيانات المستخدم
router.put('/profile', protectRoute, updateUserProfile);

// ❌ حذف مستخدم (خاص بالمدير فقط)
router.delete('/user/:id', protectRoute, adminOnly, deleteUser);

module.exports = router;
