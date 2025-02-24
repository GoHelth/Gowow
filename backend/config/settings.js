const settings = {
    appName: "Gowow Sales System",
    version: "1.0.0",
    maintenanceMode: false, // إذا كان `true`، سيظهر تنبيه بأن النظام تحت الصيانة
    enableSales: true, // تفعيل / تعطيل نظام المبيعات
    enableInventory: true, // تفعيل / تعطيل نظام المخزون
    enableReports: true, // تفعيل / تعطيل التقارير
    enableWhatsAppIntegration: false, // تفعيل / تعطيل تكامل WhatsApp
    enableGPS: false, // تفعيل / تعطيل تتبع GPS للمندوبين
    currency: "IQD", // العملة الافتراضية
    timezone: "Asia/Baghdad", // التوقيت الافتراضي
    dateFormat: "DD-MM-YYYY", // تنسيق التاريخ الافتراضي
    roles: { // تعريف صلاحيات المستخدمين
        admin: ["view_all", "edit_all", "delete_all"],
        sales: ["view_sales", "add_sales"],
        manager: ["view_reports", "edit_inventory"]
    },
    emailSettings: { // إعدادات البريد الإلكتروني للإشعارات
        smtpHost: "smtp.mailtrap.io",
        smtpPort: 587,
        smtpUser: "your_smtp_user",
        smtpPass: "your_smtp_password",
        fromEmail: "no-reply@gowow.com"
    },
    whatsappAPI: { // إعدادات تكامل WhatsApp
        enabled: false,
        apiKey: "your_whatsapp_api_key",
        senderNumber: "+964XXXXXXXXX"
    }
};

// تصدير الإعدادات لاستخدامها في باقي المشروع
module.exports = settings;
