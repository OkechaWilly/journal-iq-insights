
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { calculateAdvancedMetrics } from '@/utils/advancedAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color = 'text-blue-400' }) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedAnalyticsDashboard: React.FC = () => {
  const { trades, metrics } = useTrades();
  const advancedMetrics = calculateAdvancedMetrics(trades);

  // Generate equity curve data
  const equityCurveData = React.useMemo(() => {
    let runningTotal = 0;
    return trades
      .filter(t => t.exit_price)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((trade, index) => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        runningTotal += pnl;
        return {
          trade: index + 1,
          pnl: runningTotal,
          date: new Date(trade.created_at).toLocaleDateString()
        };
      });
  }, [trades]);

  // Generate monthly performance data
  const monthlyData = React.useMemo(() => {
    const monthlyMap = new Map();
    trades
      .filter(t => t.exit_price)
      .forEach(trade => {
        const month = new Date(trade.created_at).toISOString().slice(0, 7);
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { month, pnl: 0, trades: 0 });
        }
        monthlyMap.get(month).pnl += pnl;
        monthlyMap.get(month).trades += 1;
      });
    
    return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [trades]);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Win Rate"
          value={`${metrics?.win_rate?.toFixed(1) || 0}%`}
          icon={Target}
          color="text-emerald-400"
        />
        <MetricCard
          title="Total P&L"
          value={`$${metrics?.total_pnl?.toFixed(2) || 0}`}
          icon={DollarSign}
          color="text-blue-400"
        />
        <MetricCard
          title="Sharpe Ratio"
          value={advancedMetrics.sharpeRatio.toFixed(2)}
          icon={TrendingUp}
          color="text-purple-400"
        />
        <MetricCard
          title="Max Drawdown"
          value={`${advancedMetrics.maxDrawdown.toFixed(1)}%`}
          icon={TrendingDown}
          color="text-red-400"
        />
      </div>

      {/* Advanced Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Advanced Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Profit Factor</p>
              <p className="text-white text-xl font-bold">{advancedMetrics.profitFactor.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Win Streak</p>
              <p className="text-white text-xl font-bold">{advancedMetrics.winStreak}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Avg Win</p>
              <p className="text-emerald-400 text-xl font-bold">${advancedMetrics.averageWin.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Avg Loss</p>
              <p className="text-red-400 text-xl font-bold">${advancedMetrics.averageLoss.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={equityCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="trade" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pnl"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pnl"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
