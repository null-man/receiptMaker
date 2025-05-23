import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Calculator, Receipt } from "lucide-react";

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

interface ReceiptFormProps {
  formData: ReceiptData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onItemChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export default function ReceiptForm({
  formData,
  onInputChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onSubmit,
  subtotal,
  taxAmount,
  totalAmount,
}: ReceiptFormProps) {
  const handleCurrencyChange = (value: string) => {
    const syntheticEvent = {
      target: { name: 'currency', value }
    } as React.ChangeEvent<HTMLSelectElement>;
    onInputChange(syntheticEvent);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 商家信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            商家信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">餐厅名称 *</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={onInputChange}
                placeholder="请输入餐厅名称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantPhone">联系电话</Label>
              <Input
                id="restaurantPhone"
                name="restaurantPhone"
                value={formData.restaurantPhone}
                onChange={onInputChange}
                placeholder="请输入联系电话"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantAddress">地址</Label>
            <Input
              id="restaurantAddress"
              name="restaurantAddress"
              value={formData.restaurantAddress}
              onChange={onInputChange}
              placeholder="请输入餐厅地址"
            />
          </div>
        </CardContent>
      </Card>

      {/* 收据详情 */}
      <Card>
        <CardHeader>
          <CardTitle>收据详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiptDate">日期 *</Label>
              <Input
                type="date"
                id="receiptDate"
                name="receiptDate"
                value={formData.receiptDate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiptTime">时间 *</Label>
              <Input
                type="time"
                id="receiptTime"
                name="receiptTime"
                value={formData.receiptTime}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">货币</Label>
              <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择货币" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">美元 ($)</SelectItem>
                  <SelectItem value="€">欧元 (€)</SelectItem>
                  <SelectItem value="£">英镑 (£)</SelectItem>
                  <SelectItem value="RMB">人民币 (RMB)</SelectItem>
                  <SelectItem value="¥">日元 (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>项目列表</CardTitle>
            <Button type="button" onClick={onAddItem} size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              添加项目
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="项目名称"
                    name="name"
                    value={item.name}
                    onChange={(e) => onItemChange(index, e)}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="数量"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => onItemChange(index, e)}
                    min="0.01"
                    step="any"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="单价"
                    name="price"
                    value={item.price}
                    onChange={(e) => onItemChange(index, e)}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 金额计算 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            金额计算
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">小计</Label>
              <Input
                id="subtotal"
                value={`${formData.currency} ${subtotal.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">税率 (%)</Label>
              <Input
                type="number"
                id="taxRate"
                name="taxRate"
                value={formData.taxRate}
                onChange={onInputChange}
                step="0.1"
                min="0"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxAmount">税额</Label>
              <Input
                id="taxAmount"
                value={`${formData.currency} ${taxAmount.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipAmount">小费</Label>
              <Input
                type="number"
                id="tipAmount"
                name="tipAmount"
                value={formData.tipAmount}
                onChange={onInputChange}
                step="0.01"
                min="0"
                placeholder="0"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <span className="text-lg font-semibold">总计</span>
            <span className="text-2xl font-bold text-primary">
              {formData.currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 备注 */}
      <Card>
        <CardHeader>
          <CardTitle>备注信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder="例如：谢谢惠顾！欢迎下次光临。"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 提交按钮 */}
      <div className="flex justify-center">
        <Button type="submit" size="lg" className="w-full md:w-auto px-8">
          <Receipt className="mr-2 h-5 w-5" />
          生成收据
        </Button>
      </div>
    </form>
  );
} 