
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Download, Plus, Calendar, Hash, BarChart3, TrendingUp } from "lucide-react";
import { Layout } from '@/components/Layout';
import { useTradesPaginated } from '@/hooks/useTradesPaginated';
import { useTrades } from '@/hooks/useTrades';
import { exportTradesToCSV } from '@/utils/csvExport';
import { TradeLogGrouping } from '@/components/tradelog/TradeLogGrouping';
import { DetailedTradePanel } from '@/components/tradelog/DetailedTradePanel';
import type { InstitutionalTrade } from '@/types/trade';
import { useNavigate } from 'react-router-dom';

const TradeLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [selectedTrade, setSelectedTrade] = useState<InstitutionalTrade | null>(null);
  const { deleteTrade } = useTrades();
  const navigate = useNavigate();
  
  const { 
    trades, 
    loading, 
    hasMore, 
    loadMore, 
    totalCount 
  } = useTradesPaginated({
    pageSize: 50,
    search: searchTerm,
    direction: filterType === "all" ? null : filterType
  });

  const handleTradeClick = (trade: InstitutionalTrade) => {
    setSelectedTrade(trade);
  };

  const handleDelete = async (trade: InstitutionalTrade) => {
    if (window.confirm(`Are you sure you want to delete the ${trade.symbol} trade?`)) {
      await deleteTrade(trade.id);
      if (selectedTrade?.id === trade.id) {
        setSelectedTrade(null);
      }
    }
  };

  const handleEdit = (trade: InstitutionalTrade) => {
    // Navigate to edit trade page
    navigate(`/add-trade?edit=${trade.id}`);
  };

  const handleExport = () => {
    exportTradesToCSV(trades, `trade-log-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (loading && trades.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="h-96 bg-slate-700 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">Professional Trade Log</h1>
            <p className="text-slate-400">
              Comprehensive trade analysis and management dashboard ({totalCount.toLocaleString()} total trades)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="gap-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              onClick={() => navigate('/add-trade')}
            >
              <Plus className="w-4 h-4" />
              Add Trade
            </Button>
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleExport}
              disabled={trades.length === 0}
            >
              <Download className="w-4 h-4" />
              Export ({trades.length})
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Filters & Controls */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-400" />
              Filters & Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Directions</SelectItem>
                  <SelectItem value="long" className="text-white hover:bg-slate-700">Long Only</SelectItem>
                  <SelectItem value="short" className="text-white hover:bg-slate-700">Short Only</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={groupBy} onValueChange={(value: 'day' | 'week' | 'month') => setGroupBy(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="day" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      By Day
                    </div>
                  </SelectItem>
                  <SelectItem value="week" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      By Week
                    </div>
                  </SelectItem>
                  <SelectItem value="month" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      By Month
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {trades.filter(t => t.exit_price && (t.direction === 'long' ? t.exit_price > t.entry_price : t.exit_price < t.entry_price)).length} Winners
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                  {trades.filter(t => t.exit_price && (t.direction === 'long' ? t.exit_price < t.entry_price : t.exit_price > t.entry_price)).length} Losers
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trade List */}
          <div className="lg:col-span-2 space-y-4">
            {trades.length === 0 && !loading ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="w-16 h-16 text-slate-400 mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No trades found</h3>
                  <p className="text-slate-400 mb-4">Start building your trading history by adding your first trade.</p>
                  <Button onClick={() => navigate('/add-trade')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Trade
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <TradeLogGrouping
                trades={trades}
                groupBy={groupBy}
                onTradeClick={handleTradeClick}
                selectedTrade={selectedTrade}
              />
            )}
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  {loading ? (
                    'Loading...'
                  ) : (
                    'Load More Trades'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Detailed Trade Panel */}
          <div className="lg:col-span-1">
            {selectedTrade ? (
              <div className="sticky top-6">
                <DetailedTradePanel
                  trade={selectedTrade}
                  onEdit={() => handleEdit(selectedTrade)}
                  onDelete={() => handleDelete(selectedTrade)}
                  onClose={() => setSelectedTrade(null)}
                />
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="w-12 h-12 text-slate-400 mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Select a Trade</h3>
                  <p className="text-slate-400 text-sm">
                    Click on any trade from the list to view detailed information, notes, and screenshots.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradeLog;
