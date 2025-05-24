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
  const initialItem: ReceiptItem = { id: 1, name: "", qty: 1, price: "" };
  
  // 模板数据
  const templates = {
    chinese: {
      name: "中式餐厅",
      data: {
        restaurantName: "美味餐厅",
        restaurantAddress: "北京市朝阳区建国门外大街1号",
        restaurantPhone: "010-12345678",
        receiptDate: "2024-05-23",
        receiptTime: "18:30",
        currency: "RMB",
        items: [
          { id: 1, name: "宫保鸡丁", qty: 1, price: 38 },
          { id: 2, name: "麻婆豆腐", qty: 1, price: 22 },
          { id: 3, name: "白米饭", qty: 2, price: 3 },
        ],
        taxRate: 10,
        tipAmount: 5,
        notes: "谢谢惠顾，欢迎下次光临！",
      }
    },
    american: {
      name: "美式超市",
      data: {
        restaurantName: "FreshMart Grocery",
        restaurantAddress: "123 Main Street, New York, NY 10001",
        restaurantPhone: "(555) 123-4567",
        receiptDate: "2024-05-23",
        receiptTime: "14:25",
        currency: "$",
        items: [
          { id: 1, name: "Organic Bananas", qty: 2, price: 1.99 },
          { id: 2, name: "Whole Milk (1 Gal)", qty: 1, price: 3.49 },
          { id: 3, name: "Bread - Whole Wheat", qty: 1, price: 2.79 },
          { id: 4, name: "Greek Yogurt", qty: 3, price: 1.25 },
        ],
        taxRate: 8.5,
        tipAmount: 0,
        notes: "Thank you for shopping with us!",
      }
    },
    european: {
      name: "欧式咖啡厅",
      data: {
        restaurantName: "Café de Paris",
        restaurantAddress: "15 Rue de Rivoli, 75001 Paris, France",
        restaurantPhone: "+33 1 42 97 48 75",
        receiptDate: "2024-05-23",
        receiptTime: "16:45",
        currency: "€",
        items: [
          { id: 1, name: "Espresso", qty: 2, price: 2.50 },
          { id: 2, name: "Croissant", qty: 1, price: 3.20 },
          { id: 3, name: "Pain au Chocolat", qty: 1, price: 3.80 },
        ],
        taxRate: 20,
        tipAmount: 2.00,
        notes: "Merci de votre visite! À bientôt!",
      }
    },
    fastfood: {
      name: "快餐店",
      data: {
        restaurantName: "Burger Palace",
        restaurantAddress: "456 Food Court Blvd, Los Angeles, CA 90210",
        restaurantPhone: "(310) 555-0123",
        receiptDate: "2024-05-23",
        receiptTime: "12:30",
        currency: "$",
        items: [
          { id: 1, name: "Classic Cheeseburger", qty: 1, price: 8.99 },
          { id: 2, name: "French Fries (Large)", qty: 1, price: 3.49 },
          { id: 3, name: "Coca-Cola (Medium)", qty: 1, price: 2.29 },
        ],
        taxRate: 9.5,
        tipAmount: 1.50,
        notes: "Have a great day! Visit us again!",
      }
    },
    hotel: {
      name: "酒店账单",
      data: {
        restaurantName: "Grand Hotel Restaurant",
        restaurantAddress: "789 Luxury Avenue, London, UK SW1A 1AA",
        restaurantPhone: "+44 20 7123 4567",
        receiptDate: "2024-05-23",
        receiptTime: "20:15",
        currency: "£",
        items: [
          { id: 1, name: "Grilled Salmon", qty: 1, price: 28.50 },
          { id: 2, name: "Caesar Salad", qty: 1, price: 12.00 },
          { id: 3, name: "Wine - Chardonnay", qty: 1, price: 45.00 },
          { id: 4, name: "Chocolate Dessert", qty: 1, price: 15.50 },
        ],
        taxRate: 12.5,
        tipAmount: 12.00,
        notes: "Thank you for dining with us this evening.",
      }
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('chinese');

  // 计算模板金额
  const calculateTemplateSubtotal = (templateData: ReceiptData) => {
    return templateData.items.reduce((sum, item) => {
      const qty = parseFloat(item.qty.toString()) || 0;
      const price = parseFloat(item.price.toString()) || 0;
      return sum + qty * price;
    }, 0);
  };

  const calculateTemplateTax = (templateData: ReceiptData) => {
    const subtotal = calculateTemplateSubtotal(templateData);
    return (subtotal * templateData.taxRate) / 100;
  };

  const calculateTemplateTotal = (templateData: ReceiptData) => {
    const subtotal = calculateTemplateSubtotal(templateData);
    const tax = calculateTemplateTax(templateData);
    return subtotal + tax + templateData.tipAmount;
  };

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
  
  const [nextItemId, setNextItemId] = useState(2);

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
        { id: nextItemId, name: "", qty: 1, price: "" },
      ],
    }));
    setNextItemId(nextItemId + 1);
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

  // 使用模板
  const useTemplate = (templateKey: keyof typeof templates) => {
    const template = templates[templateKey];
    setReceiptData(template.data);
    // 重置ID计数器
    setNextItemId(template.data.items.length + 1);
    // 滚动到表单顶部
    setTimeout(() => {
      const formElement = document.querySelector('.form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
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
            {/* <Button variant="ghost" size="sm">登录</Button>
            <Button size="sm">注册</Button> */}
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
              简单易用的在线收据生成工具，支持多种货币和自定义样式。左侧填写信息，右侧实时预览效果。
            </p>
          </div>

          {/* 表单和预览并排布局 */}
          <div className="grid xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* 左侧：表单 */}
            <div className="space-y-6">
              <Card className="form-container">
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
            </div>

            {/* 右侧：实时预览 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {receiptData.restaurantName ? "实时预览" : "示例预览"}
                  </CardTitle>
                  <CardDescription>
                    {receiptData.restaurantName 
                      ? "您的收据实时预览，填写左侧表单查看变化" 
                      : "选择下方模板查看不同风格效果"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReceiptPreview
                    data={receiptData.restaurantName ? receiptData : templates[selectedTemplate].data}
                    subtotal={receiptData.restaurantName ? subtotal.toFixed(2) : calculateTemplateSubtotal(templates[selectedTemplate].data).toFixed(2)}
                    taxAmount={receiptData.restaurantName ? taxAmount.toFixed(2) : calculateTemplateTax(templates[selectedTemplate].data).toFixed(2)}
                    totalAmount={receiptData.restaurantName ? totalAmount.toFixed(2) : calculateTemplateTotal(templates[selectedTemplate].data).toFixed(2)}
                    onPrint={handlePrint}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 模板选择区域 */}
          {!receiptData.restaurantName && (
            <Card className="max-w-7xl mx-auto mt-12">
              <CardHeader>
                <CardTitle className="text-2xl text-center">选择票据模板</CardTitle>
                <CardDescription className="text-center">
                  选择不同国家和场景的票据样式，快速了解各种收据格式
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {Object.entries(templates).map(([key, template]) => (
                    <Button
                      key={key}
                      variant={selectedTemplate === key ? "default" : "outline"}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setSelectedTemplate(key as keyof typeof templates)}
                    >
                      <span className="text-sm font-medium">{template.name}</span>
                      <span className="text-xs opacity-70">
                        {template.data.currency} {calculateTemplateTotal(template.data).toFixed(2)}
                      </span>
                    </Button>
                  ))}
                </div>
                
                {/* 模板操作按钮 */}
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => useTemplate(selectedTemplate)}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    使用 "{templates[selectedTemplate].name}" 模板
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const formElement = document.querySelector('.form-container');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    从空白开始
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ReceiptMaker
          </div>
        </div>
      </footer>
    </>
  );
}