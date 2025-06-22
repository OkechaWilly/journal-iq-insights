
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RiskMetrics {
  id: string;
  user_id: string;
  calc_date: string;
  var_95?: number;
  expected_shortfall?: number;
  risk_of_ruin?: number;
  sharpe_ratio?: number;
  sortino_ratio?: number;
  max_drawdown?: number;
  volatility?: number;
  beta?: number;
  alpha?: number;
  created_at: string;
  updated_at: string;
}

export const useRiskMetrics = () => {
  const [metrics, setMetrics] = useState<RiskMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRiskMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('risk_metrics')
        .select('*')
        .order('calc_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      
      setMetrics(data || []);
      setCurrentMetrics(data?.[0] || null);
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

  const getRiskLevel = (metrics: RiskMetrics): 'low' | 'medium' | 'high' => {
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
