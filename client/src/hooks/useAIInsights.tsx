
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAIInsights } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import type { AIInsight, InstitutionalTrade } from '@/types/trade';

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInsights = async () => {
    try {
      const data = await getAIInsights();
      setInsights(data);
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

  const generateInsights = async (trades: InstitutionalTrade[]) => {
    if (trades.length < 10) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate pattern insights
      const patterns = analyzeTradePatterns(trades);
      const risks = analyzeRiskPatterns(trades);
      const opportunities = findTradingOpportunities(trades);

      const newInsights = [...patterns, ...risks, ...opportunities];

      for (const insight of newInsights) {
        await supabase.from('ai_insights').insert({
          user_id: user.id,
          insight_type: insight.type,
          confidence_score: insight.confidence,
          title: insight.title,
          description: insight.description,
          actionable_data: insight.data,
          trades_analyzed: trades.length,
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      await fetchInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
    }
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

// AI Analysis Helper Functions
const analyzeTradePatterns = (trades: InstitutionalTrade[]) => {
  const patterns = [];
  
  // Win rate by time analysis
  const hourlyPerformance = trades.reduce((acc, trade) => {
    if (!trade.exit_price) return acc;
    
    const hour = new Date(trade.created_at).getHours();
    const pnl = calculateTradeProfit(trade);
    
    if (!acc[hour]) acc[hour] = { wins: 0, total: 0 };
    acc[hour].total++;
    if (pnl > 0) acc[hour].wins++;
    
    return acc;
  }, {} as Record<number, { wins: number; total: number }>);

  const bestHour = Object.entries(hourlyPerformance)
    .map(([hour, stats]) => ({
      hour: parseInt(hour),
      winRate: stats.wins / stats.total,
      total: stats.total
    }))
    .filter(h => h.total >= 5)
    .sort((a, b) => b.winRate - a.winRate)[0];

  if (bestHour && bestHour.winRate > 0.7) {
    patterns.push({
      type: 'pattern' as const,
      confidence: Math.min(bestHour.winRate, 0.95),
      title: `Peak Performance Hour: ${bestHour.hour}:00`,
      description: `Your win rate is ${(bestHour.winRate * 100).toFixed(1)}% when trading at ${bestHour.hour}:00`,
      data: { hour: bestHour.hour, winRate: bestHour.winRate }
    });
  }

  return patterns;
};

const analyzeRiskPatterns = (trades: InstitutionalTrade[]) => {
  const risks = [];
  const recentTrades = trades.slice(0, 20);
  
  let consecutiveLosses = 0;
  for (const trade of recentTrades) {
    if (!trade.exit_price) continue;
    
    const pnl = calculateTradeProfit(trade);
    if (pnl < 0) {
      consecutiveLosses++;
    } else {
      break;
    }
  }

  if (consecutiveLosses >= 3) {
    risks.push({
      type: 'risk-warning' as const,
      confidence: Math.min(0.9, 0.6 + (consecutiveLosses * 0.1)),
      title: 'Losing Streak Alert',
      description: `You have ${consecutiveLosses} consecutive losses. Consider reducing position size.`,
      data: { consecutiveLosses }
    });
  }

  return risks;
};

const findTradingOpportunities = (trades: InstitutionalTrade[]) => {
  const opportunities = [];
  
  // Symbol performance analysis
  const symbolStats = trades.reduce((acc, trade) => {
    if (!trade.exit_price) return acc;
    
    if (!acc[trade.symbol]) {
      acc[trade.symbol] = { wins: 0, total: 0, totalPnl: 0 };
    }
    
    const pnl = calculateTradeProfit(trade);
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
      type: 'opportunity' as const,
      confidence: Math.min(bestSymbol.winRate, 0.9),
      title: `High-Performance Symbol: ${bestSymbol.symbol}`,
      description: `${bestSymbol.symbol} shows ${(bestSymbol.winRate * 100).toFixed(1)}% win rate`,
      data: bestSymbol
    });
  }

  return opportunities;
};

const calculateTradeProfit = (trade: InstitutionalTrade): number => {
  if (!trade.exit_price) return 0;
  
  return trade.direction === 'long'
    ? (trade.exit_price - trade.entry_price) * trade.quantity
    : (trade.entry_price - trade.exit_price) * trade.quantity;
};
