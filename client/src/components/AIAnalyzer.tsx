
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, TrendingUp } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useTrades } from '@/hooks/useTrades';
import { AIInsightsPanel } from './AIInsightsPanel';

interface AIAnalyzerProps {
  strategies?: string[];
  onInsight?: (insight: any) => void;
}

export const AIAnalyzer: React.FC<AIAnalyzerProps> = ({
  strategies = ['mean-reversion', 'breakout', 'momentum'],
  onInsight
}) => {
  const { trades, loading: tradesLoading } = useTrades();
  const { insights, generateInsights, loading: insightsLoading } = useAIInsights();

  const handleGenerateInsights = async () => {
    if (trades.length < 5) return;
    
    await generateInsights(trades);
    
    if (onInsight && insights.length > 0) {
      onInsight(insights[0]);
    }
  };

  useEffect(() => {
    // Auto-generate insights when we have enough data and none exist
    if (trades.length >= 10 && insights.length === 0 && !insightsLoading) {
      handleGenerateInsights();
    }
  }, [trades.length, insights.length, insightsLoading]);

  if (tradesLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Pattern Recognition Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Pattern Recognition Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300">
                  Analyzing {trades.length} trades across {strategies.length} strategy patterns
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Supported strategies: {strategies.join(', ')}
                </p>
              </div>
              <Button 
                onClick={handleGenerateInsights}
                disabled={trades.length < 5 || insightsLoading}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="w-4 h-4" />
                {insightsLoading ? 'Analyzing...' : 'Analyze Patterns'}
              </Button>
            </div>

            {trades.length < 5 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-300 font-medium">Insufficient Data</p>
                </div>
                <p className="text-yellow-200 text-sm mt-1">
                  Add at least 5 trades to unlock AI pattern recognition. 
                  Current: {trades.length} trades.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strategies.map((strategy) => (
                <div key={strategy} className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-white capitalize mb-2">
                    {strategy.replace('-', ' ')} Detection
                  </h4>
                  <p className="text-sm text-slate-400">
                    {getStrategyDescription(strategy)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AIInsightsPanel />
    </div>
  );
};

const getStrategyDescription = (strategy: string): string => {
  switch (strategy) {
    case 'mean-reversion':
      return 'Identifies trades that profit from price returning to average levels';
    case 'breakout':
      return 'Detects patterns where price breaks through support/resistance';
    case 'momentum':
      return 'Recognizes trends where price continues in the same direction';
    default:
      return 'Custom strategy pattern recognition';
  }
};
