import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format } from 'date-fns';
import { useMonthlyPerformance } from '@/hooks/useMonthlyPerformance';
import { useChartTheme } from '@/hooks/useChartTheme';
import type { InstitutionalTrade } from '@/types/trade';

interface PerformanceChartProps {
  trades?: InstitutionalTrade[];
}

const chartConfig = {
  pnl: {
    label: "P&L",
    color: "hsl(var(--chart-1))",
  },
};

export const PerformanceChart = ({ trades }: PerformanceChartProps) => {
  const { monthlyData, loading } = useMonthlyPerformance();
  const { theme, colors } = useChartTheme();

  if (loading) {
    return (
      <Card className="bg-card border-border card-shadow transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-card-foreground">Performance Chart</CardTitle>
          <CardDescription className="text-muted-foreground">Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-slate-900/30 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const chartData = monthlyData
    .map(data => ({
      month: format(new Date(data.month), 'MMM yyyy'),
      pnl: Number(data.total_pnl),
      trades: data.total_trades,
      winRate: data.total_trades > 0 ? (data.winning_trades / data.total_trades * 100).toFixed(1) : '0'
    }))
    .reverse(); // Show oldest to newest

  // Calculate cumulative P&L
  let cumulativePnL = 0;
  const cumulativeData = chartData.map(item => {
    cumulativePnL += item.pnl;
    return {
      ...item,
      cumulativePnL
    };
  });

  const maxPnL = Math.max(...cumulativeData.map(d => d.cumulativePnL));
  const minPnL = Math.min(...cumulativeData.map(d => d.cumulativePnL));
  const isPositive = cumulativePnL >= 0;

  return (
    <Card className="bg-card border-border card-shadow transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-card-foreground">Cumulative Performance</CardTitle>
        <CardDescription className="text-muted-foreground">
          Monthly P&L progression over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${isPositive ? 'text-profit' : 'text-loss'}`}>
                ${cumulativePnL.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Total Months</p>
              <p className="text-card-foreground text-xl font-semibold">{chartData.length}</p>
            </div>
          </div>
        </div>
        
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? "#10b981" : "#ef4444"} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? "#10b981" : "#ef4444"} 
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[minPnL * 1.1, maxPnL * 1.1]}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name) => [
                        `$${Number(value).toFixed(2)}`,
                        name === 'cumulativePnL' ? 'Cumulative P&L' : name
                      ]}
                    />
                  } 
                />
                <Area
                  type="monotone"
                  dataKey="cumulativePnL"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  fill="url(#pnlGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p>No performance data available</p>
              <p className="text-sm mt-1">Add some trades to see your performance chart</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
