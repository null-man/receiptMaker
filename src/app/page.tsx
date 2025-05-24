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
    thermal: {
      name: "🧾 热敏纸收据",
      data: {
        restaurantName: "McDONALD'S #2847",
        restaurantAddress: "1234 BROADWAY ST\nNEW YORK NY 10001",
        restaurantPhone: "",
        receiptDate: "2024-01-15",
        receiptTime: "11:47",
        currency: "USD",
        items: [
          { id: 1, name: "BIG MAC", qty: 1, price: 5.69 },
          { id: 2, name: "MEDIUM FRIES", qty: 1, price: 2.79 },
          { id: 3, name: "COCA-COLA MEDIUM", qty: 1, price: 1.99 },
        ],
        taxRate: 8.25,
        tipAmount: 0,
        notes: "ORDER #: 127\nCASHIER: MIKE\nTHANK YOU!",
      },
    },
    pos: {
      name: "🏪 POS零售收据",
      data: {
        restaurantName: "TARGET T-1847",
        restaurantAddress: "2500 CENTRAL AVE\nST PAUL MN 55108",
        restaurantPhone: "(651) 555-0199",
        receiptDate: "2024-01-15",
        receiptTime: "16:23",
        currency: "USD",
        items: [
          { id: 1, name: "IPHONE CHARGER", qty: 1, price: 19.99 },
          { id: 2, name: "NOTEBOOK 3-PACK", qty: 1, price: 7.49 },
          { id: 3, name: "ENERGY DRINK", qty: 2, price: 2.99 },
        ],
        taxRate: 7.125,
        tipAmount: 0,
        notes: "REF# 0127-2847-9903-8811\nREWARDS MEMBER\nSAVED: $3.47",
      },
    },
    restaurant: {
      name: "🍽️ 餐厅账单",
      data: {
        restaurantName: "The Olive Garden",
        restaurantAddress: "123 Italian Way, Boston MA 02101",
        restaurantPhone: "(617) 555-OLIVE",
        receiptDate: "2024-01-15",
        receiptTime: "19:30",
        currency: "USD",
        items: [
          { id: 1, name: "Chicken Parmigiana", qty: 1, price: 18.99 },
          { id: 2, name: "Caesar Salad", qty: 1, price: 8.99 },
          { id: 3, name: "Breadsticks (Unlimited)", qty: 1, price: 0.00 },
          { id: 4, name: "Iced Tea", qty: 2, price: 2.99 },
        ],
        taxRate: 6.25,
        tipAmount: 6.50,
        notes: "Server: Maria\nTable: 12\nGuests: 2\nThank you for dining with us!",
      },
    },
    coffee: {
      name: "☕ 咖啡店收据",
      data: {
        restaurantName: "Starbucks Coffee",
        restaurantAddress: "456 Pike Place\nSeattle WA 98101",
        restaurantPhone: "",
        receiptDate: "2024-01-15",
        receiptTime: "08:15",
        currency: "USD",
        items: [
          { id: 1, name: "Grande Caffe Latte", qty: 1, price: 5.45 },
          { id: 2, name: "Blueberry Muffin", qty: 1, price: 3.25 },
          { id: 3, name: "Extra Shot", qty: 1, price: 0.75 },
        ],
        taxRate: 10.1,
        tipAmount: 1.00,
        notes: "Store #0847\nBarista: Alex\n☕ Have a great day!",
      },
    },
    gas: {
      name: "⛽ 加油站收据",
      data: {
        restaurantName: "SHELL STATION #4821",
        restaurantAddress: "7890 HIGHWAY 101\nLOS ANGELES CA 90028",
        restaurantPhone: "",
        receiptDate: "2024-01-15",
        receiptTime: "13:42",
        currency: "USD",
        items: [
          { id: 1, name: "UNLEADED 87 (12.5 GAL)", qty: 1, price: 45.75 },
          { id: 2, name: "ENERGY DRINK", qty: 1, price: 2.49 },
          { id: 3, name: "CHIPS", qty: 1, price: 1.99 },
        ],
        taxRate: 9.5,
        tipAmount: 0,
        notes: "PUMP #03\nCARD: ****1234\nODOMETER: 85,247",
      },
    },
    grocery: {
      name: "🛒 高端超市收据",
      data: {
        restaurantName: "WHOLE FOODS MARKET",
        restaurantAddress: "555 UNION SQUARE\nSAN FRANCISCO CA 94108",
        restaurantPhone: "(415) 555-FOOD",
        receiptDate: "2024-01-15",
        receiptTime: "17:28",
        currency: "USD",
        items: [
          { id: 1, name: "Organic Apples (2.3 lb)", qty: 1, price: 6.89 },
          { id: 2, name: "Almond Milk Unsweetened", qty: 1, price: 4.99 },
          { id: 3, name: "Quinoa Salad", qty: 1, price: 8.99 },
          { id: 4, name: "Kombucha GT's", qty: 1, price: 3.99 },
        ],
        taxRate: 8.75,
        tipAmount: 0,
        notes: "MEMBER SAVINGS: $2.47\nCASHIER: SARAH\nBAG CREDIT: $0.10",
      },
    },
    pharmacy: {
      name: "💊 药店收据",
      data: {
        restaurantName: "CVS PHARMACY #9847",
        restaurantAddress: "321 MAIN STREET\nCHICAGO IL 60601",
        restaurantPhone: "(312) 555-CVS1",
        receiptDate: "2024-01-15",
        receiptTime: "14:15",
        currency: "USD",
        items: [
          { id: 1, name: "TYLENOL EXTRA STRENGTH", qty: 1, price: 8.99 },
          { id: 2, name: "VITAMIN D3", qty: 1, price: 12.49 },
          { id: 3, name: "HAND SANITIZER", qty: 2, price: 3.99 },
        ],
        taxRate: 10.25,
        tipAmount: 0,
        notes: "ExtraCare Card Used\nSaved Today: $4.23\nCoupons Available: 3",
      },
    },
    pos_terminal: {
      name: "💳 POS机收据",
      data: {
        restaurantName: "2112\n212\n12",
        restaurantAddress: "",
        restaurantPhone: "",
        receiptDate: "2024-05-24",
        receiptTime: "11:07",
        currency: "USD",
        items: [
          { id: 1, name: "PURCHASE", qty: 1, price: 45.67 },
        ],
        taxRate: 0,
        tipAmount: 0,
        notes: "SALE\nBATCH #:06B2D\nAPPR #:C8910\nTRACE #: 9\n\nAPPROVED\nTHANK YOU\nCUSTOMER COPY",
      },
    },
    chinese: {
      name: "🥢 中式餐厅",
      data: {
        restaurantName: "川香阁",
        restaurantAddress: "北京市朝阳区三里屯路12号",
        restaurantPhone: "(010) 8765-4321",
        receiptDate: "2024-01-15",
        receiptTime: "19:30",
        currency: "RMB",
        items: [
          { id: 1, name: "宫保鸡丁", qty: 1, price: 28 },
          { id: 2, name: "麻婆豆腐", qty: 1, price: 18 },
          { id: 3, name: "白米饭", qty: 2, price: 3 },
        ],
        taxRate: 6,
        tipAmount: 5,
        notes: "谢谢光临，欢迎下次再来！",
      },
    },
  };

  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('thermal');

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
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);

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
    // 用户开始修改数据时，退出模板模式
    setIsUsingTemplate(false);
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
    // 用户开始修改项目时，退出模板模式
    setIsUsingTemplate(false);
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
    // 设置正在使用模板
    setIsUsingTemplate(true);
    // 隐藏模板选择器
    setShowTemplateSelector(false);
    // 滚动到页面顶部，确保重选模板按钮可见
    setTimeout(() => {
      window.scrollTo({
        top: 200,
        behavior: "smooth"
      });
    }, 100);
  };

  // 清空表单
  const clearForm = () => {
    setReceiptData({
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
    setNextItemId(2);
    setShowTemplateSelector(false);
    setIsUsingTemplate(false);
    // 重新初始化日期时间
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    
    setTimeout(() => {
      setReceiptData(prev => ({
        ...prev,
        receiptDate: `${YYYY}-${MM}-${DD}`,
        receiptTime: `${hh}:${mm}`,
      }));
    }, 0);
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {receiptData.restaurantName ? "实时预览" : "示例预览"}
                      </CardTitle>
                      <CardDescription>
                        {receiptData.restaurantName 
                          ? "您的收据实时预览，填写左侧表单查看变化" 
                          : "选择下方模板查看不同风格效果"}
                      </CardDescription>
                    </div>
                    {receiptData.restaurantName && !showTemplateSelector && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowTemplateSelector(true);
                          // 滚动到模板选择区域
                          setTimeout(() => {
                            const templateElement = document.getElementById("template-selector");
                            if (templateElement) {
                              // 获取元素顶部位置，减去一些偏移量确保标题完全可见
                              const elementTop = templateElement.offsetTop - 100;
                              window.scrollTo({
                                top: elementTop,
                                behavior: "smooth"
                              });
                            }
                          }, 100);
                        }}
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        🔄 重选模板
                      </Button>
                    )}
                    {!receiptData.restaurantName && !showTemplateSelector && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const templateElement = document.getElementById("template-selector");
                          if (templateElement) {
                            // 获取元素顶部位置，减去一些偏移量确保标题完全可见
                            const elementTop = templateElement.offsetTop - 100;
                            window.scrollTo({
                              top: elementTop,
                              behavior: "smooth"
                            });
                          }
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        👇 查看更多模板
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ReceiptPreview
                    data={receiptData.restaurantName ? receiptData : templates[selectedTemplate].data}
                    subtotal={receiptData.restaurantName ? subtotal.toFixed(2) : calculateTemplateSubtotal(templates[selectedTemplate].data).toFixed(2)}
                    taxAmount={receiptData.restaurantName ? taxAmount.toFixed(2) : calculateTemplateTax(templates[selectedTemplate].data).toFixed(2)}
                    totalAmount={receiptData.restaurantName ? totalAmount.toFixed(2) : calculateTemplateTotal(templates[selectedTemplate].data).toFixed(2)}
                    onPrint={handlePrint}
                    type={isUsingTemplate ? selectedTemplate : (receiptData.restaurantName && receiptData.restaurantName !== templates[selectedTemplate].data.restaurantName ? 'default' : selectedTemplate)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 模板选择区域 */}
          {(!receiptData.restaurantName || showTemplateSelector) && (
            <Card id="template-selector" className="max-w-7xl mx-auto mt-12">
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
                <div className="flex justify-center gap-4 flex-wrap">
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
                      clearForm();
                      const formElement = document.querySelector('.form-container');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    从空白开始
                  </Button>
                  {receiptData.restaurantName && (
                    <Button 
                      variant="ghost"
                      size="lg"
                      onClick={() => setShowTemplateSelector(false)}
                    >
                      取消选择
                    </Button>
                  )}
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