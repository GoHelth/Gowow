const express = require('express');
const {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    getSalesReport
} = require('../controllers/salesController');
const { protectRoute, adminOnly, staffOrAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// 🛍️ إنشاء عملية بيع جديدة (يجب أن يكون المستخدم موظفًا أو مديرًا)
router.post('/create', protectRoute, staffOrAdmin, createSale);

// 📋 جلب جميع الفواتير (يجب أن يكون المستخدم موظفًا أو مديرًا)
router.get('/', protectRoute, staffOrAdmin, getAllSales);

// 🧾 جلب فاتورة معينة حسب ID
router.get('/:id', protectRoute, getSaleById);

// ✏️ تحديث بيانات الفاتورة (يجب أن يكون المستخدم موظفًا أو مديرًا)
router.put('/:id', protectRoute, staffOrAdmin, updateSale);

// ❌ حذف فاتورة (مسموح فقط للمدير)
router.delete('/:id', protectRoute, adminOnly, deleteSale);

// 📊 تقرير المبيعات بين تاريخين (مسموح فقط للمدير)
router.get('/report', protectRoute, adminOnly, getSalesReport);

module.exports = router;
