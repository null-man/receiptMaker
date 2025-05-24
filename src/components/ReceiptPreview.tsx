import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, Image, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";

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

interface ReceiptPreviewProps {
  data: ReceiptData;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
  onPrint: () => void;
}

function formatCurrency(amount: string, symbol: string): string {
  return `${symbol} ${parseFloat(amount).toFixed(2)}`;
}

export default function ReceiptPreview({
  data,
  subtotal,
  taxAmount,
  totalAmount,
  onPrint,
}: ReceiptPreviewProps) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState<string>("");

  const {
    restaurantName,
    restaurantAddress,
    restaurantPhone,
    receiptDate,
    receiptTime,
    currency,
    items,
    taxRate,
    notes,
  } = data;

  // 避免水合错误，在客户端生成收据编号
  useEffect(() => {
    setReceiptNumber(Date.now().toString().slice(-8));
  }, []);

  // 下载PDF功能
  const handleDownloadPDF = async () => {
    if (isDownloadingPDF) return;
    
    setIsDownloadingPDF(true);
    try {
      const element = document.querySelector(".receipt-preview") as HTMLElement;
      if (!element) {
        throw new Error("找不到收据元素");
      }

      // 临时添加样式以优化截图
      element.classList.add("receipt-capture");

      // 创建canvas
      const canvas = await html2canvas(element, {
        scale: 3, // 提高分辨率
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // 移除临时样式
      element.classList.remove("receipt-capture");

      // 创建PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 计算图片在PDF中的尺寸
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // 设置合适的尺寸比例
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = 20;

      pdf.addImage(imgData, "PNG", imgX, imgY, finalWidth, finalHeight);
      
      // 下载PDF
      const fileName = `收据_${restaurantName || "餐厅"}_${receiptDate.replace(/-/g, '')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("生成PDF失败:", error);
      alert("生成PDF失败，请重试");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // 保存为图片功能
  const handleSaveAsImage = async () => {
    if (isSavingImage) return;
    
    setIsSavingImage(true);
    try {
      const element = document.querySelector(".receipt-preview") as HTMLElement;
      if (!element) {
        throw new Error("找不到收据元素");
      }

      // 临时添加样式以优化截图
      element.classList.add("receipt-capture");

      // 创建canvas
      const canvas = await html2canvas(element, {
        scale: 3, // 提高分辨率
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // 移除临时样式
      element.classList.remove("receipt-capture");

      // 创建下载链接
      const link = document.createElement("a");
      link.download = `收据_${restaurantName || "餐厅"}_${receiptDate.replace(/-/g, '')}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("保存图片失败:", error);
      alert("保存图片失败，请重试");
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div id="receiptOutputContainer" className="space-y-6">
      {/* 收据预览 */}
      <Card className="receipt-preview mx-auto max-w-md bg-white shadow-lg">
        <CardContent className="p-8 font-mono text-sm">
          {/* 餐厅信息 */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2 tracking-wider">
              {restaurantName || "您的餐厅名称"}
            </h3>
            {restaurantAddress && (
              <p className="text-muted-foreground mb-1">{restaurantAddress}</p>
            )}
            {restaurantPhone && (
              <p className="text-muted-foreground">{restaurantPhone}</p>
            )}
          </div>

          <Separator className="my-4" />

          {/* 日期时间 */}
          <div className="flex justify-between text-xs mb-4">
            <span>日期: {receiptDate}</span>
            <span>时间: {receiptTime}</span>
          </div>

          <Separator className="my-4" />

          {/* 项目标题 */}
          <div className="grid grid-cols-3 gap-2 font-semibold mb-2 text-xs">
            <span>项目</span>
            <span className="text-right">数量</span>
            <span className="text-right">金额</span>
          </div>

          <Separator className="my-2" />

          {/* 项目列表 */}
          <div className="space-y-1 mb-4">
            {items.map((item, index) => {
              const itemTotal = (parseFloat(item.qty.toString()) || 0) * (parseFloat(item.price.toString()) || 0);
              return (
                <div key={item.id || index} className="grid grid-cols-3 gap-2 text-xs">
                  <span className="truncate">{item.name || "未命名项目"}</span>
                  <span className="text-right">{parseFloat(item.qty.toString()) || 0}</span>
                  <span className="text-right">{itemTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* 总计部分 */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>小计:</span>
              <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
            </div>
            
            {parseFloat(taxAmount) > 0 && (
              <div className="flex justify-between">
                <span>税额 ({taxRate}%):</span>
                <span className="font-semibold">{formatCurrency(taxAmount, currency)}</span>
              </div>
            )}
            
            {parseFloat(data.tipAmount.toString()) > 0 && (
              <div className="flex justify-between">
                <span>小费:</span>
                <span className="font-semibold">{formatCurrency(data.tipAmount.toString(), currency)}</span>
              </div>
            )}

            <Separator className="my-3" />

            <div className="flex justify-between text-base font-bold">
              <span>总计:</span>
              <span className="text-primary">{formatCurrency(totalAmount, currency)}</span>
            </div>
          </div>

          {/* 备注 */}
          {notes && (
            <>
              <Separator className="my-4" />
              <div className="text-center text-xs italic text-muted-foreground">
                {notes.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </>
          )}

          {!notes && (
            <>
              <Separator className="my-4" />
              <div className="text-center text-xs italic text-muted-foreground">
                谢谢惠顾！
              </div>
            </>
          )}

          {/* 收据底部信息 */}
          <div className="text-center text-xs text-muted-foreground mt-6 pt-4 border-t border-dashed">
            <p>收据编号: #{receiptNumber || "--------"}</p>
            <p className="mt-1">ReceiptMaker 生成</p>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
        <Button onClick={onPrint} size="lg" className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          打印收据
        </Button>
        <Button 
          onClick={handleDownloadPDF} 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          disabled={isDownloadingPDF}
        >
          {isDownloadingPDF ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {isDownloadingPDF ? "生成中..." : "下载 PDF"}
        </Button>
        <Button 
          onClick={handleSaveAsImage} 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          disabled={isSavingImage}
        >
          {isSavingImage ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image className="h-5 w-5" />
          )}
          {isSavingImage ? "保存中..." : "保存图片"}
        </Button>
      </div>
    </div>
  );
} 