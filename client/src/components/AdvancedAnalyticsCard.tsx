
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Zap } from "lucide-react";
import type { AdvancedMetrics } from '@/utils/advancedAnalytics';

interface AdvancedAnalyticsCardProps {
  metrics: AdvancedMetrics;
  insights: string[];
}

export const AdvancedAnalyticsCard = ({ metrics, insights }: AdvancedAnalyticsCardProps) => {
  const getMetricColor = (value: number, threshold: { good: number; bad: number }) => {
    if (value >= threshold.good) return "text-emerald-400";
    if (value <= threshold.bad) return "text-red-400";
    return "text-yellow-400";
  };

  const getMetricBadgeColor = (value: number, threshold: { good: number; bad: number }) => {
    if (value >= threshold.good) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (value <= threshold.bad) return "bg-red-500/10 text-red-400 border-red-500/30";
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Advanced Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Sharpe Ratio</p>
            <p className={`text-lg font-semibold ${getMetricColor(metrics.sharpeRatio, { good: 1, bad: 0 })}`}>
              {metrics.sharpeRatio}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Max Drawdown</p>
            <p className={`text-lg font-semibold ${getMetricColor(-metrics.maxDrawdown, { good: -10, bad: -25 })}`}>
              {metrics.maxDrawdown}%
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Profit Factor</p>
            <p className={`text-lg font-semibold ${getMetricColor(metrics.profitFactor, { good: 1.5, bad: 1 })}`}>
              {metrics.profitFactor === Infinity ? '∞' : metrics.profitFactor}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Expectancy</p>
            <p className={`text-lg font-semibold ${getMetricColor(metrics.expectancy, { good: 0, bad: -50 })}`}>
              ${metrics.expectancy}
            </p>
          </div>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-slate-400 text-sm">Win Streak</p>
              <p className="text-emerald-400 font-semibold">{metrics.winStreak} trades</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-slate-400 text-sm">Loss Streak</p>
              <p className="text-red-400 font-semibold">{metrics.lossStreak} trades</p>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Risk Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Badge variant="outline" className={getMetricBadgeColor(metrics.volatility, { good: 20, bad: 50 })}>
              Volatility: {metrics.volatility}
            </Badge>
            <Badge variant="outline" className={getMetricBadgeColor(metrics.sortino, { good: 1, bad: 0 })}>
              Sortino: {metrics.sortino}
            </Badge>
            <Badge variant="outline" className={getMetricBadgeColor(metrics.averageWin, { good: 100, bad: 0 })}>
              Avg Win: ${metrics.averageWin}
            </Badge>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              AI Insights
            </h4>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-slate-900/30 rounded-lg border border-slate-600">
                  <p className="text-slate-300 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
