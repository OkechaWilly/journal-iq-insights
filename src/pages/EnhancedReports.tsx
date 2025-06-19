
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ResponsiveWrapper } from '@/components/mobile/ResponsiveWrapper';
import { AdvancedChart } from '@/components/advanced-charts/AdvancedChart';
import { EquityCurve } from '@/components/advanced-charts/EquityCurve';
import { TradeTemplates } from '@/components/workflow/TradeTemplates';
import { JournalPrompts } from '@/components/workflow/JournalPrompts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTrades } from '@/hooks/useTrades';
import { useMonthlyPerformance } from '@/hooks/useMonthlyPerformance';

const EnhancedReports = () => {
  const { trades } = useTrades();
  const { monthlyData } = useMonthlyPerformance();
  
  // Mock data for demonstration
  const mockMarketData = [
    { timestamp: '2024-01-01', open: 100, high: 105, low: 98, close: 103, volume: 1000 },
    { timestamp: '2024-01-02', open: 103, high: 108, low: 102, close: 107, volume: 1200 },
    { timestamp: '2024-01-03', open: 107, high: 109, low: 104, close: 105, volume: 900 },
    { timestamp: '2024-01-04', open: 105, high: 112, low: 104, close: 110, volume: 1500 },
    { timestamp: '2024-01-05', open: 110, high: 115, low: 109, close: 113, volume: 1100 },
  ];

  const benchmarkData = [
    {
      label: 'Your Strategy',
      data: monthlyData.map(m => ({
        date: m.month,
        value: Number(m.total_pnl),
        drawdown: Math.random() * -5 // Mock drawdown
      })),
      color: '#3b82f6'
    },
    {
      label: 'SPY Benchmark',
      data: monthlyData.map(m => ({
        date: m.month,
        value: Math.random() * 1000 + 5000, // Mock SPY data
        drawdown: Math.random() * -3
      })),
      color: '#10b981'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Enhanced Analytics</h2>
            <p className="text-slate-400">Professional-grade trading analysis and workflow tools</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            Phase 2 Features
          </Badge>
        </div>

        <ResponsiveWrapper
          mobile={
            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="equity">Equity</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts" className="space-y-4">
                <AdvancedChart
                  type="candlestick"
                  data={mockMarketData}
                  overlays={[
                    { type: 'sma', period: 3, color: '#f59e0b' },
                    { type: 'volume' }
                  ]}
                  title="Market Analysis"
                  height={300}
                />
              </TabsContent>
              
              <TabsContent value="equity" className="space-y-4">
                <EquityCurve 
                  benchmarks={benchmarkData}
                  drawdownMode="toggle"
                  height={300}
                />
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-4">
                <TradeTemplates />
              </TabsContent>
              
              <TabsContent value="journal" className="space-y-4">
                <JournalPrompts
                  triggers={{
                    loss: ['What went wrong?', 'Was risk managed?'],
                    win: ['What worked well?', 'Repeatable pattern?'],
                    breakeven: ['Why no profit?', 'Market conditions?'],
                    streak: ['Overconfident?', 'Risk management?']
                  }}
                  tradeOutcome="win"
                />
              </TabsContent>
            </Tabs>
          }
          desktop={
            <div className="space-y-6">
              {/* Advanced Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdvancedChart
                  type="candlestick"
                  data={mockMarketData}
                  overlays={[
                    { type: 'sma', period: 3, color: '#f59e0b' },
                    { type: 'volume' }
                  ]}
                  title="Advanced Market Analysis"
                />
                
                <EquityCurve 
                  benchmarks={benchmarkData}
                  drawdownMode="toggle"
                />
              </div>

              {/* Workflow Tools Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TradeTemplates />
                
                <JournalPrompts
                  triggers={{
                    loss: [
                      'What went wrong with this trade?',
                      'Was risk properly managed?',
                      'Did you follow your trading plan?'
                    ],
                    win: [
                      'What worked well in this trade?',
                      'Was this a repeatable pattern?',
                      'Did you exit at the optimal time?'
                    ],
                    breakeven: [
                      'Why did the trade not reach target?',
                      'Was the setup as strong as expected?'
                    ],
                    streak: [
                      'Are you becoming overconfident?',
                      'Are you following proper risk management?'
                    ]
                  }}
                  tradeOutcome="win"
                  streakCount={3}
                />
              </div>

              {/* Performance Metrics */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Institutional-Grade Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">1.84</p>
                      <p className="text-slate-400 text-sm">Sharpe Ratio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">-5.6%</p>
                      <p className="text-slate-400 text-sm">Max Drawdown</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">6.52</p>
                      <p className="text-slate-400 text-sm">Calmar Ratio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-400">1.81</p>
                      <p className="text-slate-400 text-sm">Profit Factor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
    </Layout>
  );
};

export default EnhancedReports;
