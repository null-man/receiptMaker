import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
  restaurantCity: string;
  restaurantAddress: string;
  restaurantPhone: string;
  receiptDate: string;
  receiptTime: string;
  currency: string;
  items: ReceiptItem[];
  taxRate: number;
  tipAmount: number;
  notes: string;
  paymentMethod: string;
}

interface ReceiptPreviewProps {
  data: ReceiptData;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
  onPrint: () => void;
  type?: string;
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
  type = 'default',
}: ReceiptPreviewProps) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState<string>("");

  const {
    restaurantName,
    restaurantCity,
    restaurantAddress,
    restaurantPhone,
    receiptDate,
    receiptTime,
    currency,
    items,
    taxRate,
    notes,
    paymentMethod,
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
      console.log('PDF Canvas data URL:', imgData.substring(0, 50), '...', 'Length:', imgData.length);
      
      if (!imgData || imgData === "data:," || imgData.length < 100) {
        throw new Error("生成的图片数据无效");
      }
      
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
      const fileName = `receipt_${receiptDate.replace(/-/g, '')}.pdf`;
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

      // 创建下载链接 - 使用Blob方法更稳定
      canvas.toBlob((blob) => {
        try {
          if (!blob) {
            console.error("生成图片Blob失败");
            alert("生成图片失败，请重试");
            setIsSavingImage(false);
            return;
          }
          
          console.log('Generated blob:', blob.size, 'bytes');
          
          const url = URL.createObjectURL(blob);
          console.log('Created object URL:', url);
          
          const link = document.createElement("a");
          link.download = `receipt_${receiptDate.replace(/-/g, '')}.png`;
          link.href = url;
          link.style.cssText = 'position: absolute; left: -9999px; visibility: hidden;';
          link.rel = 'noopener';
          link.target = '_self';
          link.id = 'download-link-' + Date.now();
          
          // 触发下载
          document.body.appendChild(link);
          console.log('Clicking download link...');
          link.click();
          document.body.removeChild(link);
          
          // 清理URL对象
          setTimeout(() => {
            URL.revokeObjectURL(url);
            console.log('Revoked object URL');
          }, 1000);
          
          setIsSavingImage(false);
        } catch (blobError) {
          console.error("Blob处理失败:", blobError);
          alert("下载失败，请重试");
          setIsSavingImage(false);
        }
      }, "image/png", 1.0);
    } catch (error) {
      console.error("保存图片失败:", error);
      alert("保存图片失败，请重试");
      setIsSavingImage(false);
    }
  };

  // 根据收据类型设置样式
  const getReceiptStyles = () => {
    switch (type) {
      case 'thermal':
        return {
          card: "receipt-preview mx-auto max-w-xs bg-white shadow-lg",
          content: "p-3 font-mono text-xs leading-tight",
          title: "text-sm font-bold mb-1 tracking-wider uppercase",
          address: "text-xs leading-tight",
          spacing: "my-1"
        };
      case 'pos':
        return {
          card: "receipt-preview mx-auto max-w-sm bg-white shadow-lg",
          content: "p-4 font-mono text-xs",
          title: "text-base font-bold mb-2 tracking-wide uppercase",
          address: "text-xs",
          spacing: "my-2"
        };
      case 'restaurant':
        return {
          card: "receipt-preview mx-auto max-w-md bg-white shadow-lg border-2",
          content: "p-6 font-serif text-sm",
          title: "text-xl font-bold mb-3 tracking-wide",
          address: "text-sm italic",
          spacing: "my-3"
        };
      case 'coffee':
        return {
          card: "receipt-preview mx-auto max-w-xs bg-amber-50 shadow-lg",
          content: "p-4 font-mono text-xs",
          title: "text-sm font-bold mb-2 tracking-wide",
          address: "text-xs",
          spacing: "my-2"
        };
      case 'gas':
        return {
          card: "receipt-preview mx-auto max-w-xs bg-gray-50 shadow-lg",
          content: "p-3 font-mono text-xs",
          title: "text-sm font-bold mb-1 tracking-wider uppercase",
          address: "text-xs",
          spacing: "my-1"
        };
      case 'grocery':
        return {
          card: "receipt-preview mx-auto max-w-sm bg-green-50 shadow-lg",
          content: "p-4 font-mono text-xs",
          title: "text-base font-bold mb-2 tracking-wide uppercase",
          address: "text-xs",
          spacing: "my-2"
        };
      case 'pharmacy':
        return {
          card: "receipt-preview mx-auto max-w-sm bg-blue-50 shadow-lg",
          content: "p-4 font-mono text-xs",
          title: "text-base font-bold mb-2 tracking-wide uppercase",
          address: "text-xs",
          spacing: "my-2"
        };
      case 'pos_terminal':
        return {
          card: "receipt-preview mx-auto bg-white shadow-lg border pos-receipt-container",
          content: "p-1 font-mono text-xs leading-none",
          title: "text-xs font-bold mb-1 tracking-wider text-center",
          address: "text-xs text-center",
          spacing: "my-0"
        };
      default:
        return {
          card: "receipt-preview mx-auto max-w-md bg-white shadow-lg",
          content: "p-8 font-mono text-sm",
          title: "text-xl font-bold mb-2 tracking-wider",
          address: "text-sm",
          spacing: "my-4"
        };
    }
  };

  const styles = getReceiptStyles();

  return (
    <div id="receiptOutputContainer" className="space-y-6">
      {/* 收据预览 */}
      <Card className={`${styles.card} receipt-preview`}>
        <CardContent className={styles.content}>
          {type === 'pos_terminal' ? (
            /* POS机收据特殊布局 - 完全匹配用户图片 */
            <div className="text-left pos-terminal-font leading-none" style={{
              textTransform: 'uppercase'
            }}>
              {/* 餐厅信息 */}
              <div className="space-y-0">
                <div>{restaurantName.toUpperCase() || "YOUR RESTAURANT"}</div>
                {restaurantCity && (
                  <div>{restaurantCity.toUpperCase()}</div>
                )}
                {restaurantAddress && (
                  <div>{restaurantAddress.toUpperCase()}</div>
                )}
                {restaurantPhone && (
                  <div>{restaurantPhone}</div>
                )}
              </div>
              
              <div className="mb-1"></div>
              
              {/* SALE 信息 */}
              <div className="text-left space-y-0 mb-0 mt-1">
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SALE</div>
                <div>{receiptDate.replace(/-/g, '/')}    {receiptTime}</div>
                <div>BATCH #:0DE85</div>
                <div>APPR #:A359A</div>
                <div>TRACE #: 9</div>
              </div>

              <div className="text-left space-y-0 mb-0 mt-1">
                <div>{paymentMethod}</div>
              </div>
              
              {/* 商品信息 */}
              <div className="space-y-0 mb-0 mt-1">
                {items.length > 0 ? (
                  <>
                    {items.map((item, index) => (
                      <div key={index} style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <span>{item.qty}</span>
                        <span>{item.name.toUpperCase()}</span>
                        <span>{formatCurrency(((parseFloat(item.price.toString()) || 0) * (parseFloat(item.qty.toString()) || 0)).toString(), currency)}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div>kkkkk</div>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                      <span>1 1</span>
                      <span>$1.00</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mb-1"></div>
              
              {/* 金额部分 */}
              <div className="space-y-0 mb-1 mt-4">
                <div>SUBTOTAL:&nbsp;&nbsp;&nbsp;&nbsp;{formatCurrency(subtotal, currency)}</div>
                <div>TAX:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatCurrency(taxAmount, currency)}</div>
                <div>TOTAL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatCurrency(totalAmount, currency)}</div>
              </div>
              
              <div className="mb-1"></div>
              
              <div className="space-y-0 mb-1 mt-3">
                <div>TIP: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {formatCurrency(data.tipAmount.toString(), currency)}</div>
                <div>&nbsp;</div>
                <div>TOTAL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {formatCurrency((parseFloat(totalAmount) + parseFloat(data.tipAmount.toString())).toString(), currency)}</div>
              </div>
              
              <div className="mb-1"></div>
              
              {/* 底部信息 */}
              <div className="text-center space-y-0 mt-8">
                <div>APPROVED</div>
                <div>THANK YOU</div>
                <div>CUSTOMER COPY</div>
              </div>
            </div>
          ) : (
            <>
              {/* 餐厅信息 */}
              <div className={`text-center ${styles.spacing}`}>
                <h3 className={styles.title}>
                  {restaurantName || "YOUR RESTAURANT NAME"}
                </h3>
                {restaurantCity && (
                  <div className={`${styles.address} text-muted-foreground mb-1`}>
                    {restaurantCity}
                  </div>
                )}
                {restaurantAddress && (
                  <div className={`${styles.address} text-muted-foreground mb-1`}>
                    {restaurantAddress}
                  </div>
                )}
                {restaurantPhone && (
                  <p className={`${styles.address} text-muted-foreground`}>{restaurantPhone}</p>
                )}
              </div>

          <Separator className={styles.spacing} />

          {/* 日期时间 */}
          <div className={`flex justify-between ${type === 'thermal' || type === 'gas' ? 'text-xs' : 'text-xs'} ${styles.spacing}`}>
            <span>{type === 'thermal' || type === 'pos' || type === 'gas' ? receiptDate.replace(/-/g, '/') : `Date: ${receiptDate}`}</span>
            <span>{type === 'thermal' || type === 'pos' || type === 'gas' ? receiptTime : `Time: ${receiptTime}`}</span>
          </div>

          <Separator className={styles.spacing} />

          {/* 项目标题 */}
          {type !== 'thermal' && type !== 'gas' && type !== 'restaurant' && type !== 'pos_terminal' && (
            <>
              <div className={`grid gap-2 font-semibold mb-2 ${type === 'restaurant' ? 'text-sm' : 'text-xs'}`} style={{gridTemplateColumns: 'minmax(0, 2fr) auto auto'}}>
                <span>{type === 'pos' || type === 'pharmacy' ? 'ITEM' : 'Item'}</span>
                <span className="text-right">{type === 'pos' || type === 'pharmacy' ? 'QTY' : 'Qty'}</span>
                <span className="text-right">{type === 'pos' || type === 'pharmacy' ? 'AMOUNT' : 'Amount'}</span>
              </div>
              <Separator className="my-1" />
            </>
          )}

          {/* 项目列表 */}
          <div className={`space-y-1 ${styles.spacing}`}>
            {items.map((item, index) => {
              const itemTotal = (parseFloat(item.qty.toString()) || 0) * (parseFloat(item.price.toString()) || 0);
              const qty = parseFloat(item.qty.toString()) || 0;
              
              if (type === 'pos_terminal') {
                // POS机收据样式渲染
                return (
                  <div key={item.id || index} className="text-xs">
                    <div className="flex justify-between">
                      <span className="truncate flex-1 pr-2 uppercase">{item.name || "ITEM"}</span>
                      <span>{formatCurrency(itemTotal.toFixed(2), currency)}</span>
                    </div>
                    {qty !== 1 && (
                      <div className="text-right text-xs opacity-75">
                        {qty} @ {formatCurrency(item.price.toString(), currency)}
                      </div>
                    )}
                  </div>
                );
              }
              
              if (type === 'thermal' || type === 'gas') {
                return (
                  <div key={item.id || index} className="text-xs">
                    <div className="flex justify-between">
                      <span className="truncate flex-1 pr-2 uppercase">{item.name || "ITEM"}</span>
                      <span>{formatCurrency(itemTotal.toString(), currency)}</span>
                    </div>
                    {qty !== 1 && (
                      <div className="text-right text-xs opacity-75">
                        {qty} @ {formatCurrency(item.price.toString(), currency)}
                      </div>
                    )}
                  </div>
                );
              }
              
              if (type === 'restaurant') {
                return (
                  <div key={item.id || index} className="flex justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <div className="font-medium">{item.name || "未命名项目"}</div>
                      {qty !== 1 && (
                        <div className="text-xs text-muted-foreground">Qty: {qty}</div>
                      )}
                    </div>
                    <span className="font-semibold">{formatCurrency(itemTotal.toString(), currency)}</span>
                  </div>
                );
              }
              
              return (
                <div key={item.id || index} className={`grid gap-2 ${type === 'restaurant' ? 'text-sm' : 'text-xs'}`} style={{gridTemplateColumns: 'minmax(0, 2fr) auto auto'}}>
                  <span className="break-words">{item.name || "Unnamed Item"}</span>
                  <span className="text-right">{qty}</span>
                  <span className="text-right">{formatCurrency(itemTotal.toString(), currency)}</span>
                </div>
              );
            })}
          </div>

          <Separator className={styles.spacing} />

          {/* 总计部分 */}
          <div className={`space-y-2 ${type === 'restaurant' ? 'text-sm' : 'text-xs'}`}>
            <div className="flex justify-between">
              <span>{type === 'pos' || type === 'thermal' || type === 'gas' || type === 'pharmacy' ? 'SUBTOTAL:' : 'Subtotal:'}</span>
              <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
            </div>
            
            {parseFloat(taxAmount) > 0 && (
              <div className="flex justify-between">
                <span>{type === 'pos' || type === 'thermal' || type === 'gas' || type === 'pharmacy' ? `TAX:` : `Tax (${taxRate}%):`}</span>
                <span className="font-semibold">{formatCurrency(taxAmount, currency)}</span>
              </div>
            )}
            
            {parseFloat(data.tipAmount.toString()) > 0 && (
              <div className="flex justify-between">
                <span>{type === 'pos' || type === 'thermal' || type === 'gas' || type === 'pharmacy' ? 'TIP:' : 'Tip:'}</span>
                <span className="font-semibold">{formatCurrency(data.tipAmount.toString(), currency)}</span>
              </div>    
            )}

            <Separator className="my-2" />

            <div className={`flex justify-between font-bold ${type === 'restaurant' ? 'text-lg' : type === 'thermal' || type === 'gas' ? 'text-sm' : 'text-base'}`}>
              <span>{type === 'pos' || type === 'thermal' || type === 'gas' || type === 'pharmacy' ? 'TOTAL:' : 'Total:'}</span>
              <span className={type === 'restaurant' ? 'text-primary' : ''}>{formatCurrency(totalAmount, currency)}</span>
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
                Thank you for your business!
              </div>
            </>
          )}
              
              {/* 收据底部信息 - 仅非POS机收据显示 */}
              {type !== 'pos_terminal' && (
                <div className="text-center text-xs text-muted-foreground mt-6 pt-4 border-t border-dashed">
                  {/* <p>Receipt Number: #{receiptNumber || "--------"}</p> */}
                  {/* <p className="mt-1">ReceiptMaker Generated</p> */}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
        <Button onClick={onPrint} size="lg" className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Print
        </Button>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownloadPDF();
          }} 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          disabled={isDownloadingPDF}
          type="button"
        >
          {isDownloadingPDF ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {isDownloadingPDF ? "Generating..." : "Download PDF"}
        </Button>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSaveAsImage();
          }} 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          disabled={isSavingImage}
          type="button"
        >
          {isSavingImage ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image className="h-5 w-5" />
          )}
          {isSavingImage ? "Saving..." : "Save Image"}
        </Button>
      </div>
    </div>
  );
} 