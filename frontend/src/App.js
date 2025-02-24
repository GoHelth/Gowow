import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InventoryPage from "./components/InventoryPage";
import SalesPage from "./components/SalesPage";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { getUserProfile } from "./services/api";

const App = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "enabled");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");

        // ✅ جلب بيانات المستخدم عند تحميل التطبيق
        const fetchUser = async () => {
            try {
                const userData = await getUserProfile();
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [darkMode]);

    // ✅ تبديل الوضع الليلي
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // ✅ حماية المسارات الخاصة (للمستخدمين المسجلين فقط)
    const ProtectedRoute = ({ element }) => {
        if (loading) return <p className="text-center">⏳ جاري تحميل البيانات...</p>;
        return user ? element : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <div className="min-h-screen p-6">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/inventory" element={<ProtectedRoute element={<InventoryPage />} />} />
                    <Route path="/sales" element={<ProtectedRoute element={<SalesPage />} />} />
                    <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
                    <Route path="*" element={<p className="text-center text-red-500">🚫 الصفحة غير موجودة!</p>} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
