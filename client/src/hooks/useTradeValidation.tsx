
import { useState } from 'react';

interface TradeFormData {
  symbol: string;
  direction: string;
  quantity: string;
  entryPrice: string;
  exitPrice: string;
  emotionalState: string;
  notes: string;
  tags: string;
}

export const useTradeValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateTrade = (formData: TradeFormData): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }

    if (!formData.direction) {
      newErrors.direction = 'Direction is required';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
      newErrors.entryPrice = 'Entry price must be greater than 0';
    }

    // Exit price validation
    if (formData.exitPrice) {
      const entryPrice = parseFloat(formData.entryPrice);
      const exitPrice = parseFloat(formData.exitPrice);

      if (exitPrice <= 0) {
        newErrors.exitPrice = 'Exit price must be greater than 0';
      } else if (formData.direction === 'long' && exitPrice <= entryPrice) {
        newErrors.exitPrice = 'For long trades, exit price should typically be higher than entry price';
      } else if (formData.direction === 'short' && exitPrice >= entryPrice) {
        newErrors.exitPrice = 'For short trades, exit price should typically be lower than entry price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors({});

  return { errors, validateTrade, clearErrors };
};
