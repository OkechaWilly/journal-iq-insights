
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock calendar data
  const tradingEvents = [
    {
      date: "2024-06-14",
      trades: [
        { symbol: "AAPL", pnl: 250, type: "profit" },
        { symbol: "GOOGL", pnl: -125, type: "loss" }
      ],
      totalPnl: 125,
      notes: "Strong tech sector performance"
    },
    {
      date: "2024-06-13",
      trades: [
        { symbol: "TSLA", pnl: 480, type: "profit" }
      ],
      totalPnl: 480,
      notes: "Tesla earnings beat expectations"
    },
    {
      date: "2024-06-12",
      trades: [
        { symbol: "EURUSD", pnl: -200, type: "loss" },
        { symbol: "BTC/USD", pnl: 350, type: "profit" }
      ],
      totalPnl: 150,
      notes: "Mixed forex and crypto session"
    }
  ];

  const upcomingEvents = [
    { date: "2024-06-17", event: "Fed Interest Rate Decision", impact: "high" },
    { date: "2024-06-18", event: "Apple Earnings", impact: "medium" },
    { date: "2024-06-19", event: "Options Expiry", impact: "low" },
    { date: "2024-06-20", event: "GDP Report", impact: "high" }
  ];

  const selectedDateData = tradingEvents.find(
    event => event.date === format(selectedDate, "yyyy-MM-dd")
  );

  const getDayContent = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayData = tradingEvents.find(event => event.date === dateStr);
    
    if (!dayData) return null;
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className={`w-2 h-2 rounded-full ${dayData.totalPnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-500" />
            Trading Calendar
          </h2>
          <p className="text-gray-600">View your trades and trading plans by date. Track daily performance and upcoming events.</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trading Calendar</CardTitle>
            <CardDescription>
              Click on any date to view trading activity. 
              <span className="inline-flex items-center gap-2 ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Profit days
                <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                Loss days
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{date.getDate()}</span>
                    {getDayContent(date)}
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
              {selectedDateData && (
                <CardDescription>{selectedDateData.notes}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedDateData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily P&L</span>
                    <Badge 
                      variant="outline"
                      className={`${selectedDateData.totalPnl >= 0 ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}
                    >
                      ${selectedDateData.totalPnl > 0 ? '+' : ''}${selectedDateData.totalPnl}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Trades</span>
                    {selectedDateData.trades.map((trade, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{trade.symbol}</span>
                        <div className="flex items-center gap-1">
                          {trade.type === 'profit' ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${trade.type === 'profit' ? 'text-green-600' : 'text-red-600'}`}>
                            ${trade.pnl > 0 ? '+' : ''}{trade.pnl}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No trading activity on this date</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <CardDescription>Market events and economic calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">{event.event}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(event.date), "MMM d")}
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        event.impact === 'high' ? 'text-red-600 border-red-200' :
                        event.impact === 'medium' ? 'text-yellow-600 border-yellow-200' :
                        'text-gray-600 border-gray-200'
                      }
                    >
                      {event.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary - {format(selectedDate, "MMMM yyyy")}</CardTitle>
          <CardDescription>Overview of trading activity for the selected month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Trading Days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">68</div>
              <div className="text-sm text-gray-600">Total Trades</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">+$2,340</div>
              <div className="text-sm text-gray-600">Monthly P&L</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">65%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
