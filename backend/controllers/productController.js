const Product = require('../models/Product');

// 🛠️ إنشاء منتج جديد
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        // التحقق من أن المنتج غير مكرر
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: '⚠️ هذا المنتج موجود بالفعل!' });
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء إنشاء المنتج' });
    }
};

// 🔹 جلب جميع المنتجات
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء جلب المنتجات' });
    }
};

// 🔹 جلب منتج واحد حسب ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: '⚠️ المنتج غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء جلب المنتج' });
    }
};

// 🔹 تحديث بيانات المنتج
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            product.price = req.body.price || product.price;
            product.stock = req.body.stock || product.stock;
            product.category = req.body.category || product.category;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: '⚠️ المنتج غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء تحديث المنتج' });
    }
};

// 🔹 حذف منتج
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.json({ message: '✅ تم حذف المنتج بنجاح' });
        } else {
            res.status(404).json({ message: '⚠️ المنتج غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء حذف المنتج' });
    }
};

// 🔹 البحث عن منتج حسب الاسم
const searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: 'i' } }
            : {};

        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء البحث عن المنتجات' });
    }
};

// 🔹 تقليل كمية المنتج عند عملية بيع
const reduceStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: '⚠️ المنتج غير موجود' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: '⚠️ الكمية غير كافية في المخزون' });
        }

        product.stock -= quantity;
        await product.save();

        res.json({ message: '✅ تم تحديث الكمية بنجاح', updatedStock: product.stock });
    } catch (error) {
        res.status(500).json({ message: '⚠️ حدث خطأ أثناء تحديث الكمية' });
    }
};

// 📤 تصدير الوظائف
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    reduceStock
};
