
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade } from '@/types/trade';
import { format } from 'date-fns';

interface VirtualizedTradeTableProps {
  trades: InstitutionalTrade[];
  onEdit?: (trade: InstitutionalTrade) => void;
  onDelete?: (trade: InstitutionalTrade) => void;
  height?: number;
}

interface TradeRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    trades: InstitutionalTrade[];
    onEdit?: (trade: InstitutionalTrade) => void;
    onDelete?: (trade: InstitutionalTrade) => void;
  };
}

const TradeRow: React.FC<TradeRowProps> = ({ index, style, data }) => {
  const trade = data.trades[index];
  const pnl = trade.exit_price ? calculatePnL(trade) : 0;
  const isProfit = pnl > 0;
  const isOpen = !trade.exit_price;

  return (
    <div style={style} className="px-4">
      <div className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700 rounded-lg mb-1 hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            {trade.direction === 'long' ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="font-mono font-semibold text-white">{trade.symbol}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-slate-400">Entry: </span>
              <span className="text-white font-mono">${trade.entry_price.toFixed(2)}</span>
            </div>
            
            {trade.exit_price && (
              <div>
                <span className="text-slate-400">Exit: </span>
                <span className="text-white font-mono">${trade.exit_price.toFixed(2)}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400">Qty: </span>
              <span className="text-white font-mono">{trade.quantity}</span>
            </div>

            <div>
              <span className="text-slate-400">Date: </span>
              <span className="text-white">{format(new Date(trade.created_at), 'MMM dd')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOpen ? (
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              Open
            </Badge>
          ) : (
            <Badge
              variant={isProfit ? "default" : "destructive"}
              className={isProfit ? "bg-emerald-500/20 text-emerald-400" : ""}
            >
              {isProfit ? '+' : ''}${pnl.toFixed(2)}
            </Badge>
          )}

          {trade.emotional_state && (
            <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
              {trade.emotional_state}
            </Badge>
          )}

          <div className="flex gap-1">
            {data.onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => data.onEdit!(trade)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
            {data.onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => data.onDelete!(trade)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VirtualizedTradeTable: React.FC<VirtualizedTradeTableProps> = ({
  trades,
  onEdit,
  onDelete,
  height = 600
}) => {
  const itemData = useMemo(
    () => ({
      trades,
      onEdit,
      onDelete
    }),
    [trades, onEdit, onDelete]
  );

  if (trades.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No trades found</p>
            <p className="text-sm mt-1">Start by adding your first trade</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Trade History ({trades.length} trades)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <List
          height={height}
          itemCount={trades.length}
          itemSize={80}
          width="100%"
          itemData={itemData}
        >
          {TradeRow}
        </List>
      </CardContent>
    </Card>
  );
};
