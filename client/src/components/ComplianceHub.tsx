
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';

interface ComplianceHubProps {
  features?: string[];
  standards?: string[];
}

export const ComplianceHub: React.FC<ComplianceHubProps> = ({
  features = [
    'trade-reconstruction',
    'communication-archiving',
    'two-person-rule',
    'regulatory-reporting'
  ],
  standards = [
    'FINRA-4511',
    'MiFID-II',
    'SEC-17a4'
  ]
}) => {
  const { logs, loading } = useAuditLog();
  const [activeReports, setActiveReports] = useState<string[]>([]);

  const getFeatureStatus = (feature: string) => {
    switch (feature) {
      case 'trade-reconstruction':
        return { status: 'active', description: 'All trades automatically logged with full reconstruction capability' };
      case 'communication-archiving':
        return { status: 'pending', description: 'Communication archiving system in development' };
      case 'two-person-rule':
        return { status: 'active', description: 'Two-person authorization enabled for sensitive operations' };
      case 'regulatory-reporting':
        return { status: 'active', description: 'Automated regulatory reporting framework operational' };
      default:
        return { status: 'inactive', description: 'Feature not configured' };
    }
  };

  const getStandardCompliance = (standard: string) => {
    switch (standard) {
      case 'FINRA-4511':
        return { level: 'compliant', description: 'Order audit trail requirements met' };
      case 'MiFID-II':
        return { level: 'partial', description: 'Transaction reporting partially implemented' };
      case 'SEC-17a4':
        return { level: 'compliant', description: 'Records preservation requirements satisfied' };
      default:
        return { level: 'unknown', description: 'Compliance status unknown' };
    }
  };

  const generateReport = (type: string) => {
    setActiveReports(prev => [...prev, type]);
    // Simulate report generation
    setTimeout(() => {
      setActiveReports(prev => prev.filter(r => r !== type));
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending':
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'pending':
      case 'partial':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance & Regulatory Hub
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="features" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="standards" className="gap-2">
            <Shield className="w-4 h-4" />
            Standards
          </TabsTrigger>
          <TabsTrigger value="reporting" className="gap-2">
            <FileText className="w-4 h-4" />
            Reporting
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Users className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(feature => {
              const featureStatus = getFeatureStatus(feature);
              return (
                <Card key={feature} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg capitalize">
                        {feature.replace('-', ' ')}
                      </CardTitle>
                      <Badge className={getStatusColor(featureStatus.status)}>
                        {getStatusIcon(featureStatus.status)}
                        <span className="ml-1">{featureStatus.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm">
                      {featureStatus.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="standards">
          <div className="space-y-4">
            {standards.map(standard => {
              const compliance = getStandardCompliance(standard);
              return (
                <Card key={standard} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{standard}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {compliance.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(compliance.level)}>
                        {getStatusIcon(compliance.level)}
                        <span className="ml-1">{compliance.level}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reporting">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: 'trade-blotter', title: 'Trade Blotter Report', description: 'Complete trading activity summary' },
              { type: 'risk-exposure', title: 'Risk Exposure Report', description: 'Current risk positions and limits' },
              { type: 'compliance-audit', title: 'Compliance Audit', description: 'Regulatory compliance verification' },
              { type: 'performance-attribution', title: 'Performance Attribution', description: 'Detailed performance breakdown' },
              { type: 'exception-report', title: 'Exception Report', description: 'Policy violations and anomalies' },
              { type: 'regulatory-filing', title: 'Regulatory Filing', description: 'Required regulatory submissions' }
            ].map(report => (
              <Card key={report.type} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">
                    {report.description}
                  </p>
                  <Button
                    onClick={() => generateReport(report.type)}
                    disabled={activeReports.includes(report.type)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4" />
                    {activeReports.includes(report.type) ? 'Generating...' : 'Generate Report'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Audit Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4">
                      <div className="h-4 w-4 bg-slate-700 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {log.action_type} {log.resource_type}
                          </div>
                          <p className="text-sm text-slate-400">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-slate-300">
                        {log.action_type}
                      </Badge>
                    </div>
                  ))}
                  
                  {logs.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No audit logs available</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
