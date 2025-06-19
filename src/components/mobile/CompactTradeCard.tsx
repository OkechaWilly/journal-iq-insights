
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { Trade } from '@/hooks/useTrades';
import { format } from 'date-fns';

interface CompactTradeCardProps {
  trade: Trade;
  onClick?: () => void;
}

export const CompactTradeCard: React.FC<CompactTradeCardProps> = ({ trade, onClick }) => {
  const pnl = trade.exit_price 
    ? (trade.direction === 'long' 
        ? (trade.exit_price - trade.entry_price) * trade.quantity 
        : (trade.entry_price - trade.exit_price) * trade.quantity)
    : 0;

  const isProfitable = pnl > 0;
  const isOpen = !trade.exit_price;

  return (
    <Card 
      className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-3 cursor-pointer hover:bg-slate-800/70 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-lg">{trade.symbol}</span>
            <Badge 
              variant={trade.direction === 'long' ? 'default' : 'secondary'}
              className={`text-xs ${
                trade.direction === 'long' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {trade.direction === 'long' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {trade.direction.toUpperCase()}
            </Badge>
          </div>
          
          {!isOpen && (
            <div className={`flex items-center gap-1 ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">
                {isProfitable ? '+' : ''}{pnl.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Entry:</span>
            <div className="text-white font-medium">${trade.entry_price}</div>
          </div>
          
          <div>
            <span className="text-slate-400">
              {isOpen ? 'Qty:' : 'Exit:'}
            </span>
            <div className="text-white font-medium">
              {isOpen ? trade.quantity : `$${trade.exit_price}`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
          <span className="text-slate-400 text-xs">
            {format(new Date(trade.created_at), 'MMM dd, HH:mm')}
          </span>
          
          {isOpen && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
              Open
            </Badge>
          )}
        </div>
        
        {trade.tags && trade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {trade.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {trade.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{trade.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
