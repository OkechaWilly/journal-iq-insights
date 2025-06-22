
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';
import { EmotionalStateSelector } from './EmotionalStateSelector';
import { ScreenshotUpload } from './ScreenshotUpload';

interface EnhancedTradeFormProps {
  onSubmit: (tradeData: any) => void;
  loading?: boolean;
}

export const EnhancedTradeForm = ({ onSubmit, loading }: EnhancedTradeFormProps) => {
  const [formData, setFormData] = useState({
    symbol: '',
    direction: '',
    quantity: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    strategy: '',
    setup: '',
    emotion: '',
    mistake: '',
    notes: '',
    screenshot: null as File | null
  });

  const [calculatedR, setCalculatedR] = useState<number | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate R-multiple when relevant fields change
    if (['entryPrice', 'exitPrice', 'stopLoss', 'direction'].includes(field)) {
      calculateRMultiple({ ...formData, [field]: value });
    }
  };

  const calculateRMultiple = (data: typeof formData) => {
    const entry = parseFloat(data.entryPrice);
    const exit = parseFloat(data.exitPrice);
    const sl = parseFloat(data.stopLoss);
    
    if (!entry || !exit || !sl || !data.direction) return;
    
    const risk = data.direction === 'long' ? entry - sl : sl - entry;
    const reward = data.direction === 'long' ? exit - entry : entry - exit;
    
    if (risk > 0) {
      const rMultiple = reward / risk;
      setCalculatedR(rMultiple);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tradeData = {
      ...formData,
      entry_price: parseFloat(formData.entryPrice),
      exit_price: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      quantity: parseFloat(formData.quantity),
      r_multiple: calculatedR,
      emotional_state: formData.emotion,
      tags: [formData.strategy, formData.setup].filter(Boolean),
      notes: `Setup: ${formData.setup}\nMistake: ${formData.mistake}\nNotes: ${formData.notes}`.trim()
    };
    
    onSubmit(tradeData);
  };

  const strategies = [
    'Breakout', 'Reversal', 'Trend Following', 'Mean Reversion', 
    'Support/Resistance', 'News Trading', 'Scalping', 'Swing Trade'
  ];

  const setups = [
    'Flag Pattern', 'Triangle', 'Double Top/Bottom', 'Head & Shoulders',
    'Fibonacci Retracement', 'Moving Average Cross', 'RSI Divergence',
    'Volume Breakout', 'Gap Fill', 'Earnings Play'
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Enhanced Trade Entry
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Complete trade logging with automatic R-multiple calculation
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Trade Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Symbol *</Label>
              <Input
                placeholder="AAPL, EURUSD, BTC"
                value={formData.symbol}
                onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Direction *</Label>
              <Select onValueChange={(value) => updateField('direction', value)} required>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Long/Short" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="long" className="text-white">Long</SelectItem>
                  <SelectItem value="short" className="text-white">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Quantity *</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          {/* Price Levels */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Entry Price *</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="150.25"
                value={formData.entryPrice}
                onChange={(e) => updateField('entryPrice', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Exit Price</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="155.75"
                value={formData.exitPrice}
                onChange={(e) => updateField('exitPrice', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Stop Loss</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="148.50"
                value={formData.stopLoss}
                onChange={(e) => updateField('stopLoss', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Take Profit</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="154.00"
                value={formData.takeProfit}
                onChange={(e) => updateField('takeProfit', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* R-Multiple Display */}
          {calculatedR !== null && (
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
              <Calculator className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">R-Multiple:</span>
              <Badge 
                variant={calculatedR > 0 ? "default" : "destructive"}
                className={calculatedR > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}
              >
                {calculatedR.toFixed(2)}R
              </Badge>
            </div>
          )}

          {/* Strategy & Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Strategy</Label>
              <Select onValueChange={(value) => updateField('strategy', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {strategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy} className="text-white">
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Setup Used</Label>
              <Select onValueChange={(value) => updateField('setup', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select setup" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {setups.map(setup => (
                    <SelectItem key={setup} value={setup} className="text-white">
                      {setup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Emotional State */}
          <div className="space-y-2">
            <Label className="text-white">Emotional State</Label>
            <EmotionalStateSelector 
              value={formData.emotion}
              onChange={(value) => updateField('emotion', value)}
            />
          </div>

          {/* Mistake Field */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Mistake Made (if any)
            </Label>
            <Textarea
              placeholder="What went wrong with this trade? Learning opportunity..."
              value={formData.mistake}
              onChange={(e) => updateField('mistake', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px]"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white">Additional Notes</Label>
            <Textarea
              placeholder="Market conditions, thoughts, journal entry..."
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
            />
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <Label className="text-white">Trade Screenshot</Label>
            <ScreenshotUpload 
              onUpload={(file) => setFormData(prev => ({ ...prev, screenshot: file }))}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? 'Saving Trade...' : 'Log Trade'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
