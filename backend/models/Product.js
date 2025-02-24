const mongoose = require('mongoose');

// 🛠️ إنشاء مخطط المنتج (Schema)
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, '⚠️ يجب إدخال اسم المنتج'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: [true, '⚠️ يجب إدخال وصف المنتج']
        },
        price: {
            type: Number,
            required: [true, '⚠️ يجب إدخال سعر المنتج'],
            min: [0, '⚠️ لا يمكن أن يكون السعر أقل من 0']
        },
        stock: {
            type: Number,
            required: [true, '⚠️ يجب إدخال الكمية المتاحة'],
            min: [0, '⚠️ لا يمكن أن يكون المخزون أقل من 0']
        },
        category: {
            type: String,
            required: [true, '⚠️ يجب إدخال تصنيف المنتج']
        },
        imageUrl: {
            type: String,
            default: 'https://via.placeholder.com/150' // رابط افتراضي للصورة
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

// 🛠️ إنشاء النموذج بناءً على المخطط
const Product = mongoose.model('Product', productSchema);

// 📤 تصدير النموذج
module.exports = Product;
