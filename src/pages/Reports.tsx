
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useTrades } from '@/hooks/useTrades';
import { downloadReport } from '@/lib/reportGenerator';
import { useToast } from '@/hooks/use-toast';
import { VirtualizedTradeTable } from '@/components/VirtualizedTradeTable';

const Reports = () => {
  const { trades, metrics } = useTrades();
  const { toast } = useToast();
  
  const [reportTitle, setReportTitle] = useState('Trading Performance Report');
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAIInsights, setIncludeAIInsights] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.created_at);
    return tradeDate >= startDate && tradeDate <= endDate;
  });

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      await downloadReport(filteredTrades, metrics, {
        title: reportTitle,
        dateRange: { start: startDate, end: endDate },
        includeCharts,
        includeAIInsights,
      });

      toast({
        title: "Report Generated",
        description: "Your trading report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Reports</h2>
          <p className="text-slate-400">Generate comprehensive trading performance reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <Card className="bg-slate-800/50 border-slate-700 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Report Title</Label>
                <Input
                  id="title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-white">Date Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal bg-slate-800 border-slate-600 text-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "MMM dd, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal bg-slate-800 border-slate-600 text-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, "MMM dd, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Report Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts"
                    checked={includeCharts}
                    onCheckedChange={setIncludeCharts}
                  />
                  <Label htmlFor="charts" className="text-slate-300">Include Charts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insights"
                    checked={includeAIInsights}
                    onCheckedChange={setIncludeAIInsights}
                  />
                  <Label htmlFor="insights" className="text-slate-300">Include AI Insights</Label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="text-sm text-slate-400 mb-3">
                  Report will include {filteredTrades.length} trades from {format(startDate, "MMM dd")} to {format(endDate, "MMM dd, yyyy")}
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating || filteredTrades.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate PDF Report'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trade Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Trade Preview</CardTitle>
                <p className="text-slate-400">
                  {filteredTrades.length} trades in selected date range
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <VirtualizedTradeTable
                  trades={filteredTrades}
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
