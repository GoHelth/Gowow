const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 🛠️ إنشاء مخطط المستخدم (Schema)
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, '⚠️ يجب إدخال اسم المستخدم']
        },
        email: {
            type: String,
            required: [true, '⚠️ يجب إدخال البريد الإلكتروني'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                '⚠️ يرجى إدخال بريد إلكتروني صالح'
            ]
        },
        password: {
            type: String,
            required: [true, '⚠️ يجب إدخال كلمة المرور'],
            minlength: [6, '⚠️ يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل']
        },
        role: {
            type: String,
            enum: ['admin', 'staff', 'user'],
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // إضافة توقيت الإنشاء والتحديث تلقائيًا
    }
);

// 🛠️ تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🛠️ التحقق من كلمة المرور عند تسجيل الدخول
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🛠️ إنشاء النموذج بناءً على المخطط
const User = mongoose.model('User', userSchema);

// 📤 تصدير النموذج
module.exports = User;
