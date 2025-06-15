
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns";
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Trade data that matches the Trade Log structure
  const trades = [
    {
      id: 1,
      date: "2024-06-15",
      symbol: "AAPL",
      type: "Stock",
      side: "Buy",
      quantity: 100,
      entryPrice: 150.25,
      exitPrice: 155.75,
      pnl: 550.00,
      status: "Closed"
    },
    {
      id: 2,
      date: "2024-06-14",
      symbol: "EURUSD",
      type: "Forex",
      side: "Sell",
      quantity: 10000,
      entryPrice: 1.0850,
      exitPrice: 1.0820,
      pnl: 300.00,
      status: "Closed"
    },
    {
      id: 3,
      date: "2024-06-13",
      symbol: "TSLA",
      type: "Stock",
      side: "Buy",
      quantity: 50,
      entryPrice: 240.00,
      exitPrice: 235.00,
      pnl: -250.00,
      status: "Closed"
    },
    {
      id: 4,
      date: "2024-06-12",
      symbol: "BTC/USD",
      type: "Crypto",
      side: "Buy",
      quantity: 0.5,
      entryPrice: 42000,
      exitPrice: 43500,
      pnl: 750.00,
      status: "Closed"
    },
    {
      id: 5,
      date: "2024-06-11",
      symbol: "GOOGL",
      type: "Stock",
      side: "Buy",
      quantity: 25,
      entryPrice: 2500.00,
      exitPrice: 2580.00,
      pnl: 2000.00,
      status: "Closed"
    },
    {
      id: 6,
      date: "2024-06-10",
      symbol: "MSFT",
      type: "Stock",
      side: "Sell",
      quantity: 75,
      entryPrice: 420.00,
      exitPrice: 415.00,
      pnl: 375.00,
      status: "Closed"
    },
    {
      id: 7,
      date: "2024-06-09",
      symbol: "AMZN",
      type: "Stock",
      side: "Buy",
      quantity: 30,
      entryPrice: 3200.00,
      exitPrice: 3150.00,
      pnl: -1500.00,
      status: "Closed"
    },
    {
      id: 8,
      date: "2024-06-08",
      symbol: "NVDA",
      type: "Stock",
      side: "Buy",
      quantity: 40,
      entryPrice: 900.00,
      exitPrice: 920.00,
      pnl: 800.00,
      status: "Closed"
    }
  ];

  // Transform trades data to daily summaries
  const getDailyTradingData = () => {
    const dailyData: { [key: string]: { pnl: number; trades: number; winRate: number } } = {};
    
    trades.forEach(trade => {
      const dateKey = trade.date;
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { pnl: 0, trades: 0, winRate: 0 };
      }
      dailyData[dateKey].pnl += trade.pnl;
      dailyData[dateKey].trades += 1;
    });

    // Calculate win rates
    Object.keys(dailyData).forEach(dateKey => {
      const dayTrades = trades.filter(trade => trade.date === dateKey);
      const winningTrades = dayTrades.filter(trade => trade.pnl > 0).length;
      dailyData[dateKey].winRate = dayTrades.length > 0 ? (winningTrades / dayTrades.length) * 100 : 0;
    });

    return dailyData;
  };

  const tradingData = getDailyTradingData();

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

  const navigateToCurrentMonth = () => {
    setCurrentDate(new Date());
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
            <Button variant="outline" size="sm" onClick={navigateToCurrentMonth}>
              This month
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/add-trade">
                <Plus className="w-4 h-4" />
                Add Trade
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4" />
              </Link>
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
                    <span className={`font-medium ${monthlyStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyStats.totalPnl)}
                    </span>
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
                                {dayData.winRate.toFixed(0)}%
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
                          {selectedDateData.winRate.toFixed(0)}%
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
