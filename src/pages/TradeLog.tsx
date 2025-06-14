import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Edit, Trash2 } from "lucide-react";
import { Layout } from '@/components/Layout';

const TradeLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock trade data
  const trades = [
    {
      id: 1,
      date: "2024-01-15",
      symbol: "AAPL",
      type: "Stock",
      side: "Buy",
      quantity: 100,
      entryPrice: 150.25,
      exitPrice: 155.75,
      pnl: 550.00,
      status: "Closed"
    },
    {
      id: 2,
      date: "2024-01-14",
      symbol: "EURUSD",
      type: "Forex",
      side: "Sell",
      quantity: 10000,
      entryPrice: 1.0850,
      exitPrice: 1.0820,
      pnl: 300.00,
      status: "Closed"
    },
    {
      id: 3,
      date: "2024-01-13",
      symbol: "TSLA",
      type: "Stock",
      side: "Buy",
      quantity: 50,
      entryPrice: 240.00,
      exitPrice: null,
      pnl: -125.00,
      status: "Open"
    },
    {
      id: 4,
      date: "2024-01-12",
      symbol: "BTC/USD",
      type: "Crypto",
      side: "Buy",
      quantity: 0.5,
      entryPrice: 42000,
      exitPrice: 43500,
      pnl: 750.00,
      status: "Closed"
    }
  ];

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || trade.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? "text-green-600" : "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    return status === "Open" ? 
      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge> :
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Closed</Badge>;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trade Log</h2>
            <p className="text-gray-600">Browse and review all your journaled trades. Filter, edit, or analyze past trades.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="options">Options</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.date}</TableCell>
                      <TableCell className="font-semibold">{trade.symbol}</TableCell>
                      <TableCell>{trade.type}</TableCell>
                      <TableCell>
                        <Badge variant={trade.side === "Buy" ? "default" : "secondary"} className={trade.side === "Buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {trade.side}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "-"}</TableCell>
                      <TableCell className={`font-semibold ${getPnLColor(trade.pnl)}`}>
                        ${trade.pnl.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(trade.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TradeLog;
