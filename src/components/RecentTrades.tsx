
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade } from '@/types/trade';

interface RecentTradesProps {
  trades?: InstitutionalTrade[];
}

export const RecentTrades = ({ trades = [] }: RecentTradesProps) => {
  // Use provided trades or fallback to static data if none provided
  const recentTrades = trades.length > 0 ? trades.slice(0, 5) : [
    {
      id: '1',
      symbol: 'AAPL',
      direction: 'long' as const,
      entry_price: 150.25,
      exit_price: 155.80,
      quantity: 50,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_id: '',
      updated_at: ''
    },
    {
      id: '2',
      symbol: 'TSLA',
      direction: 'short' as const,
      entry_price: 245.60,
      exit_price: 242.10,
      quantity: 50,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user_id: '',
      updated_at: ''
    },
    {
      id: '3',
      symbol: 'MSFT',
      direction: 'long' as const,
      entry_price: 380.45,
      exit_price: 375.20,
      quantity: 20,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user_id: '',
      updated_at: ''
    },
    {
      id: '4',
      symbol: 'GOOGL',
      direction: 'long' as const,
      entry_price: 2750.00,
      exit_price: 2785.50,
      quantity: 4,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user_id: '',
      updated_at: ''
    },
    {
      id: '5',
      symbol: 'AMZN',
      direction: 'short' as const,
      entry_price: 3200.00,
      exit_price: 3180.25,
      quantity: 5,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: '',
      updated_at: ''
    }
  ];

  return (
    <Card className="col-span-1 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Recent Trades</CardTitle>
        <p className="text-sm text-slate-400">Your latest trading activity</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTrades.map((trade) => {
            const pnl = calculatePnL(trade);
            const isProfit = pnl > 0;
            
            return (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isProfit ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    {isProfit ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{trade.symbol}</span>
                      <Badge 
                        variant={trade.direction === 'long' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {trade.direction.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-400">
                      ${trade.entry_price.toFixed(2)} → {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : 'Open'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    isProfit ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.exit_price ? `$${pnl.toFixed(2)}` : 'Open'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(parseISO(trade.created_at), 'MMM d, HH:mm')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
