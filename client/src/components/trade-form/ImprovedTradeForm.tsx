
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SymbolSearch } from './SymbolSearch';
import { EmotionRadialPicker } from './EmotionRadialPicker';
import { CalculatedMetric } from './CalculatedMetric';
import { ScreenshotUpload } from './ScreenshotUpload';
import { useTradeCalculations } from '@/hooks/useTradeCalculations';
import { useTrades } from '@/hooks/useTrades';
import { useToast } from '@/hooks/use-toast';
import { tradeFormSchema, type TradeFormValues } from '@/schemas/trade';
import { Save, Calculator } from 'lucide-react';

interface ImprovedTradeFormProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const ImprovedTradeForm: React.FC<ImprovedTradeFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const { addTrade } = useTrades();
  const { toast } = useToast();

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      symbol: '',
      direction: 'long',
      entryPrice: 0,
      exitPrice: undefined,
      quantity: 1,
      stopLoss: undefined,
      takeProfit: undefined,
      reason: undefined,
      emotionalState: '',
      screenshots: [],
      notes: '',
      tags: '',
    },
  });

  const watchedValues = form.watch();
  const calculations = useTradeCalculations(watchedValues);

  const handleSubmit = async (data: TradeFormValues) => {
    try {
      console.log('Submitting trade data:', data);
      
      await addTrade({
        symbol: data.symbol.toUpperCase(),
        direction: data.direction,
        entry_price: data.entryPrice,
        exit_price: data.exitPrice || null,
        quantity: data.quantity,
        emotional_state: data.emotionalState || null,
        notes: data.notes || null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : null,
        screenshot_url: data.screenshots && data.screenshots.length > 0 ? data.screenshots[0] : null,
      });

      toast({
        title: "Trade Added Successfully",
        description: `${data.symbol.toUpperCase()} ${data.direction} trade has been logged.`,
      });

      form.reset();
      
      // Call the onSubmit callback after successful save
      if (onSubmit) {
        console.log('Calling onSubmit callback');
        onSubmit();
      }
    } catch (error) {
      console.error('Error saving trade:', error);
      toast({
        title: "Error Saving Trade",
        description: "Failed to save trade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTrendForMetric = (value: number | undefined): 'positive' | 'negative' | 'neutral' => {
    if (value === undefined) return 'neutral';
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Add New Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Trade Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Symbol *</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Direction *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="long">Long</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="entryPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Entry Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Exit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stopLoss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Stop Loss</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="takeProfit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Take Profit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Contracts/Size *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Exit Reason</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="stop">Stop Loss Hit</SelectItem>
                            <SelectItem value="target">Take Profit Hit</SelectItem>
                            <SelectItem value="manual">Manual Close</SelectItem>
                            <SelectItem value="time">Time Exit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Calculated Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <CalculatedMetric 
                    label="Gross P&L" 
                    value={calculations?.grossPL} 
                    unit="$"
                    trend={getTrendForMetric(calculations?.grossPL)}
                  />
                  <CalculatedMetric 
                    label="Net P&L" 
                    value={calculations?.netPL} 
                    unit="$"
                    trend={getTrendForMetric(calculations?.netPL)}
                  />
                  <CalculatedMetric 
                    label="ROI" 
                    value={calculations?.roi} 
                    unit="%" 
                    trend={getTrendForMetric(calculations?.roi)}
                  />
                </div>

                {calculations?.riskReward && (
                  <div className="grid grid-cols-2 gap-4">
                    <CalculatedMetric 
                      label="Risk/Reward" 
                      value={calculations.riskReward} 
                      unit=":1"
                      trend={calculations.riskReward >= 2 ? 'positive' : 'negative'}
                    />
                    <CalculatedMetric 
                      label="Potential Loss" 
                      value={calculations.potentialLoss} 
                      unit="$"
                      trend="negative"
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Visuals & Notes */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="screenshots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Trading Screenshots</FormLabel>
                      <FormControl>
                        <ScreenshotUpload
                          screenshots={field.value || []}
                          onScreenshotsChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emotionalState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Emotional State</FormLabel>
                      <FormControl>
                        <EmotionRadialPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., breakout, earnings, technical"
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Trade Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your thought process, market conditions..."
                          className="min-h-[120px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={form.formState.isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting ? 'Saving...' : 'Save Trade'}
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
