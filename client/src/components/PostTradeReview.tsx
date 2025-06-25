
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, TrendingUp, Clock, Target } from 'lucide-react';
import type { Trade } from '@/hooks/useTrades';

interface PostTradeReviewProps {
  trade: Trade;
  metrics?: string[];
}

export const PostTradeReview: React.FC<PostTradeReviewProps> = ({
  trade,
  metrics = ['execution-quality', 'risk-adjusted-return', 'market-context']
}) => {
  const calculatePnL = (trade: Trade): number => {
    if (!trade.exit_price) return 0;
    
    return trade.direction === 'long'
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price) * trade.quantity;
  };

  const analyzeExecutionQuality = (trade: Trade) => {
    const pnl = calculatePnL(trade);
    const percentChange = trade.exit_price 
      ? Math.abs((trade.exit_price - trade.entry_price) / trade.entry_price) * 100
      : 0;

    let score = 75; // Base score
    
    // Adjust based on P&L
    if (pnl > 0) score += 15;
    else score -= 10;
    
    // Adjust based on size of move
    if (percentChange > 5) score += 10;
    else if (percentChange < 1) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const analyzeRiskAdjustedReturn = (trade: Trade) => {
    if (!trade.exit_price) return 50;
    
    const pnl = calculatePnL(trade);
    const riskAmount = trade.quantity * trade.entry_price * 0.02; // Assume 2% risk
    const riskAdjustedReturn = pnl / riskAmount;
    
    let score = 50;
    if (riskAdjustedReturn > 2) score = 90;
    else if (riskAdjustedReturn > 1) score = 75;
    else if (riskAdjustedReturn > 0) score = 60;
    else if (riskAdjustedReturn > -1) score = 40;
    else score = 20;
    
    return score;
  };

  const analyzeMarketContext = (trade: Trade) => {
    // Simplified market context analysis
    const hour = new Date(trade.created_at).getHours();
    let score = 60;
    
    // Trading during market hours
    if (hour >= 9 && hour <= 16) score += 20;
    else score -= 10;
    
    // Avoid lunch hour
    if (hour >= 12 && hour <= 13) score -= 5;
    
    return Math.max(20, Math.min(100, score));
  };

  const getMetricScore = (metric: string): number => {
    switch (metric) {
      case 'execution-quality':
        return analyzeExecutionQuality(trade);
      case 'risk-adjusted-return':
        return analyzeRiskAdjustedReturn(trade);
      case 'market-context':
        return analyzeMarketContext(trade);
      default:
        return 60;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  const overallScore = metrics.reduce((sum, metric) => sum + getMetricScore(metric), 0) / metrics.length;
  const pnl = calculatePnL(trade);
  const holdDuration = trade.exit_price 
    ? new Date(trade.updated_at).getTime() - new Date(trade.created_at).getTime()
    : 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Post-Trade Analysis: {trade.symbol}
          <Badge variant="outline" className={getScoreBadgeColor(overallScore)}>
            {Math.round(overallScore)}% Score
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trade Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-400">P&L</p>
            <p className={`text-lg font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${pnl.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Direction</p>
            <Badge variant={trade.direction === 'long' ? 'default' : 'secondary'}>
              {trade.direction.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Hold Time</p>
            <p className="text-lg font-bold text-white">
              {holdDuration > 0 ? formatDuration(holdDuration) : 'Open'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Quantity</p>
            <p className="text-lg font-bold text-white">{trade.quantity}</p>
          </div>
        </div>

        {/* Metric Analysis */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Performance Metrics</h4>
          {metrics.map((metric) => {
            const score = getMetricScore(metric);
            const icon = getMetricIcon(metric);
            
            return (
              <div key={metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-white capitalize">
                      {metric.replace('-', ' ')}
                    </span>
                  </div>
                  <span className={`font-bold ${getScoreColor(score)}`}>
                    {Math.round(score)}%
                  </span>
                </div>
                <Progress 
                  value={score} 
                  className="h-2"
                />
                <p className="text-sm text-slate-400">
                  {getMetricInsight(metric, score, trade)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Overall Assessment */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            {overallScore >= 80 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <h4 className="font-semibold text-white">Overall Assessment</h4>
          </div>
          <p className="text-slate-300">
            {getOverallAssessment(overallScore, pnl)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const getMetricIcon = (metric: string) => {
  switch (metric) {
    case 'execution-quality':
      return <Target className="w-4 h-4 text-blue-400" />;
    case 'risk-adjusted-return':
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'market-context':
      return <Clock className="w-4 h-4 text-purple-400" />;
    default:
      return <CheckCircle className="w-4 h-4 text-slate-400" />;
  }
};

const getMetricInsight = (metric: string, score: number, trade: Trade): string => {
  switch (metric) {
    case 'execution-quality':
      if (score >= 80) return 'Excellent execution with strong price movement';
      if (score >= 60) return 'Good execution, met expectations';
      return 'Execution could be improved, consider entry timing';
    
    case 'risk-adjusted-return':
      if (score >= 80) return 'Outstanding risk-adjusted performance';
      if (score >= 60) return 'Acceptable risk-reward ratio';
      return 'Risk taken was not adequately compensated';
    
    case 'market-context':
      if (score >= 80) return 'Optimal market timing and conditions';
      if (score >= 60) return 'Reasonable market conditions for trade';
      return 'Market timing could be improved';
    
    default:
      return 'Analysis complete';
  }
};

const getOverallAssessment = (score: number, pnl: number): string => {
  if (score >= 80 && pnl > 0) {
    return 'Excellent trade execution. This represents the type of high-quality setup you should replicate.';
  } else if (score >= 60) {
    return 'Solid trade with room for improvement. Review the lower-scoring metrics for optimization opportunities.';
  } else if (pnl > 0) {
    return 'Profitable but inefficient. You got lucky - focus on improving execution quality.';
  } else {
    return 'Poor execution led to losses. Review your strategy and risk management approach.';
  }
};

const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
