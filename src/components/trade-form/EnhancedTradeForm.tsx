
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SymbolSearch } from './SymbolSearch';
import { DirectionToggle } from './DirectionToggle';
import { EmotionSelector } from './EmotionSelector';
import { TradeNotesRichText } from './TradeNotesRichText';
import { useTrades } from '@/hooks/useTrades';
import { useToast } from '@/hooks/use-toast';
import type { InstitutionalTrade } from '@/types/trade';

const tradeSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
  direction: z.enum(['long', 'short']),
  entry_price: z.number().min(0.01, 'Entry price must be positive'),
  exit_price: z.number().min(0.01, 'Exit price must be positive').optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  emotional_state: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type TradeFormData = z.infer<typeof tradeSchema>;

interface EnhancedTradeFormProps {
  trade?: InstitutionalTrade;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const EnhancedTradeForm: React.FC<EnhancedTradeFormProps> = ({
  trade,
  onSubmit,
  onCancel
}) => {
  const { addTrade, updateTrade } = useTrades();
  const { toast } = useToast();
  const isEditing = !!trade;

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      symbol: trade?.symbol || '',
      direction: trade?.direction || 'long',
      entry_price: trade?.entry_price || 0,
      exit_price: trade?.exit_price || undefined,
      quantity: trade?.quantity || 1,
      emotional_state: trade?.emotional_state || '',
      notes: trade?.notes || '',
      tags: trade?.tags || [],
    },
  });

  const handleSubmit = async (data: TradeFormData) => {
    try {
      // Ensure all required fields are present for the API call
      const tradeData: Omit<InstitutionalTrade, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        symbol: data.symbol,
        direction: data.direction,
        entry_price: data.entry_price,
        exit_price: data.exit_price || null,
        quantity: data.quantity,
        emotional_state: data.emotional_state || null,
        notes: data.notes || null,
        tags: data.tags || null,
        screenshot_url: null,
        execution_quality: undefined,
        slippage: undefined,
        ai_insights: undefined,
      };

      if (isEditing && trade) {
        await updateTrade(trade.id, tradeData);
        toast({
          title: "Trade Updated",
          description: "Your trade has been updated successfully.",
        });
      } else {
        await addTrade(tradeData);
        toast({
          title: "Trade Added",
          description: "Your trade has been added successfully.",
        });
        form.reset();
      }
      onSubmit?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trade. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">
          {isEditing ? 'Edit Trade' : 'Add New Trade'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Symbol Search */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Symbol</FormLabel>
                  <FormControl>
                    <SymbolSearch
                      value={field.value}
                      onChange={field.onChange}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Direction Toggle */}
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Direction</FormLabel>
                  <FormControl>
                    <DirectionToggle
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="entry_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Entry Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Exit Price (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Emotional State */}
            <FormField
              control={form.control}
              name="emotional_state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EmotionSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TradeNotesRichText
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Trade'
                  : 'Add Trade'
                }
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
