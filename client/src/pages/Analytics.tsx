
import React from "react";
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Target, Calendar, Award, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useTrades } from '@/hooks/useTrades';
import { format, startOfMonth, isSameMonth } from 'date-fns';

const Analytics = () => {
  const { trades, metrics, loading } = useTrades();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading analytics...</div>
        </div>
      </Layout>
    );
  }

  // Calculate analytics from real data
  const closedTrades = trades.filter(trade => trade.exit_price);
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter(trade => {
    const pnl = trade.direction === 'long' 
      ? (trade.exit_price! - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price!) * trade.quantity;
    return pnl > 0;
  });
  
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  
  const avgWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        return sum + pnl;
      }, 0) / winningTrades.length
    : 0;

  const losingTrades = closedTrades.filter(trade => {
    const pnl = trade.direction === 'long' 
      ? (trade.exit_price! - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price!) * trade.quantity;
    return pnl < 0;
  });

  const avgLoss = losingTrades.length > 0 
    ? Math.abs(losingTrades.reduce((sum, trade) => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        return sum + pnl;
      }, 0)) / losingTrades.length
    : 0;

  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  // Monthly performance data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStart = startOfMonth(date);
    
    const monthTrades = closedTrades.filter(trade => 
      isSameMonth(new Date(trade.created_at), monthStart)
    );
    
    const profit = monthTrades
      .filter(trade => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        return pnl > 0;
      })
      .reduce((sum, trade) => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        return sum + pnl;
      }, 0);
    
    const loss = Math.abs(monthTrades
      .filter(trade => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        return pnl < 0;
      })
      .reduce((sum, trade) => {
        const pnl = trade.direction === 'long' 
          ? (trade.exit_price! - trade.entry_price) * trade.quantity
          : (trade.entry_price - trade.exit_price!) * trade.quantity;
        return sum + pnl;
      }, 0));

    return {
      month: format(monthStart, 'MMM'),
      profit: Math.round(profit),
      loss: -Math.round(loss),
      trades: monthTrades.length
    };
  });

  const tradeDistribution = [
    { name: "Long", value: trades.filter(t => t.direction === 'long').length, color: "#10b981" },
    { name: "Short", value: trades.filter(t => t.direction === 'short').length, color: "#ef4444" }
  ];

  const winLossData = [
    { category: "Wins", count: winningTrades.length, percentage: Math.round(winRate) },
    { category: "Losses", count: losingTrades.length, percentage: Math.round(100 - winRate) }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Analytics</h2>
            <p className="text-slate-400 mt-1">Gain insights into your trading performance with detailed analytics and metrics.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </Button>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{winRate.toFixed(1)}%</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={winRate} className="flex-1" />
                <span className="text-sm text-slate-400">{winningTrades.length}/{totalTrades}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Win</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">${avgWin.toFixed(0)}</div>
              <p className="text-xs text-slate-400 mt-1">
                Per winning trade
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Loss</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">${avgLoss.toFixed(0)}</div>
              <p className="text-xs text-slate-400 mt-1">
                Per losing trade
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Profit Factor</CardTitle>
              <Award className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{profitFactor.toFixed(2)}</div>
              <p className="text-xs text-slate-400 mt-1">
                {profitFactor > 1 ? "Profitable" : "Needs improvement"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Monthly P&L Performance</CardTitle>
              <CardDescription className="text-slate-400">Profit and loss breakdown by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="profit" fill="#10b981" />
                  <Bar dataKey="loss" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Trade Distribution</CardTitle>
              <CardDescription className="text-slate-400">Breakdown by direction</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {tradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Win/Loss Analysis</CardTitle>
              <CardDescription className="text-slate-400">Detailed breakdown of trade outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {winLossData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.category === 'Wins' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-medium text-white">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-400">{item.count} trades</span>
                    <Badge variant="outline" className={`${item.category === 'Wins' ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Trading Insights</CardTitle>
              <CardDescription className="text-slate-400">AI-generated insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {winRate >= 60 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <h4 className="font-medium text-emerald-400">Strong Performance</h4>
                  <p className="text-sm text-emerald-300 mt-1">Your win rate of {winRate.toFixed(1)}% is excellent. Keep following your current strategy.</p>
                </div>
              )}
              {profitFactor < 1 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="font-medium text-yellow-400">Risk Management</h4>
                  <p className="text-sm text-yellow-300 mt-1">Your profit factor is below 1. Consider reducing position sizes or improving your exit strategy.</p>
                </div>
              )}
              {totalTrades > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-medium text-blue-400">Trade Activity</h4>
                  <p className="text-sm text-blue-300 mt-1">You have completed {totalTrades} trades. {totalTrades < 20 ? 'Consider increasing your sample size for better statistics.' : 'Good sample size for reliable analytics.'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
