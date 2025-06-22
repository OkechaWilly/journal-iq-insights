
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { InstitutionalTrade } from '@/types/trade';

// Use InstitutionalTrade as the main type
type Trade = InstitutionalTrade;

interface UseTradesPaginatedResult {
  trades: Trade[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  totalCount: number;
  refresh: () => void;
}

interface UseTradesPaginatedOptions {
  pageSize?: number;
  search?: string;
  direction?: string | null;
}

export const useTradesPaginated = (options: UseTradesPaginatedOptions = {}): UseTradesPaginatedResult => {
  const { pageSize = 50, search = '', direction = null } = options;
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const { toast } = useToast();

  const fetchTrades = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentOffset = reset ? 0 : offset;
      
      // Build query
      let query = supabase
        .from('trades')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + pageSize - 1);

      if (search) {
        query = query.ilike('symbol', `%${search}%`);
      }

      if (direction) {
        query = query.eq('direction', direction);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Cast the data to our Trade type
      const newTrades = (data || []).map((trade): Trade => ({
        ...trade,
        direction: trade.direction as 'long' | 'short',
        execution_quality: trade.execution_quality as 'excellent' | 'good' | 'fair' | 'poor' | undefined,
        slippage: trade.slippage || undefined,
        ai_insights: trade.ai_insights as { pattern: string; confidence: number; actionable: boolean } | undefined
      }));
      
      if (reset) {
        setTrades(newTrades);
        setOffset(pageSize);
      } else {
        setTrades(prev => [...prev, ...newTrades]);
        setOffset(prev => prev + pageSize);
      }

      setTotalCount(count || 0);
      setHasMore(newTrades.length === pageSize);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
      toast({
        title: "Error",
        description: "Failed to fetch trades",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchTrades(false);
    }
  };

  const refresh = () => {
    setOffset(0);
    fetchTrades(true);
  };

  useEffect(() => {
    refresh();
  }, [search, direction]);

  return {
    trades,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount,
    refresh
  };
};
