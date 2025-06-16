
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TradeEntryFormProps {
  formData: {
    symbol: string;
    direction: string;
    quantity: string;
    entryPrice: string;
    exitPrice: string;
  };
  onInputChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const TradeEntryForm = ({ formData, onInputChange, errors }: TradeEntryFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol *</Label>
        <Input
          id="symbol"
          placeholder="e.g., AAPL, EURUSD"
          value={formData.symbol}
          onChange={(e) => onInputChange("symbol", e.target.value.toUpperCase())}
          className={errors?.symbol ? "border-red-500" : ""}
          required
        />
        {errors?.symbol && <p className="text-sm text-red-600">{errors.symbol}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direction">Direction *</Label>
        <Select onValueChange={(value) => onInputChange("direction", value)} required>
          <SelectTrigger className={errors?.direction ? "border-red-500" : ""}>
            <SelectValue placeholder="Long/Short" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">Long</SelectItem>
            <SelectItem value="short">Short</SelectItem>
          </SelectContent>
        </Select>
        {errors?.direction && <p className="text-sm text-red-600">{errors.direction}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          step="0.0001"
          placeholder="100"
          value={formData.quantity}
          onChange={(e) => onInputChange("quantity", e.target.value)}
          className={errors?.quantity ? "border-red-500" : ""}
          required
        />
        {errors?.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="entryPrice">Entry Price *</Label>
        <Input
          id="entryPrice"
          type="number"
          step="0.0001"
          placeholder="150.25"
          value={formData.entryPrice}
          onChange={(e) => onInputChange("entryPrice", e.target.value)}
          className={errors?.entryPrice ? "border-red-500" : ""}
          required
        />
        {errors?.entryPrice && <p className="text-sm text-red-600">{errors.entryPrice}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="exitPrice">Exit Price (Optional)</Label>
        <Input
          id="exitPrice"
          type="number"
          step="0.0001"
          placeholder="155.75"
          value={formData.exitPrice}
          onChange={(e) => onInputChange("exitPrice", e.target.value)}
          className={errors?.exitPrice ? "border-red-500" : ""}
        />
        {errors?.exitPrice && <p className="text-sm text-red-600">{errors.exitPrice}</p>}
      </div>
    </div>
  );
};
