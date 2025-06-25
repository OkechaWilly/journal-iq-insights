
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getRiskMetrics } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import type { RiskMetric } from '@/types/trade';

export const useRiskMetrics = () => {
  const [metrics, setMetrics] = useState<RiskMetric[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<RiskMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRiskMetrics = async () => {
    try {
      const data = await getRiskMetrics();
      setMetrics(data);
      setCurrentMetrics(data[0] || null);
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch risk metrics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('calculate_advanced_risk_metrics', {
        p_user_id: user.id
      });

      if (error) throw error;
      
      await fetchRiskMetrics();
      
      toast({
        title: "Risk metrics updated",
        description: "Advanced risk calculations have been completed"
      });
    } catch (error) {
      console.error('Error calculating risk metrics:', error);
      toast({
        title: "Error",
        description: "Failed to calculate risk metrics",
        variant: "destructive"
      });
    }
  };

  const getRiskLevel = (metrics: RiskMetric): 'low' | 'medium' | 'high' => {
    if (!metrics.var_95 || !metrics.max_drawdown) return 'medium';
    
    const riskScore = 
      (Math.abs(metrics.var_95) > 1000 ? 2 : 1) +
      (metrics.max_drawdown > 0.15 ? 2 : metrics.max_drawdown > 0.05 ? 1 : 0) +
      (metrics.sharpe_ratio && metrics.sharpe_ratio < 0.5 ? 1 : 0);
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  };

  useEffect(() => {
    fetchRiskMetrics();
  }, []);

  return {
    metrics,
    currentMetrics,
    loading,
    calculateRiskMetrics,
    getRiskLevel,
    refetch: fetchRiskMetrics
  };
};
