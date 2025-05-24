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
  paymentMethod: string;
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
  // Parse 12-hour time format (e.g., "11:07 AM") to component state
  const parseTime12Hour = (timeStr: string) => {
    if (!timeStr) return { hours: '12', minutes: '00', ampm: 'AM' };
    
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      return {
        hours: match[1].padStart(2, '0'),
        minutes: match[2],
        ampm: match[3].toUpperCase()
      };
    }
    
    // If format doesn't match, return default value
    return { hours: '12', minutes: '00', ampm: 'AM' };
  };

  // Initialize time state
  const initialTime = parseTime12Hour(formData.receiptTime);
  const [timeState, setTimeState] = useState(initialTime);

  // Update timeState when formData.receiptTime changes
  useEffect(() => {
    const parsedTime = parseTime12Hour(formData.receiptTime);
    setTimeState(parsedTime);
  }, [formData.receiptTime]);

  // Handle time changes
  const handleTimeChange = (field: 'hours' | 'minutes' | 'ampm', value: string) => {
    const newTimeState = { ...timeState, [field]: value };
    setTimeState(newTimeState);
    
    // Build 12-hour time string and update formData
    const timeString = `${newTimeState.hours}:${newTimeState.minutes} ${newTimeState.ampm}`;
    const syntheticEvent = {
      target: { name: 'receiptTime', value: timeString }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(syntheticEvent);
  };

  const handleCurrencyChange = (value: string) => {
    const syntheticEvent = {
      target: { name: 'currency', value }
    } as React.ChangeEvent<HTMLSelectElement>;
    onInputChange(syntheticEvent);
  };

  const handlePaymentMethodChange = (value: string) => {
    const syntheticEvent = {
      target: { name: 'paymentMethod', value }
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
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Business Name *</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={onInputChange}
                placeholder="Enter business name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantCity">City</Label>
              <Input
                id="restaurantCity"
                name="restaurantCity"
                value={formData.restaurantCity}
                onChange={onInputChange}
                placeholder="Enter city information"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantAddress">Address</Label>
              <Input
                id="restaurantAddress"
                name="restaurantAddress"
                value={formData.restaurantAddress}
                onChange={onInputChange}
                placeholder="Enter business address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantPhone">Phone</Label>
              <Input
                id="restaurantPhone"
                name="restaurantPhone"
                value={formData.restaurantPhone}
                onChange={onInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">US Dollar ($)</SelectItem>
                  <SelectItem value="€">Euro (€)</SelectItem>
                  <SelectItem value="£">British Pound (£)</SelectItem>
                  <SelectItem value="RMB">Chinese Yuan (RMB)</SelectItem>
                  <SelectItem value="¥">Japanese Yen (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 收据详情 */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiptDate">Date *</Label>
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
              <Label htmlFor="receiptTime">Time *</Label>
              <div className="flex gap-2">
                {/* Hour selection */}
                <Select value={timeState.hours} onValueChange={(value) => handleTimeChange('hours', value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = i + 1;
                      const hourStr = hour.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hourStr} value={hourStr}>
                          {hourStr}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                <span className="flex items-center">:</span>
                
                {/* Minute selection */}
                <Select value={timeState.minutes} onValueChange={(value) => handleTimeChange('minutes', value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => {
                      const minute = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                {/* AM/PM selection */}
                <Select value={timeState.ampm} onValueChange={(value) => handleTimeChange('ampm', value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Items</CardTitle>
            <Button type="button" onClick={onAddItem} size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Item name"
                    name="name"
                    value={item.name}
                    onChange={(e) => onItemChange(index, e)}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => onItemChange(index, e)}
                    min="0.01"
                    step="any"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Price"
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
            Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                value={`${formData.currency} ${subtotal.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
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
              <Label htmlFor="taxAmount">Tax Amount</Label>
              <Input
                id="taxAmount"
                value={`${formData.currency} ${taxAmount.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipAmount">Tip</Label>
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
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">💵 Cash</SelectItem>
                  <SelectItem value="card">💳 Card</SelectItem>
                  <SelectItem value="credit_card">💳 Credit Card</SelectItem>
                  <SelectItem value="debit_card">💳 Debit Card</SelectItem>
                  <SelectItem value="mobile_pay">📱 Mobile Pay</SelectItem>
                  <SelectItem value="wechat_pay">💚 WeChat Pay</SelectItem>
                  <SelectItem value="alipay">🔵 Alipay</SelectItem>
                  <SelectItem value="apple_pay">🍎 Apple Pay</SelectItem>
                  <SelectItem value="google_pay">🔍 Google Pay</SelectItem>
                  <SelectItem value="paypal">🅿️ PayPal</SelectItem>
                  <SelectItem value="check">📄 Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formData.currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 备注 */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder="e.g., Thank you for your business!"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 提交按钮 */}
      <div className="flex justify-center">
        <Button type="submit" size="lg" className="w-full md:w-auto px-8">
          <Receipt className="mr-2 h-5 w-5" />
          Generate Receipt
        </Button>
      </div>
    </form>
  );
}
