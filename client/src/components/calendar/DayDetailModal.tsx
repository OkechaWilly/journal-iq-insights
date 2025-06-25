
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, DollarSign, Target, Camera, FileText, Brain, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade } from '@/types/trade';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  trades: InstitutionalTrade[];
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  date,
  trades
}) => {
  const [selectedTrade, setSelectedTrade] = useState<InstitutionalTrade | null>(null);

  const dayStats = {
    totalTrades: trades.length,
    totalPnL: trades.reduce((sum, trade) => sum + calculatePnL(trade), 0),
    winningTrades: trades.filter(trade => calculatePnL(trade) > 0).length,
    losingTrades: trades.filter(trade => calculatePnL(trade) < 0).length,
    winRate: trades.length > 0 ? (trades.filter(trade => calculatePnL(trade) > 0).length / trades.length) * 100 : 0,
    avgPnL: trades.length > 0 ? trades.reduce((sum, trade) => sum + calculatePnL(trade), 0) / trades.length : 0
  };

  const bestTrade = trades.reduce((best, trade) => 
    calculatePnL(trade) > calculatePnL(best) ? trade : best, trades[0]);
  
  const worstTrade = trades.reduce((worst, trade) => 
    calculatePnL(trade) < calculatePnL(worst) ? trade : worst, trades[0]);

  const emotionalStates = trades.filter(t => t.emotional_state).map(t => t.emotional_state);
  const dominantEmotion = emotionalStates.length > 0 ? 
    emotionalStates.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    ) : null;

  if (!trades.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            {format(date, 'EEEE, MMMM do, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Panel - Day Overview */}
          <div className="space-y-4">
            {/* Performance Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Day Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg ${dayStats.totalPnL >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Total P&L</span>
                    <div className={`text-2xl font-bold ${dayStats.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {dayStats.totalPnL >= 0 ? '+' : ''}${dayStats.totalPnL.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-700/30 rounded">
                    <div className="text-xl font-bold text-white">{dayStats.totalTrades}</div>
                    <div className="text-sm text-slate-400">Trades</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded">
                    <div className="text-xl font-bold text-emerald-400">{dayStats.winRate.toFixed(0)}%</div>
                    <div className="text-sm text-slate-400">Win Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-emerald-500/10 rounded">
                    <div className="text-lg font-bold text-emerald-400">{dayStats.winningTrades}</div>
                    <div className="text-sm text-slate-400">Winners</div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded">
                    <div className="text-lg font-bold text-red-400">{dayStats.losingTrades}</div>
                    <div className="text-sm text-slate-400">Losers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional State */}
            {dominantEmotion && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Emotional State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30 bg-purple-500/10">
                    {dominantEmotion}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* AI Insights */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayStats.totalPnL > 0 ? (
                  <div className="p-3 bg-emerald-500/10 rounded border border-emerald-500/20">
                    <p className="text-emerald-400 text-sm">
                      Strong performance today! Your {dayStats.winRate.toFixed(0)}% win rate suggests good trade selection.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
                    <p className="text-red-400 text-sm">
                      Consider reviewing your risk management. Focus on quality over quantity.
                    </p>
                  </div>
                )}
                
                {bestTrade && (
                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-blue-400 text-sm">
                      Best trade: {bestTrade.symbol} (+${calculatePnL(bestTrade).toFixed(2)})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Trade List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="trades" className="h-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="trades">All Trades</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="trades" className="mt-4">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {trades.map((trade) => {
                      const pnl = calculatePnL(trade);
                      const isSelected = selectedTrade?.id === trade.id;
                      
                      return (
                        <Card 
                          key={trade.id}
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-500/20 border-blue-500/50' 
                              : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50'
                          }`}
                          onClick={() => setSelectedTrade(trade)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {trade.direction === 'long' ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                  )}
                                  <span className="font-semibold text-white">{trade.symbol}</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`${
                                    trade.direction === 'long' 
                                      ? 'text-emerald-400 border-emerald-500/30' 
                                      : 'text-red-400 border-red-500/30'
                                  }`}
                                >
                                  {trade.direction.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {trade.exit_price ? (
                                  <Badge
                                    variant={pnl >= 0 ? "default" : "destructive"}
                                    className={pnl >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}
                                  >
                                    {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                                    Open
                                  </Badge>
                                )}
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-slate-400">Entry: </span>
                                <span className="text-white font-mono">${trade.entry_price.toFixed(2)}</span>
                              </div>
                              {trade.exit_price && (
                                <div>
                                  <span className="text-slate-400">Exit: </span>
                                  <span className="text-white font-mono">${trade.exit_price.toFixed(2)}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-400">Qty: </span>
                                <span className="text-white font-mono">{trade.quantity}</span>
                              </div>
                            </div>

                            {(trade.emotional_state || trade.notes) && (
                              <div className="flex items-center gap-2 mt-2">
                                {trade.emotional_state && (
                                  <Badge variant="secondary" className="text-xs">
                                    {trade.emotional_state}
                                  </Badge>
                                )}
                                {trade.notes && (
                                  <FileText className="w-3 h-3 text-slate-400" />
                                )}
                                {trade.screenshot_url && (
                                  <Camera className="w-3 h-3 text-slate-400" />
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="screenshots" className="mt-4">
                <ScrollArea className="h-[600px]">
                  <div className="grid grid-cols-2 gap-4">
                    {trades.filter(t => t.screenshot_url).map((trade) => (
                      <Card key={trade.id} className="bg-slate-800/30 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white text-sm">{trade.symbol}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <img 
                            src={trade.screenshot_url} 
                            alt={`${trade.symbol} screenshot`}
                            className="w-full h-32 object-cover rounded"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {trades.filter(t => t.notes).map((trade) => (
                      <Card key={trade.id} className="bg-slate-800/30 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white text-sm flex items-center justify-between">
                            <span>{trade.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(trade.created_at), 'HH:mm')}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-300 text-sm">{trade.notes}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
