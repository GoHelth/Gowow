import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Trash, FilePlus } from "lucide-react";

const SalesPage = () => {
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, []);

    // ✅ جلب قائمة الفواتير من السيرفر
    const fetchSales = async () => {
        try {
            const response = await axios.get("/api/sales");
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error("⚠️ خطأ أثناء جلب الفواتير:", error);
            setLoading(false);
        }
    };

    // ✅ البحث عن فاتورة
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // ✅ حذف فاتورة
    const handleDelete = async (id) => {
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذه الفاتورة؟")) {
            try {
                await axios.delete(`/api/sales/${id}`);
                setSales(sales.filter((sale) => sale._id !== id));
            } catch (error) {
                console.error("⚠️ خطأ أثناء حذف الفاتورة:", error);
            }
        }
    };

    // ✅ تصفية الفواتير بناءً على البحث
    const filteredSales = sales.filter((sale) =>
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">🧾 إدارة المبيعات</h2>
                <Button className="flex items-center gap-2">
                    <FilePlus className="w-4 h-4" /> إضافة فاتورة جديدة
                </Button>
            </div>

            <Input 
                type="text" 
                placeholder="🔍 بحث عن فاتورة..." 
                value={searchTerm} 
                onChange={handleSearch} 
                className="mb-4"
            />

            {loading ? (
                <p className="text-center">⏳ تحميل البيانات...</p>
            ) : (
                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>🆔 رقم الفاتورة</TableCell>
                                    <TableCell>👤 اسم العميل</TableCell>
                                    <TableCell>💰 المبلغ الإجمالي</TableCell>
                                    <TableCell>🗓️ التاريخ</TableCell>
                                    <TableCell>⚙️ التحكم</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSales.length > 0 ? (
                                    filteredSales.map((sale) => (
                                        <TableRow key={sale._id}>
                                            <TableCell>{sale._id.substring(0, 8)}...</TableCell>
                                            <TableCell>{sale.customerName}</TableCell>
                                            <TableCell>{sale.totalAmount} دينار</TableCell>
                                            <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="destructive"
                                                    className="flex items-center gap-1"
                                                    onClick={() => handleDelete(sale._id)}
                                                >
                                                    <Trash className="w-4 h-4" /> حذف
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center">🚫 لا توجد فواتير</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SalesPage;
