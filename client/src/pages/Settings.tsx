
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, Bell, User } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const { logs, loading } = useAuditLog();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'CREATE': return '✅';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'LOGIN': return '🔑';
      default: return '📝';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'CREATE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'UPDATE': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'DELETE': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'LOGIN': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-slate-400">Manage your account, security, and preferences</p>
        </div>

        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Activity className="w-4 h-4" />
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-400 mb-2">🔒 Enterprise-Grade Security</h3>
                  <ul className="space-y-2 text-emerald-200 text-sm">
                    <li>• Row-Level Security (RLS) enabled on all data tables</li>
                    <li>• Automated audit logging for all actions</li>
                    <li>• Real-time risk monitoring and alerts</li>
                    <li>• Encrypted data storage and transmission</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2">🛡️ Compliance Features</h3>
                  <ul className="space-y-2 text-blue-200 text-sm">
                    <li>• FINRA-compliant data retention policies</li>
                    <li>• Immutable audit trail system</li>
                    <li>• Two-person authorization for sensitive operations</li>
                    <li>• Regular security assessments and updates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Audit Trail</CardTitle>
                <p className="text-slate-400">Complete history of account activities</p>
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
                    {logs.slice(0, 20).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getActionIcon(log.action_type)}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {log.action_type.toLowerCase()} {log.resource_type}
                              </span>
                              <Badge variant="outline" className={getActionColor(log.action_type)}>
                                {log.action_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {logs.length === 0 && (
                      <p className="text-center text-slate-400 py-8">
                        No audit logs available yet
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-400 mb-2">🔔 Smart Alerts</h3>
                    <p className="text-yellow-200 text-sm">
                      AI-powered notifications for risk warnings, pattern recognition, and trading opportunities.
                      Configure your alert preferences to stay informed without being overwhelmed.
                    </p>
                  </div>
                  
                  <p className="text-slate-400 text-sm">
                    Notification settings will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-400 mb-2">👤 Professional Profile</h3>
                    <p className="text-purple-200 text-sm">
                      Customize your trading profile with risk preferences, trading style, and professional credentials.
                      This helps our AI provide more personalized insights and recommendations.
                    </p>
                  </div>
                  
                  <p className="text-slate-400 text-sm">
                    Profile customization features will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
