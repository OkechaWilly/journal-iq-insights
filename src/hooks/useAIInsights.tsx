
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Trade } from './useTrades';

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: 'pattern' | 'risk-warning' | 'opportunity';
  confidence_score: number;
  title: string;
  description: string;
  actionable_data?: any;
  trades_analyzed?: number;
  valid_until?: string;
  dismissed_at?: string;
  created_at: string;
}

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .is('dismissed_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI insights",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (trades: Trade[]) => {
    if (trades.length < 10) return; // Need minimum data

    const patterns = analyzePatterns(trades);
    const risks = analyzeRisks(trades);
    const opportunities = findOpportunities(trades);

    const newInsights = [...patterns, ...risks, ...opportunities];

    for (const insight of newInsights) {
      try {
        await supabase.from('ai_insights').insert({
          insight_type: insight.type,
          confidence_score: insight.confidence,
          title: insight.title,
          description: insight.description,
          actionable_data: insight.data,
          trades_analyzed: trades.length,
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      } catch (error) {
        console.error('Error saving insight:', error);
      }
    }

    await fetchInsights();
  };

  const dismissInsight = async (id: string) => {
    try {
      await supabase
        .from('ai_insights')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('id', id);
      
      await fetchInsights();
      toast({
        title: "Insight dismissed",
        description: "The insight has been marked as reviewed"
      });
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return {
    insights,
    loading,
    generateInsights,
    dismissInsight,
    refetch: fetchInsights
  };
};

// AI Analysis Functions
const analyzePatterns = (trades: Trade[]) => {
  const patterns = [];
  
  // Win rate by time of day
  const hourlyWins = trades.reduce((acc, trade) => {
    if (!trade.exit_price) return acc;
    
    const hour = new Date(trade.created_at).getHours();
    const pnl = calculatePnL(trade);
    
    if (!acc[hour]) acc[hour] = { wins: 0, total: 0 };
    acc[hour].total++;
    if (pnl > 0) acc[hour].wins++;
    
    return acc;
  }, {} as Record<number, { wins: number; total: number }>);

  // Find best performing hours
  const bestHour = Object.entries(hourlyWins)
    .map(([hour, stats]) => ({
      hour: parseInt(hour),
      winRate: stats.wins / stats.total,
      total: stats.total
    }))
    .filter(h => h.total >= 5)
    .sort((a, b) => b.winRate - a.winRate)[0];

  if (bestHour && bestHour.winRate > 0.7) {
    patterns.push({
      type: 'pattern',
      confidence: Math.min(bestHour.winRate, 0.95),
      title: `Peak Performance Hour Identified`,
      description: `Your win rate is ${(bestHour.winRate * 100).toFixed(1)}% when trading at ${bestHour.hour}:00. Consider focusing trades during this time.`,
      data: { hour: bestHour.hour, winRate: bestHour.winRate }
    });
  }

  // Hold time analysis
  const holdTimes = trades
    .filter(t => t.exit_price)
    .map(t => ({
      duration: new Date(t.updated_at).getTime() - new Date(t.created_at).getTime(),
      pnl: calculatePnL(t)
    }));

  if (holdTimes.length >= 10) {
    const avgWinTime = holdTimes.filter(h => h.pnl > 0).reduce((sum, h) => sum + h.duration, 0) / holdTimes.filter(h => h.pnl > 0).length;
    const avgLossTime = holdTimes.filter(h => h.pnl < 0).reduce((sum, h) => sum + h.duration, 0) / holdTimes.filter(h => h.pnl < 0).length;

    if (avgWinTime < avgLossTime) {
      patterns.push({
        type: 'pattern',
        confidence: 0.8,
        title: 'Cut Losses Faster',
        description: `Your winning trades average ${formatDuration(avgWinTime)} while losing trades average ${formatDuration(avgLossTime)}. Consider tighter stop losses.`,
        data: { avgWinTime, avgLossTime }
      });
    }
  }

  return patterns;
};

const analyzeRisks = (trades: Trade[]) => {
  const risks = [];
  const recentTrades = trades.slice(0, 20);
  
  // Consecutive losses
  let consecutiveLosses = 0;
  let maxConsecutiveLosses = 0;
  
  for (const trade of recentTrades) {
    if (!trade.exit_price) continue;
    
    const pnl = calculatePnL(trade);
    if (pnl < 0) {
      consecutiveLosses++;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
    } else {
      consecutiveLosses = 0;
    }
  }

  if (consecutiveLosses >= 3) {
    risks.push({
      type: 'risk-warning',
      confidence: Math.min(0.9, 0.6 + (consecutiveLosses * 0.1)),
      title: 'Losing Streak Alert',
      description: `You have ${consecutiveLosses} consecutive losses. Consider reducing position size or taking a break.`,
      data: { consecutiveLosses }
    });
  }

  // Position sizing risk
  const positionSizes = trades.slice(0, 10).map(t => t.quantity * t.entry_price);
  const avgPosition = positionSizes.reduce((sum, p) => sum + p, 0) / positionSizes.length;
  const largePositions = positionSizes.filter(p => p > avgPosition * 2).length;

  if (largePositions > 2) {
    risks.push({
      type: 'risk-warning',
      confidence: 0.75,
      title: 'Position Size Warning',
      description: `${largePositions} recent trades exceed 2x average position size. Review risk management.`,
      data: { largePositions, avgPosition }
    });
  }

  return risks;
};

const findOpportunities = (trades: Trade[]) => {
  const opportunities = [];
  
  // Symbol performance analysis
  const symbolStats = trades.reduce((acc, trade) => {
    if (!trade.exit_price) return acc;
    
    if (!acc[trade.symbol]) {
      acc[trade.symbol] = { wins: 0, total: 0, totalPnl: 0 };
    }
    
    const pnl = calculatePnL(trade);
    acc[trade.symbol].total++;
    acc[trade.symbol].totalPnl += pnl;
    if (pnl > 0) acc[trade.symbol].wins++;
    
    return acc;
  }, {} as Record<string, { wins: number; total: number; totalPnl: number }>);

  const bestSymbol = Object.entries(symbolStats)
    .filter(([_, stats]) => stats.total >= 5)
    .map(([symbol, stats]) => ({
      symbol,
      winRate: stats.wins / stats.total,
      avgPnl: stats.totalPnl / stats.total,
      total: stats.total
    }))
    .sort((a, b) => b.winRate - a.winRate)[0];

  if (bestSymbol && bestSymbol.winRate > 0.8) {
    opportunities.push({
      type: 'opportunity',
      confidence: Math.min(bestSymbol.winRate, 0.9),
      title: `High-Performance Symbol: ${bestSymbol.symbol}`,
      description: `${bestSymbol.symbol} shows ${(bestSymbol.winRate * 100).toFixed(1)}% win rate over ${bestSymbol.total} trades. Consider increasing allocation.`,
      data: bestSymbol
    });
  }

  return opportunities;
};

const calculatePnL = (trade: Trade): number => {
  if (!trade.exit_price) return 0;
  
  return trade.direction === 'long'
    ? (trade.exit_price - trade.entry_price) * trade.quantity
    : (trade.entry_price - trade.exit_price) * trade.quantity;
};

const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
