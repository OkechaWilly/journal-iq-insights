
import * as z from 'zod';

export const tradeFormSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  direction: z.enum(['long', 'short'], { required_error: 'Direction is required' }),
  entryPrice: z.number().positive('Entry price must be positive'),
  exitPrice: z.number().positive('Exit price must be positive').optional(),
  quantity: z.number().int().positive('Quantity must be positive'),
  stopLoss: z.number().positive('Stop loss must be positive').optional(),
  takeProfit: z.number().positive('Take profit must be positive').optional(),
  reason: z.enum(['stop', 'target', 'manual', 'time']).optional(),
  emotionalState: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;
