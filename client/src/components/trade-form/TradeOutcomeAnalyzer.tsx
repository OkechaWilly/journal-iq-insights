
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface TradeOutcomeAnalyzerProps {
  formData: {
    symbol: string;
    direction: string;
    entryPrice: string;
    exitPrice: string;
    quantity: string;
    emotionalState: string;
    notes: string;
  };
}

export const TradeOutcomeAnalyzer = ({ formData }: TradeOutcomeAnalyzerProps) => {
  const calculatePnL = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const qty = parseFloat(formData.quantity);
    
    if (!entry || !exit || !qty) return null;
    
    const pnl = formData.direction === 'long' 
      ? (exit - entry) * qty 
      : (entry - exit) * qty;
    
    return pnl;
  };

  const getInsights = () => {
    const insights = [];
    const pnl = calculatePnL();
    
    // P&L Analysis
    if (pnl !== null) {
      if (pnl > 0) {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          message: `Profitable trade: +$${pnl.toFixed(2)}`,
        });
      } else {
        insights.push({
          type: 'warning',
          icon: TrendingDown,
          message: `Loss: -$${Math.abs(pnl).toFixed(2)}`,
        });
      }
    }
    
    // Emotional State Analysis
    if (formData.emotionalState === 'fomo' || formData.emotionalState === 'greedy') {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'Consider reviewing your trade plan - emotional states like FOMO can lead to poor decisions',
      });
    }
    
    if (formData.emotionalState === 'disciplined' || formData.emotionalState === 'patient') {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        message: 'Good emotional control - disciplined trading leads to better outcomes',
      });
    }
    
    // Notes Analysis
    const notes = formData.notes.toLowerCase();
    if (notes.includes('angry') || notes.includes('frustrated')) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'Detected emotional language in notes - consider taking a break',
      });
    }
    
    if (notes.includes('plan') || notes.includes('strategy')) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        message: 'Great job documenting your trading plan',
      });
    }
    
    return insights;
  };

  const insights = getInsights();
  
  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Trade Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <insight.icon className={`w-4 h-4 mt-0.5 ${
              insight.type === 'success' ? 'text-green-600' : 'text-yellow-600'
            }`} />
            <p className="text-sm text-gray-700">{insight.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
