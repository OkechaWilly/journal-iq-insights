
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { calculatePnL } from '@/utils/advancedAnalytics';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, getWeek, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns';

interface DayActivity {
  date: Date;
  trades: any[];
  totalPnL: number;
  winRate: number;
  tradeCount: number;
}

interface WeekSummary {
  weekNumber: number;
  totalPnL: number;
  tradingDays: number;
  totalTrades: number;
  startDate: Date;
  endDate: Date;
}

export const ImprovedTradingCalendar = () => {
  const { trades } = useTrades();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const tradesByDay = useMemo(() => {
    const dayMap = new Map<string, DayActivity>();
    
    monthDays.forEach(date => {
      const dayKey = format(date, 'yyyy-MM-dd');
      dayMap.set(dayKey, {
        date,
        trades: [],
        totalPnL: 0,
        winRate: 0,
        tradeCount: 0
      });
    });

    trades.forEach(trade => {
      const tradeDate = new Date(trade.created_at);
      const dayKey = format(tradeDate, 'yyyy-MM-dd');
      
      if (dayMap.has(dayKey)) {
        const dayData = dayMap.get(dayKey)!;
        dayData.trades.push(trade);
        
        if (trade.exit_price) {
          const pnl = calculatePnL(trade);
          dayData.totalPnL += pnl;
        }
      }
    });

    dayMap.forEach(dayData => {
      dayData.tradeCount = dayData.trades.length;
      if (dayData.tradeCount > 0) {
        const closedTrades = dayData.trades.filter(t => t.exit_price);
        const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
        dayData.winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
      }
    });

    return Array.from(dayMap.values());
  }, [trades, monthDays]);

  const weekSummaries = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    
    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart);
      const weekData = tradesByDay.filter(day => 
        day.date >= weekStart && day.date <= weekEnd
      );
      
      const totalPnL = weekData.reduce((sum, day) => sum + day.totalPnL, 0);
      const tradingDays = weekData.filter(day => day.tradeCount > 0).length;
      const totalTrades = weekData.reduce((sum, day) => sum + day.tradeCount, 0);
      
      return {
        weekNumber: index + 1,
        totalPnL,
        tradingDays,
        totalTrades,
        startDate: weekStart,
        endDate: weekEnd
      } as WeekSummary;
    });
  }, [tradesByDay, currentMonth]);

  const getIntensityClass = (activity: DayActivity) => {
    if (activity.tradeCount === 0) return 'bg-slate-800/30 border-slate-700';
    
    const isProfit = activity.totalPnL >= 0;
    const intensity = Math.min(activity.tradeCount / 3, 1);
    
    if (isProfit) {
      return intensity > 0.5 ? 'bg-emerald-600/40 border-emerald-500' : 'bg-emerald-600/20 border-emerald-600';
    } else {
      return intensity > 0.5 ? 'bg-red-600/40 border-red-500' : 'bg-red-600/20 border-red-600';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Enhanced Trading Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-8 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Week'].map(day => (
            <div key={day} className="text-center text-sm text-slate-400 font-medium p-2 border-b border-slate-600">
              {day}
            </div>
          ))}
          
          {/* Calendar rows */}
          {weekSummaries.map((weekSummary, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {/* Padding days for first week */}
              {weekIndex === 0 && paddingDays.map(index => (
                <div key={`padding-${index}`} className="h-24 border border-slate-700/50 rounded"></div>
              ))}
              
              {/* Days of the week */}
              {tradesByDay
                .filter(activity => {
                  const weekStart = startOfWeek(weekSummary.startDate);
                  const weekEnd = endOfWeek(weekSummary.endDate);
                  return activity.date >= weekStart && activity.date <= weekEnd;
                })
                .slice(0, 7)
                .map(activity => (
                  <div
                    key={format(activity.date, 'yyyy-MM-dd')}
                    className={`h-24 rounded border p-2 transition-all ${getIntensityClass(activity)}`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">
                          {format(activity.date, 'd')}
                        </span>
                        {activity.tradeCount > 0 && (
                          <Badge variant="secondary" className="text-xs h-4 px-1">
                            {activity.tradeCount}
                          </Badge>
                        )}
                      </div>
                      
                      {activity.tradeCount > 0 && (
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            <span className={`text-xs font-medium ${
                              activity.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              ${Math.abs(activity.totalPnL).toFixed(0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-300">
                              {activity.winRate.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              
              {/* Week summary */}
              <div className="h-24 bg-slate-700/30 border border-slate-600 rounded p-2">
                <div className="flex flex-col h-full">
                  <div className="text-center text-blue-400 text-sm font-medium mb-1">
                    Week {weekSummary.weekNumber}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-400" />
                      <span className={`text-xs font-medium ${
                        weekSummary.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        ${Math.abs(weekSummary.totalPnL).toFixed(0)}
                      </span>
                    </div>
                    <div className="text-center text-xs text-slate-300">
                      {weekSummary.tradingDays} days
                    </div>
                    <div className="text-center text-xs text-slate-400">
                      {weekSummary.totalTrades} trades
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
