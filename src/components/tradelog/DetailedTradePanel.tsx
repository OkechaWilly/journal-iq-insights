
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  Calendar, 
  Hash, 
  FileText, 
  Camera, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade } from '@/types/trade';

interface DetailedTradePanelProps {
  trade: InstitutionalTrade;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const DetailedTradePanel: React.FC<DetailedTradePanelProps> = ({
  trade,
  onEdit,
  onDelete,
  onClose
}) => {
  const pnl = calculatePnL(trade);
  const isProfitable = pnl > 0;
  const isOpen = !trade.exit_price;
  const positionValue = trade.entry_price * trade.quantity;
  const riskReward = trade.exit_price ? 
    Math.abs(pnl / (positionValue * 0.02)) : 0; // Assuming 2% risk

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white text-2xl">{trade.symbol}</CardTitle>
            <Badge 
              variant={trade.direction === 'long' ? 'default' : 'secondary'}
              className={`${
                trade.direction === 'long' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {trade.direction === 'long' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {trade.direction.toUpperCase()}
            </Badge>
            
            {isOpen && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10">
                <Clock className="w-3 h-3 mr-1" />
                Open Position
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onDelete} 
                className="text-red-400 border-red-400/30 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* P&L Summary */}
            {!isOpen && (
              <>
                <div className={`p-6 rounded-lg border ${
                  isProfitable 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className={`w-6 h-6 ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`} />
                      <span className="text-slate-300 text-lg font-medium">Profit & Loss</span>
                    </div>
                    <div className={`text-3xl font-bold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfitable ? '+' : ''}${pnl.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Return %</span>
                      <span className={`font-semibold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                        {((pnl / positionValue) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">R:R Ratio</span>
                      <span className="text-slate-300 font-semibold">1:{riskReward.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
              </>
            )}
            
            {/* Trade Details */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Trade Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <span className="text-slate-400 text-sm">Entry Price</span>
                    <div className="text-white text-2xl font-semibold mt-1">
                      ${trade.entry_price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <span className="text-slate-400 text-sm">Quantity</span>
                    <div className="text-white text-2xl font-semibold mt-1">
                      {trade.quantity.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {trade.exit_price && (
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                      <span className="text-slate-400 text-sm">Exit Price</span>
                      <div className="text-white text-2xl font-semibold mt-1">
                        ${trade.exit_price.toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <span className="text-slate-400 text-sm">Position Value</span>
                    <div className="text-white text-2xl font-semibold mt-1">
                      ${positionValue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="bg-slate-700" />
            
            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Timeline
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-sm">Trade Opened</span>
                    <div className="text-white font-medium">
                      {format(new Date(trade.created_at), 'PPpp')}
                    </div>
                  </div>
                </div>
                
                {trade.updated_at !== trade.created_at && (
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400 text-sm">Last Updated</span>
                      <div className="text-white font-medium">
                        {format(new Date(trade.updated_at), 'PPpp')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator className="bg-slate-700" />
            
            {/* Tags */}
            {trade.tags && trade.tags.length > 0 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                    <Hash className="w-5 h-5 text-orange-400" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trade.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="bg-slate-700" />
              </>
            )}
            
            {/* Emotional State */}
            {trade.emotional_state && (
              <>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-400" />
                    Emotional State
                  </h3>
                  <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <Badge variant="outline" className="text-pink-400 border-pink-400/30 bg-pink-500/10">
                      {trade.emotional_state}
                    </Badge>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
              </>
            )}
            
            {/* Notes */}
            {trade.notes && (
              <>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Trading Notes
                  </h3>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {trade.notes}
                    </p>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
              </>
            )}
            
            {/* Screenshot */}
            {trade.screenshot_url && (
              <div className="space-y-4">
                <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  Trade Screenshot
                </h3>
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <img 
                    src={trade.screenshot_url} 
                    alt="Trade screenshot"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
