// صفحة الإعداداتimport React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem } from "@/components/ui/select";
import { Sun, Moon } from "lucide-react";

const SettingsPage = () => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "enabled"
    );
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [currency, setCurrency] = useState("IQD");
    const [notifications, setNotifications] = useState(true);
    const [role, setRole] = useState("user");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    // ✅ جلب بيانات المستخدم من السيرفر
    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/auth/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });
            setUserData({
                name: response.data.name,
                email: response.data.email,
            });
            setIsAdmin(response.data.role === "admin");
        } catch (error) {
            console.error("⚠️ خطأ أثناء جلب بيانات المستخدم:", error);
        }
    };

    // ✅ تحديث بيانات المستخدم
    const handleUpdateProfile = async () => {
        try {
            await axios.put("/api/auth/profile", userData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });
            alert("✅ تم تحديث بياناتك بنجاح!");
        } catch (error) {
            console.error("⚠️ خطأ أثناء تحديث البيانات:", error);
        }
    };

    // ✅ تبديل الوضع الليلي
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode", !darkMode);
        localStorage.setItem("darkMode", !darkMode ? "enabled" : "disabled");
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-6">⚙️ الإعدادات</h2>

            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* ✅ إعدادات الوضع الليلي */}
                    <div className="flex justify-between items-center">
                        <span>🌙 الوضع الليلي</span>
                        <Button variant="ghost" onClick={toggleDarkMode}>
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                    </div>

                    {/* ✅ اختيار العملة */}
                    <div>
                        <label className="block font-medium">💰 العملة الافتراضية</label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectItem value="IQD">دينار عراقي (IQD)</SelectItem>
                            <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                            <SelectItem value="EUR">يورو (EUR)</SelectItem>
                        </Select>
                    </div>

                    {/* ✅ الإشعارات */}
                    <div className="flex justify-between items-center">
                        <span>🔔 تفعيل الإشعارات</span>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                </CardContent>
            </Card>

            {/* ✅ إدارة الحساب الشخصي */}
            <h3 className="text-lg font-semibold mt-6">👤 إعدادات الحساب</h3>
            <Card>
                <CardContent className="p-4 space-y-4">
                    <Input
                        type="text"
                        placeholder="الاسم الكامل"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                    <Input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                    <Input
                        type="password"
                        placeholder="كلمة المرور الجديدة (اختياري)"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                    <Button onClick={handleUpdateProfile}>💾 حفظ التغييرات</Button>
                </CardContent>
            </Card>

            {/* ✅ تغيير صلاحيات المستخدم (للمدير فقط) */}
            {isAdmin && (
                <>
                    <h3 className="text-lg font-semibold mt-6">🛡️ إدارة صلاحيات المستخدمين</h3>
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <Input
                                type="email"
                                placeholder="📧 البريد الإلكتروني للمستخدم"
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <Select value={role} onValueChange={setRole}>
                                <SelectItem value="user">مستخدم عادي</SelectItem>
                                <SelectItem value="staff">موظف</SelectItem>
                                <SelectItem value="admin">مدير</SelectItem>
                            </Select>
                            <Button>🔄 تحديث صلاحيات المستخدم</Button>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default SettingsPage;
