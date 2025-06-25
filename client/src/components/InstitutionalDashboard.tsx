
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';
import { useTrades } from '@/hooks/useTrades';

interface InstitutionalDashboardProps {
  modules?: Array<{
    type: 'risk-thermometer' | 'strategy-matrix';
    metrics?: string[];
    refreshRate?: number;
    strategies?: string[];
    comparisonMetrics?: string[];
  }>;
  benchmarkOptions?: string[];
}

export const InstitutionalDashboard: React.FC<InstitutionalDashboardProps> = ({
  modules = [
    {
      type: 'risk-thermometer',
      metrics: ['var-95', 'expected-shortfall'],
      refreshRate: 30
    },
    {
      type: 'strategy-matrix',
      strategies: ['scalping', 'swing', 'position'],
      comparisonMetrics: ['sharpe', 'win-rate']
    }
  ],
  benchmarkOptions = ['SP500', 'Nasdaq100', 'SectorETFs']
}) => {
  const { currentMetrics, calculateRiskMetrics, getRiskLevel } = useRiskMetrics();
  const { trades } = useTrades();
  const [selectedBenchmark, setSelectedBenchmark] = useState('SP500');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      calculateRiskMetrics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, calculateRiskMetrics]);

  const riskThermometerModule = modules.find(m => m.type === 'risk-thermometer');
  const strategyMatrixModule = modules.find(m => m.type === 'strategy-matrix');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStrategyPerformance = (strategy: string) => {
    const strategyTrades = trades.filter(t => 
      t.tags?.includes(strategy) || 
      (strategy === 'scalping' && getDuration(t) < 3600000) ||
      (strategy === 'swing' && getDuration(t) >= 3600000 && getDuration(t) < 86400000) ||
      (strategy === 'position' && getDuration(t) >= 86400000)
    );

    if (strategyTrades.length === 0) return { winRate: 0, sharpe: 0, totalTrades: 0 };

    const closedTrades = strategyTrades.filter(t => t.exit_price);
    const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
    const winRate = closedTrades.length > 0 ? winningTrades.length / closedTrades.length : 0;

    // Simplified Sharpe calculation
    const returns = closedTrades.map(t => calculatePnL(t));
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpe = stdDev > 0 ? avgReturn / stdDev : 0;

    return { winRate, sharpe, totalTrades: strategyTrades.length };
  };

  const getDuration = (trade: any) => {
    if (!trade.exit_price) return 0;
    return new Date(trade.updated_at).getTime() - new Date(trade.created_at).getTime();
  };

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price) return 0;
    return trade.direction === 'long'
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price) * trade.quantity;
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Institutional Dashboard
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {benchmarkOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Auto Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Risk Thermometer */}
        {riskThermometerModule && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Thermometer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMetrics && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Overall Risk Level</span>
                      <Badge className={getRiskColor(getRiskLevel(currentMetrics))}>
                        {getRiskLevel(currentMetrics).toUpperCase()}
                      </Badge>
                    </div>

                    {riskThermometerModule.metrics?.includes('var-95') && currentMetrics.var_95 && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Value at Risk (95%)</span>
                          <span className="text-sm text-red-400">
                            ${Math.abs(currentMetrics.var_95).toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(Math.abs(currentMetrics.var_95) / 1000 * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {riskThermometerModule.metrics?.includes('expected-shortfall') && currentMetrics.expected_shortfall && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Expected Shortfall</span>
                          <span className="text-sm text-orange-400">
                            ${Math.abs(currentMetrics.expected_shortfall).toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(Math.abs(currentMetrics.expected_shortfall) / 1500 * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">
                            {currentMetrics.sharpe_ratio?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400">Sharpe Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">
                            {currentMetrics.max_drawdown ? `${(currentMetrics.max_drawdown * 100).toFixed(1)}%` : 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400">Max Drawdown</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!currentMetrics && (
                  <div className="text-center py-6 text-slate-400">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Insufficient data for risk analysis</p>
                    <p className="text-sm">Add more completed trades</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategy Matrix */}
        {strategyMatrixModule && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Strategy Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyMatrixModule.strategies?.map(strategy => {
                  const performance = getStrategyPerformance(strategy);
                  return (
                    <div key={strategy} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white capitalize">
                          {strategy} Strategy
                        </h4>
                        <Badge variant="outline" className="text-slate-300">
                          {performance.totalTrades} trades
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {strategyMatrixModule.comparisonMetrics?.includes('win-rate') && (
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {(performance.winRate * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-400">Win Rate</div>
                          </div>
                        )}

                        {strategyMatrixModule.comparisonMetrics?.includes('sharpe') && (
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {performance.sharpe.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-400">Sharpe Ratio</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-slate-600 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${performance.winRate * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {trades.length === 0 && (
                  <div className="text-center py-6 text-slate-400">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No strategy data available</p>
                    <p className="text-sm">Start adding trades to see performance</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Benchmark Comparison */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            Performance vs {selectedBenchmark}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Benchmark comparison coming soon</p>
            <p className="text-sm">Real-time market data integration in development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
