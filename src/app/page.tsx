"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReceiptForm from "@/components/ReceiptForm";
import ReceiptPreview from "@/components/ReceiptPreview";

interface ReceiptItem {
  id: number;
  name: string;
  qty: number;
  price: number | string;
}

interface ReceiptData {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  receiptDate: string;
  receiptTime: string;
  currency: string;
  items: ReceiptItem[];
  taxRate: number;
  tipAmount: number;
  notes: string;
}

export default function HomePage() {
  const initialItem: ReceiptItem = { id: Date.now(), name: "", qty: 1, price: "" };
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    restaurantName: "",
    restaurantAddress: "",
    restaurantPhone: "",
    receiptDate: "",
    receiptTime: "",
    currency: "RMB",
    items: [initialItem],
    taxRate: 0,
    tipAmount: 0,
    notes: "",
  });
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    // 初始化日期和时间
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    setReceiptData((prevData) => ({
      ...prevData,
      receiptDate: `${YYYY}-${MM}-${DD}`,
      receiptTime: `${hh}:${mm}`,
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReceiptData((prevData) => ({
      ...prevData,
      [name]:
        (name === "taxRate" || name === "tipAmount") && value !== ""
          ? parseFloat(value)
          : value,
    }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newItems = [...receiptData.items];
    newItems[index] = {
      ...newItems[index],
      [name]:
        (name === "qty" || name === "price") && value !== ""
          ? parseFloat(value)
          : value,
    };
    setReceiptData((prevData) => ({ ...prevData, items: newItems }));
  };

  const addItem = () => {
    setReceiptData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { id: Date.now(), name: "", qty: 1, price: "" },
      ],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = receiptData.items.filter((_, i) => i !== index);
    setReceiptData((prevData) => ({
      ...prevData,
      items: newItems.length > 0 ? newItems : [initialItem],
    }));
  };

  const { subtotal, taxAmount, totalAmount } = useMemo(() => {
    const currentSubtotal = receiptData.items.reduce((sum, item) => {
      const qty = parseFloat(item.qty.toString()) || 0;
      const price = parseFloat(item.price.toString()) || 0;
      return sum + qty * price;
    }, 0);

    const currentTaxRate = parseFloat(receiptData.taxRate.toString()) || 0;
    const currentTaxAmount = (currentSubtotal * currentTaxRate) / 100;
    const currentTipAmount = parseFloat(receiptData.tipAmount.toString()) || 0;
    const currentTotalAmount =
      currentSubtotal + currentTaxAmount + currentTipAmount;

    return {
      subtotal: currentSubtotal,
      taxAmount: currentTaxAmount,
      totalAmount: currentTotalAmount,
    };
  }, [receiptData.items, receiptData.taxRate, receiptData.tipAmount]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 简单的表单验证示例
    if (!receiptData.restaurantName) {
      alert("请输入餐厅名称");
      return;
    }
    if (
      receiptData.items.some(
        (item) => !item.name || Number(item.qty) <= 0 || Number(item.price) <= 0
      )
    ) {
      alert("请确保所有项目都填写了有效的名称、数量和单价");
      return;
    }
    setShowPreview(true);
    // 滚动到预览区域
    setTimeout(() => {
      const previewElement = document.getElementById("receiptOutputContainer");
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ReceiptMaker
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">登录</Button>
            <Button size="sm">注册</Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              现代化收据生成器
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              简单易用的在线收据生成工具，支持多种货币和自定义样式，让您的业务更加专业。
            </p>
          </div>

          {/* Form Card */}
          <Card className="w-full max-w-4xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">创建收据</CardTitle>
              <CardDescription>
                填写下方信息生成专业的收据文档
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptForm
                formData={receiptData}
                onInputChange={handleInputChange}
                onItemChange={handleItemChange}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onSubmit={handleSubmit}
                subtotal={subtotal}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
              />
            </CardContent>
          </Card>

          {/* Preview Card */}
          {showPreview && (
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">收据预览</CardTitle>
                <CardDescription>
                  请检查收据信息，确认无误后可以打印
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReceiptPreview
                  data={receiptData}
                  subtotal={subtotal.toFixed(2)}
                  taxAmount={taxAmount.toFixed(2)}
                  totalAmount={totalAmount.toFixed(2)}
                  onPrint={handlePrint}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ReceiptMaker. 使用 Next.js 和 shadcn/ui 构建。
          </div>
        </div>
      </footer>
    </>
  );
}