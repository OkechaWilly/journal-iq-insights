import React from 'react';
import { Layout } from './Layout';
import { MetricsCards } from './MetricsCards';
import { PerformanceChart } from './PerformanceChart';
import { RecentTrades } from './RecentTrades';
import { QuickActions } from './QuickActions';
import { StreakTracker } from './StreakTracker';
import { EnhancedAnalyticsDashboard } from './analytics/EnhancedAnalyticsDashboard';
import { useTrades } from '@/hooks/useTrades';

export const Dashboard = () => {
  const { trades, metrics, loading } = useTrades();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  const recentTrades = trades.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard</h2>
            <p className="text-slate-400">Your trading performance overview</p>
          </div>
          <QuickActions />
        </div>

        {/* Add Streak Tracker */}
        <StreakTracker />

        <MetricsCards metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart trades={trades} />
          <RecentTrades trades={recentTrades} />
        </div>

        <EnhancedAnalyticsDashboard />
      </div>
    </Layout>
  );
};
