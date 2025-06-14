import React from "react";
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Target, Calendar, Award, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  // Mock analytics data
  const monthlyPerformance = [
    { month: "Jan", profit: 2400, loss: -800, trades: 45 },
    { month: "Feb", profit: 1800, loss: -1200, trades: 38 },
    { month: "Mar", profit: 3200, loss: -600, trades: 52 },
    { month: "Apr", profit: 2800, loss: -900, trades: 41 },
    { month: "May", profit: 3600, loss: -400, trades: 48 },
    { month: "Jun", profit: 2200, loss: -1100, trades: 35 }
  ];

  const tradeDistribution = [
    { name: "Stocks", value: 45, color: "#3b82f6" },
    { name: "Forex", value: 30, color: "#10b981" },
    { name: "Crypto", value: 20, color: "#f59e0b" },
    { name: "Options", value: 5, color: "#ef4444" }
  ];

  const winLossData = [
    { category: "Wins", count: 68, percentage: 62 },
    { category: "Losses", count: 42, percentage: 38 }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <p className="text-gray-600">Gain insights into your trading performance with detailed analytics and metrics.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </Button>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">62.0%</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={62} className="flex-1" />
                <span className="text-sm text-muted-foreground">68/110</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Win</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$342</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Loss</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$189</div>
              <p className="text-xs text-muted-foreground mt-1">
                -8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1.81</div>
              <p className="text-xs text-muted-foreground mt-1">
                Above average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly P&L Performance</CardTitle>
              <CardDescription>Profit and loss breakdown by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#10b981" />
                  <Bar dataKey="loss" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade Distribution</CardTitle>
              <CardDescription>Breakdown by asset type</CardDescription>
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
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {tradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Win/Loss Analysis</CardTitle>
              <CardDescription>Detailed breakdown of trade outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {winLossData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.category === 'Wins' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">{item.count} trades</span>
                    <Badge variant="outline" className={item.category === 'Wins' ? 'text-green-600' : 'text-red-600'}>
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Insights</CardTitle>
              <CardDescription>AI-generated insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">Strong Performance</h4>
                <p className="text-sm text-green-700 mt-1">Your win rate has improved by 8% this month. Keep following your current strategy.</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Risk Management</h4>
                <p className="text-sm text-yellow-700 mt-1">Consider reducing position size on crypto trades to minimize potential losses.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Best Trading Days</h4>
                <p className="text-sm text-blue-700 mt-1">Tuesday and Wednesday show your highest success rates.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
