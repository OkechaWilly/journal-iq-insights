
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
import { Separator } from "@/components/ui/separator";
import { useTrades } from '@/hooks/useTrades';
import { useMonthlyPerformance } from '@/hooks/useMonthlyPerformance';
import { BarChart3, TrendingUp, Brain, Clipboard, FileText, Download } from 'lucide-react';

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
        drawdown: Math.random() * -5
      })),
      color: '#3b82f6'
    },
    {
      label: 'SPY Benchmark',
      data: monthlyData.map(m => ({
        date: m.month,
        value: Math.random() * 1000 + 5000,
        drawdown: Math.random() * -3
      })),
      color: '#10b981'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">Enhanced Analytics</h1>
            <p className="text-slate-400">Professional-grade trading analysis and workflow tools</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 px-3 py-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              Phase 2 Features
            </Badge>
            <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <ResponsiveWrapper
          mobile={
            <div className="space-y-6">
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 rounded-lg p-1">
                  <TabsTrigger 
                    value="charts" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Charts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="equity" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Equity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
                  >
                    <Clipboard className="w-4 h-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger 
                    value="journal" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 transition-all"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Journal
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="charts" className="space-y-4 mt-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Market Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="equity" className="space-y-4 mt-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Equity Curve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EquityCurve 
                        benchmarks={benchmarkData}
                        drawdownMode="toggle"
                        height={300}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="templates" className="space-y-4 mt-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clipboard className="w-5 h-5 text-purple-400" />
                        Trade Templates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TradeTemplates />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="journal" className="space-y-4 mt-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        Journal Prompts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <JournalPrompts
                        triggers={{
                          loss: ['What went wrong?', 'Was risk managed?'],
                          win: ['What worked well?', 'Repeatable pattern?'],
                          breakeven: ['Why no profit?', 'Market conditions?'],
                          streak: ['Overconfident?', 'Risk management?']
                        }}
                        tradeOutcome="win"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          }
          desktop={
            <div className="space-y-8">
              {/* Charts Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Advanced Charts & Analysis</h2>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Market Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AdvancedChart
                        type="candlestick"
                        data={mockMarketData}
                        overlays={[
                          { type: 'sma', period: 3, color: '#f59e0b' },
                          { type: 'volume' }
                        ]}
                        title="Advanced Market Analysis"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Equity Curve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EquityCurve 
                        benchmarks={benchmarkData}
                        drawdownMode="toggle"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Workflow Tools Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">Workflow & Intelligence Tools</h2>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clipboard className="w-5 h-5 text-purple-400" />
                        Trade Templates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TradeTemplates />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Intelligent Journal Prompts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Performance Metrics Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-semibold text-white">Institutional-Grade Metrics</h2>
                </div>
                
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div className="text-center space-y-2">
                        <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <p className="text-3xl font-bold text-emerald-400">1.84</p>
                          <p className="text-slate-400 text-sm font-medium">Sharpe Ratio</p>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                          <p className="text-3xl font-bold text-red-400">-5.6%</p>
                          <p className="text-slate-400 text-sm font-medium">Max Drawdown</p>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <p className="text-3xl font-bold text-purple-400">6.52</p>
                          <p className="text-slate-400 text-sm font-medium">Calmar Ratio</p>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                          <p className="text-3xl font-bold text-orange-400">1.81</p>
                          <p className="text-slate-400 text-sm font-medium">Profit Factor</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          }
        />
      </div>
    </Layout>
  );
};

export default EnhancedReports;
