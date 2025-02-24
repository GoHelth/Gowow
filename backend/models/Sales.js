const mongoose = require('mongoose');

// 🛠️ إنشاء مخطط المبيعات (Schema)
const salesSchema = mongoose.Schema(
    {
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: [true, '⚠️ يجب إدخال كمية المنتج'],
                    min: [1, '⚠️ لا يمكن أن يكون العدد أقل من 1']
                },
                price: {
                    type: Number,
                    required: [true, '⚠️ يجب إدخال سعر المنتج']
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: [true, '⚠️ يجب إدخال المبلغ الإجمالي'],
            min: [0, '⚠️ لا يمكن أن يكون المبلغ أقل من 0']
        },
        customerName: {
            type: String,
            required: [true, '⚠️ يجب إدخال اسم العميل']
        },
        paymentMethod: {
            type: String,
            enum: ['كاش', 'بطاقة ائتمانية', 'تحويل بنكي'],
            required: [true, '⚠️ يجب اختيار طريقة الدفع']
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
const Sale = mongoose.model('Sale', salesSchema);

// 📤 تصدير النموذج
module.exports = Sale;
