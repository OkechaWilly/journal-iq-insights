
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, AlertTriangle, Target, X } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';

export const AIInsightsPanel: React.FC = () => {
  const { insights, loading, dismissInsight } = useAIInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return Brain;
      case 'opportunity': return Target;
      case 'risk-warning': return AlertTriangle;
      default: return TrendingUp;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-400';
      case 'opportunity': return 'text-emerald-400';
      case 'risk-warning': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 0.6) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Trading Insights
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

  if (insights.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Trading Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            No insights available. Add more trades to unlock AI-powered analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Trading Insights
          <Badge variant="outline" className="ml-auto bg-blue-500/10 text-blue-400 border-blue-500/30">
            {insights.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const IconComponent = getInsightIcon(insight.insight_type);
          const iconColor = getInsightColor(insight.insight_type);
          
          return (
            <Alert key={insight.id} className="bg-slate-700/30 border-slate-600">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{insight.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={getConfidenceColor(insight.confidence_score)}
                      >
                        {Math.round(insight.confidence_score * 100)}% confident
                      </Badge>
                    </div>
                    <AlertDescription className="text-slate-300">
                      {insight.description}
                    </AlertDescription>
                    {insight.trades_analyzed && (
                      <p className="text-xs text-slate-400 mt-2">
                        Based on analysis of {insight.trades_analyzed} trades
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissInsight(insight.id)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};
