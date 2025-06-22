
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, TrendingDown, AlertTriangle, Calculator, RefreshCw } from 'lucide-react';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';

export const RiskDashboard: React.FC = () => {
  const { metrics, currentMetrics, loading, calculateRiskMetrics, getRiskLevel } = useRiskMetrics();

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const formatPercentage = (value?: number) => {
    if (!value) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatRatio = (value?: number) => {
    if (!value) return 'N/A';
    return value.toFixed(3);
  };

  const getRiskBadgeColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentMetrics) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calculator className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              No risk metrics available. Calculate your first risk assessment.
            </p>
            <Button onClick={calculateRiskMetrics} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Calculate Risk Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(currentMetrics);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Risk Management Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRiskBadgeColor(riskLevel)}>
                {riskLevel.toUpperCase()} RISK
              </Badge>
              <Button size="sm" variant="outline" onClick={calculateRiskMetrics}>
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <p className="text-sm text-slate-400">Value at Risk (95%)</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(currentMetrics.var_95)}
              </p>
              <p className="text-xs text-slate-500">Daily loss potential</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <p className="text-sm text-slate-400">Expected Shortfall</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(currentMetrics.expected_shortfall)}
              </p>
              <p className="text-xs text-slate-500">Avg. loss beyond VaR</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <p className="text-sm text-slate-400">Max Drawdown</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatPercentage(currentMetrics.max_drawdown)}
              </p>
              <p className="text-xs text-slate-500">Peak-to-trough loss</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-400" />
                <p className="text-sm text-slate-400">Sharpe Ratio</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatRatio(currentMetrics.sharpe_ratio)}
              </p>
              <p className="text-xs text-slate-500">Risk-adjusted return</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-purple-400" />
                <p className="text-sm text-slate-400">Volatility</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatPercentage(currentMetrics.volatility)}
              </p>
              <p className="text-xs text-slate-500">Return variability</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <p className="text-sm text-slate-400">Sortino Ratio</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatRatio(currentMetrics.sortino_ratio)}
              </p>
              <p className="text-xs text-slate-500">Downside risk-adj.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-slate-400">Beta</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatRatio(currentMetrics.beta)}
              </p>
              <p className="text-xs text-slate-500">Market correlation</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-400" />
                <p className="text-sm text-slate-400">Alpha</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatRatio(currentMetrics.alpha)}
              </p>
              <p className="text-xs text-slate-500">Excess return</p>
            </div>
          </div>

          {riskLevel === 'high' && (
            <Alert className="mt-6 bg-red-500/10 border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <strong>High Risk Alert:</strong> Your current risk metrics indicate elevated portfolio risk. 
                Consider reducing position sizes or implementing stricter stop-loss rules.
              </AlertDescription>
            </Alert>
          )}

          <p className="text-xs text-slate-500 mt-4">
            Last calculated: {new Date(currentMetrics.calc_date).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
