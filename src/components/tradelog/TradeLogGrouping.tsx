
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Calendar, Hash } from 'lucide-react';
import { format, isSameMonth, isSameWeek, isSameDay } from 'date-fns';
import { calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade } from '@/types/trade';

interface TradeGroup {
  key: string;
  label: string;
  trades: InstitutionalTrade[];
  totalPnL: number;
  winRate: number;
  period: Date;
}

interface TradeLogGroupingProps {
  trades: InstitutionalTrade[];
  groupBy: 'day' | 'week' | 'month';
  onTradeClick: (trade: InstitutionalTrade) => void;
  selectedTrade?: InstitutionalTrade;
}

export const TradeLogGrouping: React.FC<TradeLogGroupingProps> = ({
  trades,
  groupBy,
  onTradeClick,
  selectedTrade
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const groupTrades = React.useMemo(() => {
    const groups = new Map<string, TradeGroup>();

    trades.forEach(trade => {
      const tradeDate = new Date(trade.created_at);
      let groupKey: string;
      let groupLabel: string;

      switch (groupBy) {
        case 'day':
          groupKey = format(tradeDate, 'yyyy-MM-dd');
          groupLabel = format(tradeDate, 'EEEE, MMMM do, yyyy');
          break;
        case 'week':
          groupKey = format(tradeDate, 'yyyy-'ww');
          groupLabel = `Week of ${format(tradeDate, 'MMMM do, yyyy')}`;
          break;
        case 'month':
          groupKey = format(tradeDate, 'yyyy-MM');
          groupLabel = format(tradeDate, 'MMMM yyyy');
          break;
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          label: groupLabel,
          trades: [],
          totalPnL: 0,
          winRate: 0,
          period: tradeDate
        });
      }

      const group = groups.get(groupKey)!;
      group.trades.push(trade);
    });

    // Calculate stats for each group
    groups.forEach(group => {
      const closedTrades = group.trades.filter(t => t.exit_price);
      group.totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
      const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
      group.winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    });

    return Array.from(groups.values()).sort((a, b) => b.period.getTime() - a.period.getTime());
  }, [trades, groupBy]);

  const getGroupIcon = () => {
    switch (groupBy) {
      case 'day': return Calendar;
      case 'week': return Hash;
      case 'month': return Calendar;
    }
  };

  const GroupIcon = getGroupIcon();

  return (
    <div className="space-y-4">
      {groupTrades.map((group) => {
        const isExpanded = expandedGroups.has(group.key);
        const hasSelectedTrade = selectedTrade && group.trades.some(t => t.id === selectedTrade.id);

        return (
          <Card key={group.key} className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm transition-all ${
            hasSelectedTrade ? 'ring-2 ring-blue-500/50' : ''
          }`}>
            <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.key)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <GroupIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <CardTitle className="text-white text-lg">{group.label}</CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                          {group.trades.length} trades
                        </Badge>
                        <Badge 
                          variant={group.totalPnL >= 0 ? "default" : "destructive"}
                          className={group.totalPnL >= 0 ? 
                            "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : 
                            "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {group.totalPnL >= 0 ? '+' : ''}${group.totalPnL.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                          {group.winRate.toFixed(0)}% WR
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {group.trades.map((trade) => {
                      const pnl = calculatePnL(trade);
                      const isSelected = selectedTrade?.id === trade.id;
                      const isOpen = !trade.exit_price;

                      return (
                        <div
                          key={trade.id}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-500/20 border-blue-500/50' 
                              : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                          }`}
                          onClick={() => onTradeClick(trade)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {trade.direction === 'long' ? (
                                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-400" />
                                )}
                                <span className="font-semibold text-white">{trade.symbol}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  trade.direction === 'long' 
                                    ? 'text-emerald-400 border-emerald-500/30' 
                                    : 'text-red-400 border-red-500/30'
                                }`}
                              >
                                {trade.direction.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-slate-400">
                                {format(new Date(trade.created_at), 'HH:mm')}
                              </div>
                              {isOpen ? (
                                <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                                  Open
                                </Badge>
                              ) : (
                                <Badge
                                  variant={pnl >= 0 ? "default" : "destructive"}
                                  className={pnl >= 0 ? 
                                    "bg-emerald-500/20 text-emerald-400" : 
                                    "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
