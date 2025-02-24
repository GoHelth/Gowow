const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    reduceStock
} = require('../controllers/productController');
const { protectRoute, staffOrAdmin, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// 🛍️ إضافة منتج جديد (يجب أن يكون المستخدم موظفًا أو مديرًا)
router.post('/create', protectRoute, staffOrAdmin, createProduct);

// 🔍 البحث عن منتج باستخدام الكلمة المفتاحية
router.get('/search', searchProducts);

// 📋 جلب جميع المنتجات
router.get('/', getAllProducts);

// 📦 جلب منتج معين حسب ID
router.get('/:id', getProductById);

// ✏️ تحديث بيانات المنتج (يجب أن يكون المستخدم موظفًا أو مديرًا)
router.put('/:id', protectRoute, staffOrAdmin, updateProduct);

// ❌ حذف المنتج (مسموح فقط للمدير)
router.delete('/:id', protectRoute, adminOnly, deleteProduct);

// 🔄 تقليل كمية المنتج عند البيع
router.post('/reduce-stock', protectRoute, reduceStock);

module.exports = router;
