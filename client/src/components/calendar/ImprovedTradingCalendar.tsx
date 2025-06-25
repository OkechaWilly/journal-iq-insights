
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { calculatePnL } from '@/utils/advancedAnalytics';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns';
import { DayDetailModal } from './DayDetailModal';

interface DayActivity {
  date: Date;
  trades: any[];
  totalPnL: number;
  winRate: number;
  tradeCount: number;
  hasLoss: boolean;
  hasWin: boolean;
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
  const [selectedDay, setSelectedDay] = useState<DayActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const tradesByDay = useMemo(() => {
    const dayMap = new Map<string, DayActivity>();
    
    // Initialize all days in the month
    monthDays.forEach(date => {
      const dayKey = format(date, 'yyyy-MM-dd');
      dayMap.set(dayKey, {
        date,
        trades: [],
        totalPnL: 0,
        winRate: 0,
        tradeCount: 0,
        hasLoss: false,
        hasWin: false
      });
    });

    // Process all trades for current month view
    trades.forEach(trade => {
      const tradeDate = new Date(trade.created_at);
      const dayKey = format(tradeDate, 'yyyy-MM-dd');
      
      // Check if trade date falls within current month view
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      if (tradeDate >= monthStart && tradeDate <= monthEnd) {
        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            date: tradeDate,
            trades: [],
            totalPnL: 0,
            winRate: 0,
            tradeCount: 0,
            hasLoss: false,
            hasWin: false
          });
        }
        
        const dayData = dayMap.get(dayKey)!;
        dayData.trades.push(trade);
        
        if (trade.exit_price) {
          const pnl = calculatePnL(trade);
          dayData.totalPnL += pnl;
          
          if (pnl > 0) {
            dayData.hasWin = true;
          } else if (pnl < 0) {
            dayData.hasLoss = true;
          }
        }
      }
    });

    // Calculate win rates and trade counts
    dayMap.forEach(dayData => {
      dayData.tradeCount = dayData.trades.length;
      if (dayData.tradeCount > 0) {
        const closedTrades = dayData.trades.filter(t => t.exit_price);
        const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
        dayData.winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
      }
    });

    return Array.from(dayMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [trades, monthDays, currentMonth]);

  const weekSummaries = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Calculate weeks that intersect with the current month
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const weeks = eachWeekOfInterval({ start: calendarStart, end: calendarEnd });
    
    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart);
      
      // Get trades for this week that fall within our month view
      const weekTrades = trades.filter(trade => {
        const tradeDate = new Date(trade.created_at);
        return tradeDate >= weekStart && tradeDate <= weekEnd && 
               tradeDate >= monthStart && tradeDate <= monthEnd;
      });
      
      const totalPnL = weekTrades.reduce((sum, trade) => {
        return trade.exit_price ? sum + calculatePnL(trade) : sum;
      }, 0);
      
      const tradingDays = new Set(weekTrades.map(trade => 
        format(new Date(trade.created_at), 'yyyy-MM-dd')
      )).size;
      
      return {
        weekNumber: index + 1,
        totalPnL,
        tradingDays,
        totalTrades: weekTrades.length,
        startDate: weekStart,
        endDate: weekEnd
      } as WeekSummary;
    });
  }, [trades, currentMonth]);

  const getIntensityClass = (activity: DayActivity) => {
    if (activity.tradeCount === 0) return 'bg-slate-800/20 border-slate-700/50 hover:bg-slate-800/30';
    
    // Calculate intensity based on number of trades (1-5+ scale)
    const intensity = Math.min(activity.tradeCount / 5, 1);
    const opacityLevel = Math.max(0.3, intensity);
    
    // Determine color based on P&L and win/loss status
    if (activity.hasLoss && !activity.hasWin) {
      // Pure loss day - red with intensity
      return `bg-red-600/${Math.round(opacityLevel * 100)} border-red-500/${Math.round(opacityLevel * 100)} hover:bg-red-600/${Math.round((opacityLevel + 0.2) * 100)} transition-all cursor-pointer`;
    } else if (activity.hasWin && !activity.hasLoss) {
      // Pure win day - green with intensity
      return `bg-emerald-600/${Math.round(opacityLevel * 100)} border-emerald-500/${Math.round(opacityLevel * 100)} hover:bg-emerald-600/${Math.round((opacityLevel + 0.2) * 100)} transition-all cursor-pointer`;
    } else if (activity.hasWin && activity.hasLoss) {
      // Mixed day - use net P&L with intensity
      const isNetProfit = activity.totalPnL >= 0;
      if (isNetProfit) {
        return `bg-emerald-600/${Math.round(opacityLevel * 80)} border-emerald-500/${Math.round(opacityLevel * 80)} hover:bg-emerald-600/${Math.round((opacityLevel + 0.2) * 100)} transition-all cursor-pointer`;
      } else {
        return `bg-red-600/${Math.round(opacityLevel * 80)} border-red-500/${Math.round(opacityLevel * 80)} hover:bg-red-600/${Math.round((opacityLevel + 0.2) * 100)} transition-all cursor-pointer`;
      }
    }
    
    // Open trades only - blue with intensity
    return `bg-blue-600/${Math.round(opacityLevel * 100)} border-blue-600/${Math.round(opacityLevel * 100)} hover:bg-blue-600/${Math.round((opacityLevel + 0.2) * 100)} transition-all cursor-pointer`;
  };

  const handleDayClick = (activity: DayActivity) => {
    if (activity.tradeCount > 0) {
      setSelectedDay(activity);
      setIsModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const firstDayOfMonth = getDay(startOfMonth(currentMonth));

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Trading Calendar
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
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500/60 rounded border border-emerald-400"></div>
              <span>Profitable Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/60 rounded border border-red-400"></div>
              <span>Loss Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/40 rounded border border-blue-400"></div>
              <span>Mixed Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-700/30 rounded border border-slate-600"></div>
              <span>No Trades</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Week'].map(day => (
              <div key={day} className="text-center text-sm text-slate-400 font-medium p-2 border-b border-slate-600">
                {day}
              </div>
            ))}
            
            {/* Calendar grid with weeks */}
            {weekSummaries.map((weekSummary, weekIndex) => {
              // Get days for this specific week
              const weekStart = startOfWeek(weekSummary.startDate);
              const weekEnd = endOfWeek(weekSummary.endDate);
              const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
              
              return (
                <React.Fragment key={weekIndex}>
                  {/* Days of the week */}
                  {weekDays.map((day, dayIndex) => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const activity = tradesByDay.find(a => format(a.date, 'yyyy-MM-dd') === dayKey);
                    const isCurrentMonth = day >= startOfMonth(currentMonth) && day <= endOfMonth(currentMonth);
                    
                    if (!isCurrentMonth) {
                      return <div key={dayIndex} className="h-24 border border-slate-700/20 rounded bg-slate-900/20"></div>;
                    }
                    
                    if (!activity) {
                      return (
                        <div key={dayIndex} className="h-24 border border-slate-700 rounded bg-slate-800/30 p-2">
                          <span className="text-slate-500 text-sm font-medium">
                            {format(day, 'd')}
                          </span>
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`h-24 rounded border p-2 transition-all duration-200 ${getIntensityClass(activity)}`}
                        onClick={() => handleDayClick(activity)}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">
                              {format(activity.date, 'd')}
                            </span>
                            {activity.tradeCount > 0 && (
                              <Badge variant="secondary" className="text-xs h-4 px-1 bg-slate-900/60">
                                {activity.tradeCount}
                              </Badge>
                            )}
                          </div>
                          
                          {activity.tradeCount > 0 && (
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-slate-300" />
                                <span className={`text-xs font-medium ${
                                  activity.totalPnL >= 0 ? 'text-white' : 'text-white'
                                }`}>
                                  ${Math.abs(activity.totalPnL).toFixed(0)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3 text-slate-300" />
                                <span className="text-xs text-slate-200">
                                  {activity.winRate.toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Week summary */}
                  <div className="h-24 bg-slate-700/30 border border-slate-600 rounded p-2">
                    <div className="flex flex-col h-full">
                      <div className="text-center text-blue-400 text-sm font-medium mb-1">
                        W{weekSummary.weekNumber}
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
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDay?.date || new Date()}
        trades={selectedDay?.trades || []}
      />
    </>
  );
};
