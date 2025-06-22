
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getTrades, getTradeMetrics, createTrade, updateTrade, deleteTrade, logAuditEvent } from '@/lib/supabase';
import type { InstitutionalTrade, TradeMetrics } from '@/types/trade';

export const useTrades = () => {
  const [trades, setTrades] = useState<InstitutionalTrade[]>([]);
  const [metrics, setMetrics] = useState<TradeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrades = async () => {
    try {
      const data = await getTrades();
      setTrades(data);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trades",
        variant: "destructive"
      });
    }
  };

  const fetchMetrics = async () => {
    try {
      const data = await getTradeMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const addTrade = async (tradeData: Omit<InstitutionalTrade, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTrade = await createTrade(tradeData);
      
      await logAuditEvent('create', 'trade', newTrade.id, null, newTrade);
      await fetchTrades();
      await fetchMetrics();
      
      toast({
        title: "Success",
        description: "Trade added successfully"
      });
      
      return newTrade;
    } catch (error) {
      console.error('Error adding trade:', error);
      toast({
        title: "Error",
        description: "Failed to add trade",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTradeData = async (id: string, updates: Partial<InstitutionalTrade>) => {
    try {
      const oldTrade = trades.find(t => t.id === id);
      const updatedTrade = await updateTrade(id, updates);
      
      await logAuditEvent('update', 'trade', id, oldTrade, updatedTrade);
      await fetchTrades();
      await fetchMetrics();
      
      toast({
        title: "Success",
        description: "Trade updated successfully"
      });
      
      return updatedTrade;
    } catch (error) {
      console.error('Error updating trade:', error);
      toast({
        title: "Error",
        description: "Failed to update trade",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTradeData = async (id: string) => {
    try {
      const oldTrade = trades.find(t => t.id === id);
      await deleteTrade(id);
      
      await logAuditEvent('delete', 'trade', id, oldTrade, null);
      await fetchTrades();
      await fetchMetrics();
      
      toast({
        title: "Success",
        description: "Trade deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTrades(), fetchMetrics()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    trades,
    metrics,
    loading,
    addTrade,
    updateTrade: updateTradeData,
    deleteTrade: deleteTradeData,
    refetch: () => Promise.all([fetchTrades(), fetchMetrics()])
  };
};
