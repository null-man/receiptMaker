import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, Download } from "lucide-react";

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
            <p>收据编号: #{Date.now().toString().slice(-8)}</p>
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
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          下载 PDF
        </Button>
      </div>
    </div>
  );
} 