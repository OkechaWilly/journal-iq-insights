
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Brain, AlertTriangle, Trophy } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { calculatePnL } from '@/utils/advancedAnalytics';

export const TradingInsights = () => {
  const { trades, loading } = useTrades();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const closedTrades = trades.filter(trade => trade.exit_price);
  const openTrades = trades.filter(trade => !trade.exit_price);
  const winningTrades = closedTrades.filter(trade => calculatePnL(trade) > 0);
  const losingTrades = closedTrades.filter(trade => calculatePnL(trade) < 0);
  
  const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  
  // Calculate average R-multiple
  const rMultiples = closedTrades
    .map(trade => {
      const pnl = calculatePnL(trade);
      // Simplified R calculation based on P&L
      return pnl > 0 ? Math.abs(pnl / 100) : -Math.abs(pnl / 100);
    })
    .filter(r => !isNaN(r));
  
  const avgR = rMultiples.length > 0 ? rMultiples.reduce((sum, r) => sum + r, 0) / rMultiples.length : 0;

  // Strategy analysis
  const strategyStats = trades.reduce((acc, trade) => {
    const strategy = trade.tags?.[0] || 'Untagged';
    if (!acc[strategy]) {
      acc[strategy] = { total: 0, wins: 0, pnl: 0 };
    }
    acc[strategy].total++;
    if (trade.exit_price && calculatePnL(trade) > 0) {
      acc[strategy].wins++;
    }
    if (trade.exit_price) {
      acc[strategy].pnl += calculatePnL(trade);
    }
    return acc;
  }, {} as Record<string, { total: number; wins: number; pnl: number }>);

  const bestStrategy = Object.entries(strategyStats)
    .filter(([_, stats]) => stats.total >= 3) // At least 3 trades
    .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0];

  // Emotional analysis
  const emotionStats = trades.reduce((acc, trade) => {
    const emotion = trade.emotional_state || 'Unknown';
    if (!acc[emotion]) {
      acc[emotion] = { total: 0, wins: 0 };
    }
    acc[emotion].total++;
    if (trade.exit_price && calculatePnL(trade) > 0) {
      acc[emotion].wins++;
    }
    return acc;
  }, {} as Record<string, { total: number; wins: number }>);

  const worstEmotion = Object.entries(emotionStats)
    .filter(([_, stats]) => stats.total >= 2)
    .sort((a, b) => (a[1].wins / a[1].total) - (b[1].wins / b[1].total))[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Win Rate */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">{winningTrades.length}/{closedTrades.length}</p>
              </div>
              <Target className={`w-8 h-8 ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <Progress 
              value={winRate} 
              className="mt-3 h-2 bg-slate-700"
            />
          </CardContent>
        </Card>

        {/* Total P&L */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${totalPnL.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500">{closedTrades.length} closed</p>
              </div>
              {totalPnL >= 0 ? 
                <TrendingUp className="w-8 h-8 text-emerald-400" /> :
                <TrendingDown className="w-8 h-8 text-red-400" />
              }
            </div>
          </CardContent>
        </Card>

        {/* Average R */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg R-Multiple</p>
                <p className={`text-2xl font-bold ${avgR >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {avgR.toFixed(2)}R
                </p>
                <p className="text-xs text-slate-500">Risk-adjusted</p>
              </div>
              <Badge variant={avgR >= 1 ? "default" : "destructive"} className="text-xs">
                {avgR >= 1 ? 'Good' : 'Poor'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Open Trades</p>
                <p className="text-2xl font-bold text-white">{openTrades.length}</p>
                <p className="text-xs text-slate-500">Active positions</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy & Emotional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Strategy */}
        {bestStrategy && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Best Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{bestStrategy[0]}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400">
                    {((bestStrategy[1].wins / bestStrategy[1].total) * 100).toFixed(1)}% Win Rate
                  </Badge>
                </div>
                <div className="text-sm text-slate-400">
                  {bestStrategy[1].wins} wins out of {bestStrategy[1].total} trades
                </div>
                <div className={`text-sm ${bestStrategy[1].pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Total P&L: ${bestStrategy[1].pnl.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emotional Warning */}
        {worstEmotion && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Emotional Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{worstEmotion[0]}</span>
                  <Badge variant="destructive" className="bg-red-500/10 text-red-400">
                    {((worstEmotion[1].wins / worstEmotion[1].total) * 100).toFixed(1)}% Win Rate
                  </Badge>
                </div>
                <div className="text-sm text-slate-400">
                  This emotional state shows poor performance
                </div>
                <div className="text-sm text-yellow-400">
                  Consider reviewing trades made while {worstEmotion[0].toLowerCase()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
