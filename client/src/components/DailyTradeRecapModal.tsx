
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, Target, Brain } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade } from '@/types/trade';

interface DailyTradeRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  trades: InstitutionalTrade[];
}

export const DailyTradeRecapModal: React.FC<DailyTradeRecapModalProps> = ({
  isOpen,
  onClose,
  date,
  trades
}) => {
  const sortedTrades = trades.sort((a, b) => 
    parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime()
  );

  const closedTrades = trades.filter(t => t.exit_price);
  const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
  const totalPnL = closedTrades.reduce((sum, t) => sum + calculatePnL(t), 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

  const generateAISummary = () => {
    if (trades.length === 0) return "No trades recorded for this day.";
    
    const emotions = trades.map(t => t.emotional_state).filter(Boolean);
    const dominantEmotion = emotions.length > 0 ? emotions[0] : null;
    
    let summary = `Executed ${trades.length} trade${trades.length > 1 ? 's' : ''}`;
    
    if (closedTrades.length > 0) {
      summary += ` with a ${winRate.toFixed(0)}% win rate`;
      if (totalPnL > 0) {
        summary += ` and positive P&L of $${totalPnL.toFixed(2)}`;
      } else if (totalPnL < 0) {
        summary += ` but negative P&L of $${totalPnL.toFixed(2)}`;
      }
    }
    
    if (dominantEmotion) {
      summary += `. Emotional state: ${dominantEmotion}`;
    }
    
    // Generate advice
    let advice = "";
    if (winRate >= 70) {
      advice = "Excellent execution! Maintain this disciplined approach.";
    } else if (winRate >= 50) {
      advice = "Solid performance. Consider analyzing losing trades for improvement.";
    } else if (closedTrades.length > 0) {
      advice = "Review your entry criteria and risk management for better results.";
    } else {
      advice = "Remember to close positions to realize your trading performance.";
    }
    
    return `${summary}. ${advice}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Daily Recap - {format(date, 'EEEE, MMMM do, yyyy')}
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-white">{trades.length}</div>
              <div className="text-xs text-slate-400">Total Trades</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{winningTrades.length}</div>
              <div className="text-xs text-slate-400">Winners</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{winRate.toFixed(0)}%</div>
              <div className="text-xs text-slate-400">Win Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${totalPnL.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400">Net P&L</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        <Card className="bg-blue-900/20 border-blue-500/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-300 mb-2">AI Daily Summary</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {generateAISummary()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Trade Details
          </h3>
          
          {sortedTrades.map((trade, index) => {
            const pnl = calculatePnL(trade);
            const isProfit = pnl > 0;
            
            return (
              <Card key={trade.id} className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg text-white">{trade.symbol}</span>
                      <Badge 
                        variant="outline" 
                        className={trade.direction === 'long' ? 
                          'text-emerald-400 border-emerald-500/30' : 
                          'text-red-400 border-red-500/30'
                        }
                      >
                        {trade.direction.toUpperCase()}
                      </Badge>
                      {trade.emotional_state && (
                        <Badge variant="secondary" className="text-xs">
                          {trade.emotional_state}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {trade.direction === 'long' ? 
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> : 
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      }
                      <span className="text-slate-400 text-sm">
                        {format(parseISO(trade.created_at), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Entry:</span>
                      <span className="ml-2 text-white">${trade.entry_price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Exit:</span>
                      <span className="ml-2 text-white">
                        {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : 'Open'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">P&L:</span>
                      <span className={`ml-2 font-semibold ${
                        trade.exit_price ? (isProfit ? 'text-emerald-400' : 'text-red-400') : 'text-slate-400'
                      }`}>
                        {trade.exit_price ? `$${pnl.toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </div>
                  
                  {trade.notes && (
                    <div className="mt-3 p-2 bg-slate-800/50 rounded text-xs text-slate-300">
                      {trade.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {trades.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No trades recorded for this date</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
