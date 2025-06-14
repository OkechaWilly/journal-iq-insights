
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns";
import { Layout } from '@/components/Layout';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock trading data with more comprehensive daily performance
  const tradingData = {
    "2024-06-01": { pnl: 1650, trades: 4, winRate: 100 },
    "2024-06-02": { pnl: 2090, trades: 4, winRate: 50 },
    "2024-06-03": { pnl: 2500, trades: 2, winRate: 100 },
    "2024-06-06": { pnl: 2720, trades: 2, winRate: 100 },
    "2024-06-07": { pnl: 3240, trades: 3, winRate: 100 },
    "2024-06-08": { pnl: 1800, trades: 2, winRate: 100 },
    "2024-06-09": { pnl: -1420, trades: 4, winRate: 0 },
    "2024-06-10": { pnl: 131, trades: 7, winRate: 14.29 },
    "2024-06-13": { pnl: 1850, trades: 4, winRate: 100 },
    "2024-06-14": { pnl: -356, trades: 3, winRate: 0 },
    "2024-06-15": { pnl: 2090, trades: 4, winRate: 100 },
    "2024-06-16": { pnl: 427, trades: 6, winRate: 33.33 },
    "2024-06-17": { pnl: 1250, trades: 3, winRate: 100 },
    "2024-06-18": { pnl: -890, trades: 5, winRate: 20 },
    "2024-06-19": { pnl: 3400, trades: 2, winRate: 100 },
    "2024-06-20": { pnl: 1680, trades: 4, winRate: 75 },
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMonthlyStats = () => {
    const monthlyData = Object.entries(tradingData).filter(([date]) => {
      const tradeDate = new Date(date);
      return isSameMonth(tradeDate, currentDate);
    });

    const totalPnl = monthlyData.reduce((sum, [, data]) => sum + data.pnl, 0);
    const tradingDays = monthlyData.length;
    const totalTrades = monthlyData.reduce((sum, [, data]) => sum + data.trades, 0);
    const profitableDays = monthlyData.filter(([, data]) => data.pnl > 0).length;
    const winRate = tradingDays > 0 ? (profitableDays / tradingDays) * 100 : 0;

    return { totalPnl, tradingDays, totalTrades, winRate };
  };

  const monthlyStats = getMonthlyStats();

  const formatCurrency = (amount: number) => {
    const prefix = amount >= 0 ? "CA$" : "-CA$";
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000) {
      return `${prefix}${(absAmount / 1000).toFixed(2)}K`;
    }
    return `${prefix}${absAmount}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const selectedDateData = tradingData[format(selectedDate, "yyyy-MM-dd")];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              Trading Calendar
            </h2>
            <p className="text-gray-600">Track your daily trading performance and monthly statistics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              This month
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Trade
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <CardTitle className="text-xl">
                      {format(currentDate, "MMMM yyyy")}
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Monthly stats:</span>
                    <span className="text-green-600 font-medium">{formatCurrency(monthlyStats.totalPnl)}</span>
                    <span>{monthlyStats.tradingDays} days</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {/* Header */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {Array.from({ length: 42 }, (_, index) => {
                    const date = new Date(monthStart);
                    date.setDate(date.getDate() - monthStart.getDay() + index);
                    
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayData = tradingData[dateStr];
                    const isCurrentMonth = isSameMonth(date, currentDate);
                    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    
                    return (
                      <div
                        key={index}
                        className={`
                          relative h-24 border border-gray-200 cursor-pointer transition-all hover:bg-gray-50
                          ${!isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''}
                          ${isSelected ? 'ring-2 ring-blue-500' : ''}
                          ${isToday ? 'bg-blue-50' : ''}
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="p-1">
                          <div className={`text-xs font-medium ${isToday ? 'text-blue-600' : ''}`}>
                            {date.getDate()}
                          </div>
                          {dayData && isCurrentMonth && (
                            <div className={`
                              text-xs mt-1 p-1 rounded text-center
                              ${dayData.pnl >= 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                              }
                            `}>
                              <div className="font-semibold">
                                {formatCurrency(dayData.pnl)}
                              </div>
                              <div className="text-xs opacity-75">
                                {dayData.trades} trades
                              </div>
                              <div className="text-xs opacity-75">
                                {dayData.winRate}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            {/* Selected Date Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, "MMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateData ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${selectedDateData.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedDateData.pnl)}
                      </div>
                      <div className="text-sm text-gray-600">Daily P&L</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">
                          {selectedDateData.trades}
                        </div>
                        <div className="text-xs text-gray-600">Trades</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-600">
                          {selectedDateData.winRate}%
                        </div>
                        <div className="text-xs text-gray-600">Win Rate</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No trading activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Week 1</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">CA$6.23K</div>
                      <div className="text-xs text-gray-500">3 days</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Week 2</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">CA$6.55K</div>
                      <div className="text-xs text-gray-500">5 days</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Week 3</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">CA$4K</div>
                      <div className="text-xs text-gray-500">4 days</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total P&L</span>
                    <span className={`font-semibold ${monthlyStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyStats.totalPnl)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trading Days</span>
                    <span className="font-semibold text-blue-600">{monthlyStats.tradingDays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Trades</span>
                    <span className="font-semibold text-blue-600">{monthlyStats.totalTrades}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Win Rate</span>
                    <span className="font-semibold text-purple-600">{monthlyStats.winRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
