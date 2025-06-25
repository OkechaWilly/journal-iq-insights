
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, DollarSign, Calendar, Hash, FileText, Camera, Edit, Trash2 } from 'lucide-react';
import { Trade } from '@/hooks/useTrades';
import { format } from 'date-fns';

interface DetailedTradeViewProps {
  trade: Trade;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DetailedTradeView: React.FC<DetailedTradeViewProps> = ({ 
  trade, 
  onEdit, 
  onDelete 
}) => {
  const pnl = trade.exit_price 
    ? (trade.direction === 'long' 
        ? (trade.exit_price - trade.entry_price) * trade.quantity 
        : (trade.entry_price - trade.exit_price) * trade.quantity)
    : 0;

  const isProfitable = pnl > 0;
  const isOpen = !trade.exit_price;
  const riskReward = trade.exit_price 
    ? Math.abs(pnl / ((trade.entry_price * trade.quantity) * 0.02)) // Assuming 2% risk
    : 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
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
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
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
              <Button size="sm" variant="outline" onClick={onDelete} className="text-red-400 border-red-400/30 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* P&L Summary */}
        {!isOpen && (
          <div className={`p-4 rounded-lg ${isProfitable ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className={`w-5 h-5 ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className="text-slate-300">Profit & Loss</span>
              </div>
              <div className={`text-2xl font-bold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                {isProfitable ? '+' : ''}{pnl.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-slate-400">Risk:Reward Ratio</span>
              <span className="text-slate-300">1:{riskReward.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {/* Trade Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 text-sm">Entry Price</span>
              <div className="text-white text-xl font-semibold">${trade.entry_price}</div>
            </div>
            
            <div>
              <span className="text-slate-400 text-sm">Quantity</span>
              <div className="text-white text-xl font-semibold">{trade.quantity}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {trade.exit_price && (
              <div>
                <span className="text-slate-400 text-sm">Exit Price</span>
                <div className="text-white text-xl font-semibold">${trade.exit_price}</div>
              </div>
            )}
            
            <div>
              <span className="text-slate-400 text-sm">Position Value</span>
              <div className="text-white text-xl font-semibold">
                ${(trade.entry_price * trade.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Timestamps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Opened</span>
            <span className="text-white">
              {format(new Date(trade.created_at), 'PPpp')}
            </span>
          </div>
          
          {trade.updated_at !== trade.created_at && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Last Updated</span>
              <span className="text-white">
                {format(new Date(trade.updated_at), 'PPpp')}
              </span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {trade.tags && trade.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trade.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Emotional State */}
        {trade.emotional_state && (
          <div>
            <span className="text-slate-400 text-sm">Emotional State</span>
            <div className="text-white mt-1">
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                {trade.emotional_state}
              </Badge>
            </div>
          </div>
        )}
        
        {/* Notes */}
        {trade.notes && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Notes</span>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-slate-300 text-sm leading-relaxed">{trade.notes}</p>
            </div>
          </div>
        )}
        
        {/* Screenshot */}
        {trade.screenshot_url && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Screenshot</span>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <img 
                src={trade.screenshot_url} 
                alt="Trade screenshot"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
