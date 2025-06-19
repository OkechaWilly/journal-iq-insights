
import React, { useState } from "react";
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, BarChart3, TrendingUp, Filter, Clock } from "lucide-react";
import { useTrades } from '@/hooks/useTrades';
import { useMonthlyPerformance } from '@/hooks/useMonthlyPerformance';
import { exportTradesToCSV, exportPerformanceReport } from '@/utils/csvExport';
import { calculateAdvancedMetrics, generateTradeInsights } from '@/utils/advancedAnalytics';
import { AdvancedAnalyticsCard } from '@/components/AdvancedAnalyticsCard';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { trades, loading: tradesLoading } = useTrades();
  const { monthlyData, loading: monthlyLoading } = useMonthlyPerformance();
  const { toast } = useToast();

  const reportTemplates = [
    {
      id: "performance",
      title: "Performance Report",
      description: "Comprehensive analysis of trading performance, P&L, and key metrics",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "monthly",
      title: "Monthly Summary",
      description: "Month-by-month breakdown of trades, wins, losses, and statistics",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "analytics",
      title: "Analytics Report",
      description: "Deep dive into trading patterns, risk analysis, and insights",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "trades",
      title: "Trades Export",
      description: "Complete trade log with all details for external analysis",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const getFilteredTrades = () => {
    if (!dateRange || dateRange === 'all') return trades;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (dateRange) {
      case 'last30':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'thisMonth':
        cutoffDate.setDate(1);
        break;
      case 'lastMonth':
        cutoffDate.setMonth(now.getMonth() - 1);
        cutoffDate.setDate(1);
        break;
      case 'thisQuarter':
        cutoffDate.setMonth(Math.floor(now.getMonth() / 3) * 3);
        cutoffDate.setDate(1);
        break;
      case 'lastQuarter':
        cutoffDate.setMonth(Math.floor(now.getMonth() / 3) * 3 - 3);
        cutoffDate.setDate(1);
        break;
      case 'thisYear':
        cutoffDate.setMonth(0);
        cutoffDate.setDate(1);
        break;
      default:
        return trades;
    }
    
    return trades.filter(trade => new Date(trade.created_at) >= cutoffDate);
  };

  const handleGenerateReport = async () => {
    if (!reportType || !dateRange) {
      toast({
        title: "Missing Information",
        description: "Please select both report type and date range",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const filteredTrades = getFilteredTrades();
      const dateRangeText = dateRange.replace(/([A-Z])/g, ' $1').toLowerCase();
      
      switch (reportType) {
        case 'performance':
          exportPerformanceReport(
            filteredTrades, 
            monthlyData,
            `performance-report-${dateRangeText}-${new Date().toISOString().split('T')[0]}.csv`
          );
          break;
        case 'trades':
          exportTradesToCSV(
            filteredTrades,
            `trades-export-${dateRangeText}-${new Date().toISOString().split('T')[0]}.csv`
          );
          break;
        case 'monthly':
          const monthlyCSV = monthlyData.map(data => [
            data.month,
            data.total_trades,
            data.winning_trades,
            `$${data.total_pnl.toFixed(2)}`,
            `$${data.avg_pnl.toFixed(2)}`
          ]);
          
          const csvContent = [
            'Month,Total Trades,Winning Trades,Total P&L,Average P&L',
            ...monthlyCSV.map(row => row.join(','))
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `monthly-summary-${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          break;
        default:
          exportTradesToCSV(filteredTrades);
      }
      
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = async (templateId: string) => {
    setReportType(templateId);
    setDateRange('thisYear');
    
    // Trigger generation after state updates
    setTimeout(() => {
      const event = { reportType: templateId, dateRange: 'thisYear' };
      handleGenerateReport();
    }, 100);
  };

  const filteredTrades = getFilteredTrades();
  const metrics = calculateAdvancedMetrics(filteredTrades);
  const insights = generateTradeInsights(filteredTrades);

  if (tradesLoading || monthlyLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-40 bg-slate-700 rounded"></div>
              <div className="h-40 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
            <p className="text-slate-400">Generate comprehensive reports and analyze your trading performance with advanced metrics.</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            {trades.length} Total Trades
          </Badge>
        </div>

        {/* Advanced Analytics */}
        {trades.length > 0 && (
          <AdvancedAnalyticsCard metrics={metrics} insights={insights} />
        )}

        {/* Report Generator */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Generate New Report</CardTitle>
            <CardDescription className="text-slate-400">Create customized reports for your trading analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="performance" className="text-white hover:bg-slate-700">Performance Report</SelectItem>
                    <SelectItem value="monthly" className="text-white hover:bg-slate-700">Monthly Summary</SelectItem>
                    <SelectItem value="analytics" className="text-white hover:bg-slate-700">Analytics Report</SelectItem>
                    <SelectItem value="trades" className="text-white hover:bg-slate-700">Trades Export</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="last30" className="text-white hover:bg-slate-700">Last 30 Days</SelectItem>
                    <SelectItem value="thisMonth" className="text-white hover:bg-slate-700">This Month</SelectItem>
                    <SelectItem value="lastMonth" className="text-white hover:bg-slate-700">Last Month</SelectItem>
                    <SelectItem value="thisQuarter" className="text-white hover:bg-slate-700">This Quarter</SelectItem>
                    <SelectItem value="lastQuarter" className="text-white hover:bg-slate-700">Last Quarter</SelectItem>
                    <SelectItem value="thisYear" className="text-white hover:bg-slate-700">This Year</SelectItem>
                    <SelectItem value="all" className="text-white hover:bg-slate-700">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerateReport} 
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              disabled={!reportType || !dateRange || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card key={template.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-slate-700`}>
                      <IconComponent className={`w-6 h-6 text-blue-400`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">{template.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{template.description}</p>
                      <Button 
                        size="sm" 
                        className="mt-3 gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleQuickGenerate(template.id)}
                        disabled={isGenerating}
                      >
                        <Download className="w-3 h-3" />
                        Quick Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Summary */}
        {filteredTrades.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Current Period Summary</CardTitle>
              <CardDescription className="text-slate-400">
                Overview of selected date range performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{filteredTrades.length}</p>
                  <p className="text-slate-400 text-sm">Total Trades</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{filteredTrades.filter(t => t.exit_price).length}</p>
                  <p className="text-slate-400 text-sm">Closed Trades</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${metrics.expectancy >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${metrics.expectancy}
                  </p>
                  <p className="text-slate-400 text-sm">Expectancy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{metrics.sharpeRatio}</p>
                  <p className="text-slate-400 text-sm">Sharpe Ratio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
