
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from '@/components/Layout';
import { useTrades } from '@/hooks/useTrades';
import { useMonthlyPerformance } from '@/hooks/useMonthlyPerformance';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, PieChart as PieChartIcon, Activity, Shield, Calendar, Download } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { calculatePnL } from '@/utils/advancedAnalytics';

const Performance = () => {
  const [timeframe, setTimeframe] = useState('6m');
  const { trades, metrics } = useTrades();
  const { monthlyData } = useMonthlyPerformance();
  const { riskMetrics } = useRiskMetrics();

  // Enhanced color palette matching design
  const colors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
    slate: '#64748b'
  };

  // Calculate performance metrics
  const totalPnL = trades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const winningTrades = trades.filter(trade => calculatePnL(trade) > 0);
  const losingTrades = trades.filter(trade => calculatePnL(trade) < 0);
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0) / losingTrades.length : 0;
  const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

  // Prepare chart data
  const equityData = monthlyData.map(month => ({
    month: format(new Date(month.month), 'MMM yyyy'),
    pnl: Number(month.total_pnl),
    cumulative: monthlyData.slice(0, monthlyData.indexOf(month) + 1).reduce((sum, m) => sum + Number(m.total_pnl), 0),
    trades: month.total_trades
  }));

  const winLossData = [
    { name: 'Winning Trades', value: winningTrades.length, color: colors.success },
    { name: 'Losing Trades', value: losingTrades.length, color: colors.danger },
    { name: 'Break-even', value: trades.filter(t => calculatePnL(t) === 0).length, color: colors.slate }
  ];

  const monthlyPnLData = monthlyData.map(month => ({
    month: format(new Date(month.month), 'MMM'),
    pnl: Number(month.total_pnl),
    wins: month.winning_trades,
    total: month.total_trades
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('$') ? `$${entry.value.toFixed(2)}` : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
            <p className="text-slate-400">Comprehensive analysis of your trading performance and risk metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="1m" className="text-white hover:bg-slate-700">1M</SelectItem>
                <SelectItem value="3m" className="text-white hover:bg-slate-700">3M</SelectItem>
                <SelectItem value="6m" className="text-white hover:bg-slate-700">6M</SelectItem>
                <SelectItem value="1y" className="text-white hover:bg-slate-700">1Y</SelectItem>
                <SelectItem value="all" className="text-white hover:bg-slate-700">All</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${totalPnL >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <DollarSign className={`w-6 h-6 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Win Rate</p>
                  <p className={`text-2xl font-bold ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {winRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Profit Factor</p>
                  <p className={`text-2xl font-bold ${profitFactor >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {profitFactor.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Trades</p>
                  <p className="text-2xl font-bold text-white">{trades.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="equity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 rounded-lg p-1">
            <TabsTrigger 
              value="equity" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Equity Curve
            </TabsTrigger>
            <TabsTrigger 
              value="distribution" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
            >
              <PieChartIcon className="w-4 h-4 mr-2" />
              Distribution
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Monthly
            </TabsTrigger>
            <TabsTrigger 
              value="risk" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
            >
              <Shield className="w-4 h-4 mr-2" />
              Risk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equity" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Equity Curve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={equityData}>
                    <defs>
                      <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke={colors.primary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPnL)"
                      name="Cumulative P&L"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-400" />
                    Win/Loss Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={winLossData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {winLossData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <div>
                        <p className="text-emerald-400 font-medium">Average Win</p>
                        <p className="text-white text-xl font-bold">${avgWin.toFixed(2)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div>
                        <p className="text-red-400 font-medium">Average Loss</p>
                        <p className="text-white text-xl font-bold">${avgLoss.toFixed(2)}</p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div>
                        <p className="text-blue-400 font-medium">Largest Win</p>
                        <p className="text-white text-xl font-bold">
                          ${Math.max(...trades.map(t => calculatePnL(t))).toFixed(2)}
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyPnLData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="pnl" 
                      fill={colors.primary}
                      name="Monthly P&L"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {riskMetrics?.sharpe_ratio?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Max Drawdown</p>
                      <p className="text-2xl font-bold text-red-400">
                        {riskMetrics?.max_drawdown ? `${(riskMetrics.max_drawdown * 100).toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10">
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Volatility</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {riskMetrics?.volatility ? `${(riskMetrics.volatility * 100).toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Performance;
