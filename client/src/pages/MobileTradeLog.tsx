
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SwipeableTradeItem } from '@/components/mobile/SwipeableTradeItem';
import { DetailedTradeView } from '@/components/mobile/DetailedTradeView';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Filter, Plus }
 from 'lucide-react';
import { useTradesPaginated } from '@/hooks/useTradesPaginated';
import { useTrades } from '@/hooks/useTrades';
import { Trade } from '@/hooks/useTrades';

const MobileTradeLog = () => {
  const [search, setSearch] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { trades, loading, hasMore, loadMore } = useTradesPaginated({
    pageSize: 20,
    search
  });
  
  const { deleteTrade } = useTrades();

  const handleEdit = (trade: Trade) => {
    console.log('Edit trade:', trade.id);
    // Navigate to edit form
  };

  const handleDelete = async (trade: Trade) => {
    try {
      await deleteTrade(trade.id);
    } catch (error) {
      console.error('Failed to delete trade:', error);
    }
  };

  const handleView = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowDetails(true);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Trade Log</h2>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search trades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Trade List */}
        <div className="space-y-2">
          {trades.map((trade) => (
            <SwipeableTradeItem
              key={trade.id}
              trade={trade}
              onEdit={() => handleEdit(trade)}
              onDelete={() => handleDelete(trade)}
              onView={() => handleView(trade)}
            />
          ))}
          
          {hasMore && (
            <Button 
              onClick={loadMore}
              disabled={loading}
              className="w-full mt-4"
              variant="outline"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </div>

        {/* Trade Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-md max-h-[90vh] overflow-y-auto">
            {selectedTrade && (
              <DetailedTradeView 
                trade={selectedTrade}
                onEdit={() => {
                  handleEdit(selectedTrade);
                  setShowDetails(false);
                }}
                onDelete={() => {
                  handleDelete(selectedTrade);
                  setShowDetails(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MobileTradeLog;
