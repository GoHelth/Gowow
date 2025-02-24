import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // ✅ استيراد ملف الأنماط
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ منع انهيار التطبيق عند حدوث أخطاء

// ✅ إنشاء الجذر الرئيسي
const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ تحميل التطبيق داخل `StrictMode` لالتقاط الأخطاء المحتملة
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </BrowserRouter>
    </React.StrictMode>
);
