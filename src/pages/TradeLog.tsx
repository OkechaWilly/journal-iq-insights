
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Edit, Trash2, Eye } from "lucide-react";
import { Layout } from '@/components/Layout';
import { useTrades } from '@/hooks/useTrades';
import { format } from 'date-fns';

const TradeLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { trades, loading, deleteTrade } = useTrades();

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || trade.direction === filterType;
    return matchesSearch && matchesFilter;
  });

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price) return 0;
    const pnl = trade.direction === 'long' 
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price) * trade.quantity;
    return pnl;
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? "text-emerald-400" : "text-red-400";
  };

  const getStatusBadge = (trade: any) => {
    const isOpen = !trade.exit_price;
    return isOpen ? 
      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">Open</Badge> :
      <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/30">Closed</Badge>;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      await deleteTrade(id);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading trades...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Trade Log</h2>
            <p className="text-slate-400 mt-1">Browse and review all your journaled trades. Filter, edit, or analyze past trades.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Filter & Search</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by direction" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Directions</SelectItem>
                  <SelectItem value="long" className="text-white hover:bg-slate-700">Long</SelectItem>
                  <SelectItem value="short" className="text-white hover:bg-slate-700">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Symbol</TableHead>
                    <TableHead className="text-slate-300">Direction</TableHead>
                    <TableHead className="text-slate-300">Quantity</TableHead>
                    <TableHead className="text-slate-300">Entry</TableHead>
                    <TableHead className="text-slate-300">Exit</TableHead>
                    <TableHead className="text-slate-300">P&L</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => {
                    const pnl = calculatePnL(trade);
                    return (
                      <TableRow key={trade.id} className="border-slate-700 hover:bg-slate-800/30">
                        <TableCell className="font-medium text-white">
                          {format(new Date(trade.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="font-semibold text-white">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={trade.direction === "long" ? "default" : "secondary"} 
                            className={trade.direction === "long" ? 
                              "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : 
                              "bg-red-500/10 text-red-400 border-red-500/30"
                            }
                          >
                            {trade.direction.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{trade.quantity}</TableCell>
                        <TableCell className="text-white">${Number(trade.entry_price).toFixed(2)}</TableCell>
                        <TableCell className="text-white">
                          {trade.exit_price ? `$${Number(trade.exit_price).toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className={`font-semibold ${getPnLColor(pnl)}`}>
                          ${pnl.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(trade)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {trade.screenshot_url && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700"
                                onClick={() => window.open(trade.screenshot_url, '_blank')}
                              >
                                <Eye className="w-3 h-3 text-slate-400" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700"
                            >
                              <Edit className="w-3 h-3 text-slate-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0 border-red-600 hover:bg-red-600/10 text-red-400"
                              onClick={() => handleDelete(trade.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredTrades.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  {trades.length === 0 ? "No trades found. Add your first trade to get started!" : "No trades match your search criteria."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TradeLog;
