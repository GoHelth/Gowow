const Sale = require('../models/Sales');
const Product = require('../models/Product');

// 🛠️ إنشاء عملية بيع جديدة
const createSale = async (req, res) => {
    try {
        const { products, totalAmount, customerName, paymentMethod } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: '⚠️ يجب إضافة منتجات إلى الفاتورة' });
        }

        // تحديث المخزون لكل منتج بعد عملية البيع
        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `⚠️ المنتج غير موجود: ${item.productId}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `⚠️ الكمية غير كافية للمنتج: ${product.name}` });
            }

            product.stock -= item.quantity;
            await product.save();
        }

        // إنشاء سجل عملية البيع
        const sale = new Sale({
            products,
            totalAmount,
            customerName,
            paymentMethod
        });

        const savedSale = await sale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء إنشاء الفاتورة' });
    }
};

// 🔹 جلب جميع عمليات البيع
const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find({}).populate('products.productId', 'name price');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء جلب المبيعات' });
    }
};

// 🔹 جلب فاتورة معينة حسب ID
const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('products.productId', 'name price');
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: '⚠️ الفاتورة غير موجودة' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء جلب الفاتورة' });
    }
};

// 🔹 تحديث الفاتورة (مثل تغيير حالة الدفع)
const updateSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (sale) {
            sale.paymentMethod = req.body.paymentMethod || sale.paymentMethod;
            sale.totalAmount = req.body.totalAmount || sale.totalAmount;
            const updatedSale = await sale.save();
            res.json(updatedSale);
        } else {
            res.status(404).json({ message: '⚠️ الفاتورة غير موجودة' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء تحديث الفاتورة' });
    }
};

// 🔹 حذف فاتورة
const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (sale) {
            await sale.remove();
            res.json({ message: '✅ تم حذف الفاتورة بنجاح' });
        } else {
            res.status(404).json({ message: '⚠️ الفاتورة غير موجودة' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء حذف الفاتورة' });
    }
};

// 🔹 جلب تقارير المبيعات حسب التاريخ
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const sales = await Sale.find(query).populate('products.productId', 'name price');
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        res.json({ sales, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء جلب التقارير' });
    }
};

// 📤 تصدير الوظائف
module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    getSalesReport
};
