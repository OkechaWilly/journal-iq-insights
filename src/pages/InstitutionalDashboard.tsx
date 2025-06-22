
import React from 'react';
import { Layout } from '@/components/Layout';
import { InstitutionalDashboard } from '@/components/InstitutionalDashboard';
import { ComplianceHub } from '@/components/ComplianceHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Shield, Activity, TrendingUp } from 'lucide-react';

const InstitutionalDashboardPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Institutional Trading Platform
            </h2>
            <p className="text-slate-400">Wall Street-grade analytics and compliance tools</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="w-4 h-4" />
              Compliance Hub
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Suite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <InstitutionalDashboard
              modules={[
                {
                  type: 'risk-thermometer',
                  metrics: ['var-95', 'expected-shortfall'],
                  refreshRate: 30
                },
                {
                  type: 'strategy-matrix',
                  strategies: ['scalping', 'swing', 'position'],
                  comparisonMetrics: ['sharpe', 'win-rate']
                }
              ]}
              benchmarkOptions={['SP500', 'Nasdaq100', 'SectorETFs']}
            />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceHub
              features={[
                'trade-reconstruction',
                'communication-archiving',
                'two-person-rule',
                'regulatory-reporting'
              ]}
              standards={[
                'FINRA-4511',
                'MiFID-II',
                'SEC-17a4'
              ]}
            />
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Attribution</h3>
                <div className="text-center py-12 text-slate-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Advanced performance attribution coming soon</p>
                  <p className="text-sm">Multi-factor risk model integration</p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Factor Analysis</h3>
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Factor exposure analysis coming soon</p>
                  <p className="text-sm">Style and sector attribution</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InstitutionalDashboardPage;
