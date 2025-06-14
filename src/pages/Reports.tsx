
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar, BarChart3, TrendingUp, Filter } from "lucide-react";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");

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
      id: "tax",
      title: "Tax Report",
      description: "Tax-ready report with all trades, gains, and losses for filing",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const recentReports = [
    {
      name: "Q2 2024 Performance Report",
      type: "Performance",
      generatedDate: "2024-06-15",
      size: "2.3 MB",
      status: "Ready"
    },
    {
      name: "May 2024 Monthly Summary",
      type: "Monthly",
      generatedDate: "2024-06-01",
      size: "1.8 MB",
      status: "Ready"
    },
    {
      name: "Analytics Deep Dive - H1 2024",
      type: "Analytics",
      generatedDate: "2024-05-30",
      size: "4.1 MB",
      status: "Processing"
    },
    {
      name: "Tax Report 2024 YTD",
      type: "Tax",
      generatedDate: "2024-05-15",
      size: "890 KB",
      status: "Ready"
    }
  ];

  const handleGenerateReport = () => {
    console.log("Generating report:", { reportType, dateRange });
    // Add report generation logic here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">Generate and download comprehensive reports on your trading activity and performance.</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Filter className="w-4 h-4" />
          Custom Report
        </Button>
      </div>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Create customized reports for your trading analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance Report</SelectItem>
                  <SelectItem value="monthly">Monthly Summary</SelectItem>
                  <SelectItem value="analytics">Analytics Report</SelectItem>
                  <SelectItem value="tax">Tax Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport} 
            className="gap-2 bg-green-600 hover:bg-green-700"
            disabled={!reportType || !dateRange}
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className={`${template.borderColor} border-2 hover:shadow-md transition-shadow cursor-pointer`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${template.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${template.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                    <Button 
                      size="sm" 
                      className="mt-3 gap-2"
                      onClick={() => {
                        setReportType(template.id);
                        handleGenerateReport();
                      }}
                    >
                      <Download className="w-3 h-3" />
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your previously generated reports and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Generated on {report.generatedDate}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline"
                    className={report.status === 'Ready' ? 'text-green-600 border-green-200' : 'text-yellow-600 border-yellow-200'}
                  >
                    {report.status}
                  </Badge>
                  {report.status === 'Ready' && (
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Choose your preferred format for reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-medium">PDF Report</h4>
              <p className="text-sm text-gray-600 mt-1">Professional formatted report</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Excel Export</h4>
              <p className="text-sm text-gray-600 mt-1">Spreadsheet with raw data</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">CSV Data</h4>
              <p className="text-sm text-gray-600 mt-1">Raw data for analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
