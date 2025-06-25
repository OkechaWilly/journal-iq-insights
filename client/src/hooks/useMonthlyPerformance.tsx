
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MonthlyPerformance {
  id: string;
  user_id: string;
  month: string;
  total_trades: number;
  winning_trades: number;
  total_pnl: number;
  avg_pnl: number;
  created_at: string;
  updated_at: string;
}

export const useMonthlyPerformance = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMonthlyPerformance = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_performance')
        .select('*')
        .order('month', { ascending: false });

      if (error) throw error;
      setMonthlyData((data as MonthlyPerformance[]) || []);
    } catch (error) {
      console.error('Error fetching monthly performance:', error);
      toast({
        title: "Error",
        description: "Failed to fetch monthly performance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMonthlyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.rpc('refresh_monthly_performance', {
          p_user_id: user.id
        });
        
        if (error) throw error;
        await fetchMonthlyPerformance();
      }
    } catch (error) {
      console.error('Error refreshing monthly data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh monthly performance data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        fetchMonthlyPerformance();
      } else {
        setLoading(false);
      }
    });
  }, []);

  return {
    monthlyData,
    loading,
    refreshMonthlyData,
    refetch: fetchMonthlyPerformance
  };
};
