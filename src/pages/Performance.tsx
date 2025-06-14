
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, BarChart3, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const Performance = () => {
  const [timeframe, setTimeframe] = useState("6m");

  // Mock performance data
  const equityCurveData = [
    { date: "Jan 1", balance: 10000, drawdown: 0 },
    { date: "Jan 15", balance: 10450, drawdown: -2.1 },
    { date: "Feb 1", balance: 10800, drawdown: -1.5 },
    { date: "Feb 15", balance: 10200, drawdown: -5.6 },
    { date: "Mar 1", balance: 11200, drawdown: 0 },
    { date: "Mar 15", balance: 11800, drawdown: 0 },
    { date: "Apr 1", balance: 11400, drawdown: -3.4 },
    { date: "Apr 15", balance: 12200, drawdown: 0 },
    { date: "May 1", balance: 12800, drawdown: 0 },
    { date: "May 15", balance: 12100, drawdown: -5.5 },
    { date: "Jun 1", balance: 13200, drawdown: 0 },
    { date: "Jun 15", balance: 13650, drawdown: 0 }
  ];

  const monthlyReturns = [
    { month: "Jan", return: 4.5 },
    { month: "Feb", return: 3.5 },
    { month: "Mar", return: 7.2 },
    { month: "Apr", return: 2.1 },
    { month: "May", return: 5.8 },
    { month: "Jun", return: 3.4 }
  ];

  const performanceMetrics = [
    { label: "Total Return", value: "36.5%", change: "+2.1%", positive: true },
    { label: "Sharpe Ratio", value: "1.84", change: "+0.12", positive: true },
    { label: "Max Drawdown", value: "-5.6%", change: "-1.2%", positive: true },
    { label: "Calmar Ratio", value: "6.52", change: "+0.8", positive: true },
    { label: "Win Rate", value: "62%", change: "+5%", positive: true },
    { label: "Profit Factor", value: "1.81", change: "+0.15", positive: true }
  ];

  const currentBalance = 13650;
  const initialBalance = 10000;
  const totalReturn = ((currentBalance - initialBalance) / initialBalance) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
          <p className="text-gray-600">Track your equity curve, statistics, and performance over time.</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentBalance.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">
              +${(currentBalance - initialBalance).toLocaleString()} ({totalReturn.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+3.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              June 2024
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+7.2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              March 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>Your account balance progression over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={equityCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Balance']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics & Monthly Returns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key statistical measures of your trading performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{metric.label}</span>
                  <div className="text-right">
                    <div className="font-bold text-lg">{metric.value}</div>
                    <Badge 
                      variant="outline" 
                      className={metric.positive ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Returns</CardTitle>
            <CardDescription>Month-by-month return percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Return']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="return" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
          <CardDescription>Understand your risk exposure and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-gray-600">Value at Risk (VaR)</div>
              <div className="text-2xl font-bold text-red-600">-2.8%</div>
              <div className="text-xs text-gray-500">95% confidence</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-gray-600">Beta</div>
              <div className="text-2xl font-bold text-blue-600">0.72</div>
              <div className="text-xs text-gray-500">vs S&P 500</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-gray-600">Volatility</div>
              <div className="text-2xl font-bold text-orange-600">12.4%</div>
              <div className="text-xs text-gray-500">Annualized</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-gray-600">Correlation</div>
              <div className="text-2xl font-bold text-purple-600">0.68</div>
              <div className="text-xs text-gray-500">Market correlation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
