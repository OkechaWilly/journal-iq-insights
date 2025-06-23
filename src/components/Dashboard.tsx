
import React from 'react';
import { MetricsCards } from '@/components/MetricsCards';
import { PerformanceChart } from '@/components/PerformanceChart';
import { RecentTrades } from '@/components/RecentTrades';
import { QuickActions } from '@/components/QuickActions';
import { AIAnalyzer } from '@/components/AIAnalyzer';
import { RiskDashboard } from '@/components/RiskDashboard';
import { TradingInsights } from '@/components/dashboard/TradingInsights';
import { TradeAnalyzer } from '@/components/ai/TradeAnalyzer';
import { EnhancedAnalyticsDashboard } from '@/components/analytics/EnhancedAnalyticsDashboard';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Dashboard</h2>
          <p className="text-slate-400">AI-powered insights and professional risk management</p>
        </div>
        <QuickActions />
      </div>
      
      <TradingInsights />
      
      <EnhancedAnalyticsDashboard />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PerformanceChart />
        <RecentTrades />
      </div>

      <TradeAnalyzer />

      <AIAnalyzer />
      
      <RiskDashboard />
    </div>
  );
};
