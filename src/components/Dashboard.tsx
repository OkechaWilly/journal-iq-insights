
import React from 'react';
import { MetricsCards } from '@/components/MetricsCards';
import { PerformanceChart } from '@/components/PerformanceChart';
import { RecentTrades } from '@/components/RecentTrades';
import { QuickActions } from '@/components/QuickActions';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome back! Here's your trading overview.</p>
        </div>
        <QuickActions />
      </div>
      
      <MetricsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <RecentTrades />
      </div>
    </div>
  );
};
