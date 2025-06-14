
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const trades = [
  {
    id: 1,
    symbol: 'AAPL',
    type: 'Long',
    entry: '$150.25',
    exit: '$155.80',
    pnl: '+$278.00',
    status: 'win',
    date: '2 hours ago',
  },
  {
    id: 2,
    symbol: 'TSLA',
    type: 'Short',
    entry: '$245.60',
    exit: '$242.10',
    pnl: '+$175.00',
    status: 'win',
    date: '4 hours ago',
  },
  {
    id: 3,
    symbol: 'MSFT',
    type: 'Long',
    entry: '$380.45',
    exit: '$375.20',
    pnl: '-$105.00',
    status: 'loss',
    date: '1 day ago',
  },
  {
    id: 4,
    symbol: 'GOOGL',
    type: 'Long',
    entry: '$2,750.00',
    exit: '$2,785.50',
    pnl: '+$142.00',
    status: 'win',
    date: '1 day ago',
  },
  {
    id: 5,
    symbol: 'AMZN',
    type: 'Short',
    entry: '$3,200.00',
    exit: '$3,180.25',
    pnl: '+$98.75',
    status: 'win',
    date: '2 days ago',
  },
];

export const RecentTrades = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
        <p className="text-sm text-gray-600">Your latest trading activity</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  trade.status === 'win' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {trade.status === 'win' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{trade.symbol}</span>
                    <Badge variant={trade.type === 'Long' ? 'default' : 'secondary'} className="text-xs">
                      {trade.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {trade.entry} → {trade.exit}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  trade.status === 'win' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trade.pnl}
                </div>
                <div className="text-xs text-gray-500">{trade.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
