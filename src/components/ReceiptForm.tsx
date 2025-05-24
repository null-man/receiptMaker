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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');
  
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
            {t('form.businessInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">{t('form.businessName')} {t('form.required')}</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={onInputChange}
                placeholder={t('form.businessNamePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantCity">{t('form.city')}</Label>
              <Input
                id="restaurantCity"
                name="restaurantCity"
                value={formData.restaurantCity}
                onChange={onInputChange}
                placeholder={t('form.cityPlaceholder')}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantAddress">{t('form.address')}</Label>
              <Input
                id="restaurantAddress"
                name="restaurantAddress"
                value={formData.restaurantAddress}
                onChange={onInputChange}
                placeholder={t('form.addressPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantPhone">{t('form.phone')}</Label>
              <Input
                id="restaurantPhone"
                name="restaurantPhone"
                value={formData.restaurantPhone}
                onChange={onInputChange}
                placeholder={t('form.phonePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{t('form.currency')}</Label>
              <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.currencyPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">{t('currencies.usd')}</SelectItem>
                  <SelectItem value="€">{t('currencies.eur')}</SelectItem>
                  <SelectItem value="£">{t('currencies.gbp')}</SelectItem>
                  <SelectItem value="RMB">{t('currencies.cny')}</SelectItem>
                  <SelectItem value="¥">{t('currencies.jpy')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 收据详情 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('form.receiptDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiptDate">{t('form.date')} {t('form.required')}</Label>
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
              <Label htmlFor="receiptTime">{t('form.time')} {t('form.required')}</Label>
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
            <CardTitle>{t('form.items')}</CardTitle>
            <Button type="button" onClick={onAddItem} size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {t('form.addItem')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder={t('form.itemName')}
                    name="name"
                    value={item.name}
                    onChange={(e) => onItemChange(index, e)}
                    required
                  />
                  <Input
                    type="number"
                    placeholder={t('form.quantity')}
                    name="qty"
                    value={item.qty}
                    onChange={(e) => onItemChange(index, e)}
                    min="0.01"
                    step="any"
                    required
                  />
                  <Input
                    type="number"
                    placeholder={t('form.price')}
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
            {t('form.calculation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">{t('form.subtotal')}</Label>
              <Input
                id="subtotal"
                value={`${formData.currency} ${subtotal.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">{t('form.taxRate')}</Label>
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
              <Label htmlFor="taxAmount">{t('form.taxAmount')}</Label>
              <Input
                id="taxAmount"
                value={`${formData.currency} ${taxAmount.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipAmount">{t('form.tip')}</Label>
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
              <Label htmlFor="paymentMethod">{t('form.paymentMethod')}</Label>
              <Select value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.paymentMethodPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">💵 {t('paymentMethods.cash')}</SelectItem>
                  <SelectItem value="card">💳 {t('paymentMethods.card')}</SelectItem>
                  <SelectItem value="credit_card">💳 {t('paymentMethods.creditCard')}</SelectItem>
                  <SelectItem value="debit_card">💳 {t('paymentMethods.debitCard')}</SelectItem>
                  <SelectItem value="mobile_pay">📱 {t('paymentMethods.mobilePay')}</SelectItem>
                  <SelectItem value="wechat_pay">💚 {t('paymentMethods.wechatPay')}</SelectItem>
                  <SelectItem value="alipay">🔵 {t('paymentMethods.alipay')}</SelectItem>
                  <SelectItem value="apple_pay">🍎 {t('paymentMethods.applePay')}</SelectItem>
                  <SelectItem value="google_pay">🔍 {t('paymentMethods.googlePay')}</SelectItem>
                  <SelectItem value="paypal">🅿️ {t('paymentMethods.paypal')}</SelectItem>
                  <SelectItem value="check">📄 {t('paymentMethods.check')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <span className="text-lg font-semibold">{t('form.total')}</span>
            <span className="text-2xl font-bold text-primary">
              {formData.currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 备注 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('form.notes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">{t('form.additionalNotes')}</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder={t('form.notesPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 提交按钮 */}
      <div className="flex justify-center">
        <Button type="submit" size="lg" className="w-full md:w-auto px-8">
          <Receipt className="mr-2 h-5 w-5" />
          {t('form.generateReceipt')}
        </Button>
      </div>
    </form>
  );
}
