
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { calculatePnL } from '@/utils/advancedAnalytics';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';

interface DayActivity {
  date: Date;
  trades: any[];
  totalPnL: number;
  winRate: number;
  tradeCount: number;
  hasLoss: boolean;
  hasWin: boolean;
}

export const EnhancedTradingCalendar = () => {
  const { trades } = useTrades();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
        tradeCount: 0,
        hasLoss: false,
        hasWin: false
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

    return Array.from(dayMap.values());
  }, [trades, monthDays]);

  const getIntensityClass = (activity: DayActivity) => {
    if (activity.tradeCount === 0) return 'bg-slate-700/30 border-slate-700';
    
    // Determine base color based on net P&L
    const isNetProfit = activity.totalPnL >= 0;
    const intensity = Math.min(activity.tradeCount / 5, 1); // Max intensity at 5+ trades
    
    // Red for loss days, green for profit days
    if (activity.hasLoss && !activity.hasWin) {
      // Pure loss day
      return intensity > 0.5 
        ? 'bg-red-600/60 border-red-500 ring-1 ring-red-400' 
        : 'bg-red-600/30 border-red-600';
    } else if (activity.hasWin && !activity.hasLoss) {
      // Pure win day
      return intensity > 0.5 
        ? 'bg-emerald-600/60 border-emerald-500 ring-1 ring-emerald-400' 
        : 'bg-emerald-600/30 border-emerald-600';
    } else if (activity.hasWin && activity.hasLoss) {
      // Mixed day - use net P&L to determine color
      if (isNetProfit) {
        return intensity > 0.5 
          ? 'bg-emerald-600/50 border-emerald-500' 
          : 'bg-emerald-600/25 border-emerald-600';
      } else {
        return intensity > 0.5 
          ? 'bg-red-600/50 border-red-500' 
          : 'bg-red-600/25 border-red-600';
      }
    }
    
    // Fallback for open trades
    return 'bg-blue-600/30 border-blue-600';
  };

  const handleMouseEnter = (activity: DayActivity, event: React.MouseEvent) => {
    if (activity.tradeCount > 0) {
      setHoveredDay(activity);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  // Calculate padding days for calendar grid
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
            <div className="w-3 h-3 bg-slate-700/30 rounded border border-slate-600"></div>
            <span>No Trades</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm text-slate-400 font-medium p-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
          
          {/* Padding days */}
          {paddingDays.map(index => (
            <div key={`padding-${index}`} className="aspect-square"></div>
          ))}
          
          {/* Calendar days */}
          {tradesByDay.map(activity => (
            <div
              key={format(activity.date, 'yyyy-MM-dd')}
              className={`aspect-square rounded cursor-pointer transition-all duration-200 hover:scale-105 border flex items-center justify-center relative ${getIntensityClass(activity)}`}
              onMouseEnter={(e) => handleMouseEnter(activity, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-white text-sm font-medium">
                {format(activity.date, 'd')}
              </span>
              {activity.tradeCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {activity.tradeCount > 9 ? '9+' : activity.tradeCount}
                </div>
              )}
              {activity.hasLoss && activity.hasWin && (
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="text-white font-medium mb-2">
              {format(hoveredDay.date, 'MMMM d, yyyy')}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Trades:</span>
                <span className="text-white">{hoveredDay.tradeCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Net P&L:</span>
                <div className="flex items-center gap-1">
                  {hoveredDay.totalPnL >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={hoveredDay.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    ${hoveredDay.totalPnL.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Win Rate:</span>
                <Badge variant={hoveredDay.winRate >= 50 ? "default" : "destructive"}>
                  {hoveredDay.winRate.toFixed(0)}%
                </Badge>
              </div>
              {hoveredDay.hasWin && hoveredDay.hasLoss && (
                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Mixed Results</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
