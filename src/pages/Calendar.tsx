
import React, { useState } from "react";
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useTrades } from '@/hooks/useTrades';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { trades, loading } = useTrades();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading calendar...</div>
        </div>
      </Layout>
    );
  }

  // Get trades for selected date
  const selectedDateTrades = trades.filter(trade => 
    isSameDay(new Date(trade.created_at), selectedDate)
  );

  // Get trades for current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.created_at);
    return tradeDate >= monthStart && tradeDate <= monthEnd;
  });

  // Calculate daily P&L for the month
  const dailyPnL = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(day => {
    const dayTrades = trades.filter(trade => 
      isSameDay(new Date(trade.created_at), day) && trade.exit_price
    );
    
    const pnl = dayTrades.reduce((sum, trade) => {
      const tradePnL = trade.direction === 'long' 
        ? (trade.exit_price! - trade.entry_price) * trade.quantity
        : (trade.entry_price - trade.exit_price!) * trade.quantity;
      return sum + tradePnL;
    }, 0);

    return {
      date: day,
      pnl,
      tradeCount: dayTrades.length
    };
  });

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price) return 0;
    return trade.direction === 'long' 
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price) * trade.quantity;
  };

  const getTradeDateBadges = (date: Date) => {
    const dayTrades = trades.filter(trade => 
      isSameDay(new Date(trade.created_at), date)
    );
    
    if (dayTrades.length === 0) return null;
    
    const closedTrades = dayTrades.filter(t => t.exit_price);
    const dailyPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
    
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs font-semibold text-white">{dayTrades.length}</div>
        {closedTrades.length > 0 && (
          <div className={`w-2 h-2 rounded-full ${dailyPnL >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Trading Calendar</h2>
            <p className="text-slate-400 mt-1">View your trades organized by date and track daily performance.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" />
            Add Trade
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="border-slate-600 hover:bg-slate-700 text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="border-slate-600 hover:bg-slate-700 text-slate-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full bg-slate-800/30 border-slate-700 text-white"
                classNames={{
                  months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 w-full flex flex-col",
                  table: "w-full h-full border-collapse space-y-1",
                  head_row: "",
                  head_cell: "text-slate-400 rounded-md w-8 font-normal text-[0.8rem]",
                  row: "w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-700 [&:has([aria-selected].day-outside)]:bg-slate-800/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                  day: "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-normal text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&:has(button)]:hover:!bg-slate-700",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                  day_today: "bg-slate-700 text-white font-semibold",
                  day_outside: "text-slate-600 opacity-50",
                  day_disabled: "text-slate-600 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <span>{format(date, 'd')}</span>
                      {getTradeDateBadges(date)}
                    </div>
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">
                {format(selectedDate, 'EEEE, MMMM do')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {selectedDateTrades.length} trade{selectedDateTrades.length !== 1 ? 's' : ''} on this day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateTrades.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTrades.map((trade) => {
                    const pnl = calculatePnL(trade);
                    const isOpen = !trade.exit_price;
                    
                    return (
                      <div key={trade.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{trade.symbol}</span>
                            <Badge 
                              variant="outline" 
                              className={trade.direction === 'long' ? 
                                'text-emerald-400 border-emerald-500/30' : 
                                'text-red-400 border-red-500/30'
                              }
                            >
                              {trade.direction.toUpperCase()}
                            </Badge>
                          </div>
                          {trade.direction === 'long' ? 
                            <TrendingUp className="w-4 h-4 text-emerald-400" /> : 
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          }
                        </div>
                        
                        <div className="text-sm text-slate-400 space-y-1">
                          <div>Quantity: {trade.quantity}</div>
                          <div>Entry: ${Number(trade.entry_price).toFixed(2)}</div>
                          {!isOpen && (
                            <>
                              <div>Exit: ${Number(trade.exit_price).toFixed(2)}</div>
                              <div className={`font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                P&L: {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                              </div>
                            </>
                          )}
                          {isOpen && (
                            <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                              Open Position
                            </Badge>
                          )}
                        </div>
                        
                        {trade.notes && (
                          <div className="mt-2 text-xs text-slate-500 italic">
                            "{trade.notes}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CalendarComponent className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No trades on this date</p>
                  <p className="text-sm">Select a different date or add a new trade</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Overview */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Monthly Overview</CardTitle>
            <CardDescription className="text-slate-400">
              {format(currentMonth, 'MMMM yyyy')} trading summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-2xl font-bold text-white">{monthTrades.length}</div>
                <div className="text-sm text-slate-400">Total Trades</div>
              </div>
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-2xl font-bold text-emerald-400">
                  {monthTrades.filter(t => t.exit_price && calculatePnL(t) > 0).length}
                </div>
                <div className="text-sm text-slate-400">Winning Trades</div>
              </div>
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {monthTrades.filter(t => t.exit_price && calculatePnL(t) < 0).length}
                </div>
                <div className="text-sm text-slate-400">Losing Trades</div>
              </div>
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className={`text-2xl font-bold ${
                  monthTrades.reduce((sum, t) => sum + calculatePnL(t), 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  ${monthTrades.reduce((sum, t) => sum + calculatePnL(t), 0).toFixed(0)}
                </div>
                <div className="text-sm text-slate-400">Net P&L</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calendar;
