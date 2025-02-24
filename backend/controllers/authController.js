const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// 🛠️ توليد توكن JWT عند تسجيل الدخول
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 🔹 تسجيل مستخدم جديد
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // التحقق من وجود المستخدم مسبقًا
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '⚠️ هذا البريد الإلكتروني مستخدم بالفعل' });
        }

        // تشفير كلمة المرور وإنشاء المستخدم
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء التسجيل' });
    }
};

// 🔹 تسجيل الدخول
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: '⚠️ البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء تسجيل الدخول' });
    }
};

// 🔹 جلب بيانات المستخدم (محمي بـ JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: '⚠️ المستخدم غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء جلب البيانات' });
    }
};

// 🔹 تحديث بيانات المستخدم
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: '⚠️ المستخدم غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء تحديث البيانات' });
    }
};

// 🔹 حذف المستخدم (خاص بالمدير فقط)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();
            res.json({ message: '✅ تم حذف المستخدم بنجاح' });
        } else {
            res.status(404).json({ message: '⚠️ المستخدم غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء حذف المستخدم' });
    }
};

// 📤 تصدير الوظائف
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
};
