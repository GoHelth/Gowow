import axios from "axios";

// ✅ إعداد `axios` مع `baseURL`
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ إرسال `JWT Token` تلقائيًا مع كل طلب
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ التعامل مع الأخطاء العامة
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("⚠️ خطأ في الاستجابة:", error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

// ✅ استدعاء API لتسجيل الدخول
export const loginUser = async (userData) => {
    try {
        const response = await API.post("/auth/login", userData);
        if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ حدث خطأ أثناء تسجيل الدخول";
    }
};

// ✅ استدعاء API لتسجيل الخروج
export const logoutUser = () => {
    localStorage.removeItem("authToken");
};

// ✅ استدعاء API لجلب بيانات المستخدم
export const getUserProfile = async () => {
    try {
        const response = await API.get("/auth/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن جلب بيانات المستخدم";
    }
};

// ✅ استدعاء API لجلب جميع المنتجات
export const fetchProducts = async () => {
    try {
        const response = await API.get("/products");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن جلب المنتجات";
    }
};

// ✅ استدعاء API لإنشاء منتج جديد
export const createProduct = async (productData) => {
    try {
        const response = await API.post("/products/create", productData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن إنشاء المنتج";
    }
};

// ✅ استدعاء API لحذف منتج
export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن حذف المنتج";
    }
};

// ✅ استدعاء API لجلب جميع الفواتير
export const fetchSales = async () => {
    try {
        const response = await API.get("/sales");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن جلب الفواتير";
    }
};

// ✅ استدعاء API لإنشاء فاتورة جديدة
export const createSale = async (saleData) => {
    try {
        const response = await API.post("/sales/create", saleData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن إنشاء الفاتورة";
    }
};

// ✅ استدعاء API لحذف فاتورة
export const deleteSale = async (id) => {
    try {
        const response = await API.delete(`/sales/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "⚠️ لا يمكن حذف الفاتورة";
    }
};

export default API;
