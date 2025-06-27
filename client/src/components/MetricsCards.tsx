
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import type { TradeMetrics } from '@/types/trade';

interface MetricsCardsProps {
  metrics?: TradeMetrics | null;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  const { loading } = useTrades();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="h-4 bg-slate-700 rounded w-20"></div>
              <div className="h-4 w-4 bg-slate-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: "Total P&L",
      value: metrics && metrics.total_pnl !== undefined && metrics.total_pnl !== null ? `$${metrics.total_pnl.toFixed(2)}` : "$0.00",
      change: metrics && metrics.total_pnl && metrics.total_pnl > 0 ? "Positive" : metrics && metrics.total_pnl && metrics.total_pnl < 0 ? "Negative" : "Neutral",
      changeType: metrics && metrics.total_pnl && metrics.total_pnl > 0 ? "positive" : metrics && metrics.total_pnl && metrics.total_pnl < 0 ? "negative" : "neutral",
      icon: DollarSign,
    },
    {
      title: "Win Rate",
      value: metrics && metrics.win_rate !== undefined && metrics.win_rate !== null ? `${metrics.win_rate.toFixed(1)}%` : "0%",
      change: `${metrics?.winning_trades || 0} wins`,
      changeType: "neutral",
      icon: Target,
    },
    {
      title: "Total Trades",
      value: metrics && metrics.total_trades !== undefined && metrics.total_trades !== null ? metrics.total_trades.toString() : "0",
      change: "All time",
      changeType: "neutral",
      icon: Calendar,
    },
    {
      title: "Risk/Reward",
      value: metrics && metrics.avg_risk_reward !== undefined && metrics.avg_risk_reward !== null ? metrics.avg_risk_reward.toFixed(2) : "0.00",
      change: "Average",
      changeType: "neutral",
      icon: TrendingUp,
    },
    {
      title: "Winning Trades",
      value: metrics && metrics.winning_trades !== undefined && metrics.winning_trades !== null ? metrics.winning_trades.toString() : "0",
      change: "Profitable",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="bg-card border-border hover:bg-card/80 transition-all duration-300 card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 icon-stroke" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
            <p className={`text-xs mt-1 transition-colors duration-300 ${
              metric.changeType === 'positive' ? 'text-profit' :
              metric.changeType === 'negative' ? 'text-loss' :
              'text-muted-foreground'
            }`}>
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
