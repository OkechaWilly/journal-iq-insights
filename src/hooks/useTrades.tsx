
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  entry_price: number;
  exit_price?: number;
  quantity: number;
  direction: 'long' | 'short';
  tags?: string[];
  emotional_state?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserMetrics {
  user_id: string;
  total_pnl: number;
  win_rate: number;
  avg_risk_reward: number;
  total_trades: number;
  winning_trades: number;
  updated_at: string;
}

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
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
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([{
          ...tradeData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchTrades();
      await fetchMetrics();
      
      toast({
        title: "Success",
        description: "Trade added successfully"
      });
      
      return data;
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

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchTrades();
      await fetchMetrics();
      
      toast({
        title: "Success",
        description: "Trade updated successfully"
      });
      
      return data;
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

  const deleteTrade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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

    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        loadData();
        
        // Set up real-time subscription
        const subscription = supabase
          .channel('trades-changes')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'trades' },
            () => {
              fetchTrades();
              fetchMetrics();
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } else {
        setLoading(false);
      }
    });
  }, []);

  return {
    trades,
    metrics,
    loading,
    addTrade,
    updateTrade,
    deleteTrade,
    refetch: () => Promise.all([fetchTrades(), fetchMetrics()])
  };
};
