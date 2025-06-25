
import * as z from 'zod';

export const tradeFormSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
  direction: z.enum(['long', 'short'], { required_error: 'Direction is required' }),
  entryPrice: z.number().positive('Entry price must be positive'),
  exitPrice: z.number().positive('Exit price must be positive').optional(),
  quantity: z.number().int().positive('Quantity must be positive'),
  stopLoss: z.number().positive('Stop loss must be positive').optional(),
  takeProfit: z.number().positive('Take profit must be positive').optional(),
  reason: z.enum(['stop', 'target', 'manual', 'time'], {
    required_error: 'Please select an exit reason'
  }).optional(),
  emotionalState: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  tags: z.string().optional(),
}).refine((data) => {
  // If exit price is provided, ensure it makes sense with direction
  if (data.exitPrice && data.entryPrice) {
    if (data.direction === 'long' && data.exitPrice <= 0) return false;
    if (data.direction === 'short' && data.exitPrice <= 0) return false;
  }
  return true;
}, {
  message: "Exit price must be valid for the trade direction",
  path: ["exitPrice"]
}).refine((data) => {
  // If stop loss is provided, ensure it makes sense with direction
  if (data.stopLoss && data.entryPrice) {
    if (data.direction === 'long' && data.stopLoss >= data.entryPrice) {
      return false;
    }
    if (data.direction === 'short' && data.stopLoss <= data.entryPrice) {
      return false;
    }
  }
  return true;
}, {
  message: "Stop loss must be below entry price for long trades, above for short trades",
  path: ["stopLoss"]
}).refine((data) => {
  // If take profit is provided, ensure it makes sense with direction
  if (data.takeProfit && data.entryPrice) {
    if (data.direction === 'long' && data.takeProfit <= data.entryPrice) {
      return false;
    }
    if (data.direction === 'short' && data.takeProfit >= data.entryPrice) {
      return false;
    }
  }
  return true;
}, {
  message: "Take profit must be above entry price for long trades, below for short trades",
  path: ["takeProfit"]
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;
