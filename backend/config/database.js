const mongoose = require('mongoose');
const dotenv = require('dotenv');

// تحميل المتغيرات البيئية
dotenv.config();

// 🛠️ إعداد الاتصال بقاعدة البيانات
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // إيقاف التشغيل عند الفشل
    }
};

// تصدير الاتصال بقاعدة البيانات
module.exports = connectDB;
