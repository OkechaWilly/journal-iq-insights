import { supabase } from '@/integrations/supabase/client';
import type { InstitutionalTrade, TradeMetrics, RiskMetric, AuditLog, AIInsight } from '@/types/trade';

export const getTrades = async (): Promise<InstitutionalTrade[]> => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTradeMetrics = async (): Promise<TradeMetrics | null> => {
  const { data, error } = await supabase
    .from('user_metrics')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }

  return data ? {
    total_trades: data.total_trades || 0,
    winning_trades: data.winning_trades || 0,
    total_pnl: parseFloat(data.total_pnl || '0'),
    avg_risk_reward: parseFloat(data.avg_risk_reward || '0'),
    win_rate: data.total_trades > 0 ? (data.winning_trades / data.total_trades) * 100 : 0
  } : null;
};

export const getRiskMetrics = async (): Promise<RiskMetric[]> => {
  const { data, error } = await supabase
    .from('risk_metrics')
    .select('*')
    .order('calc_date', { ascending: false });

  if (error) throw error;
  return data?.map(item => ({
    id: item.id,
    user_id: item.user_id,
    calc_date: item.calc_date,
    var_95: item.var_95 ?? undefined,
    expected_shortfall: item.expected_shortfall ?? undefined,
    risk_of_ruin: item.risk_of_ruin ?? undefined,
    sharpe_ratio: item.sharpe_ratio ?? undefined,
    sortino_ratio: item.sortino_ratio ?? undefined,
    max_drawdown: item.max_drawdown ?? undefined,
    volatility: item.volatility ?? undefined,
    beta: item.beta ?? undefined,
    alpha: item.alpha ?? undefined,
    created_at: item.created_at,
    updated_at: item.updated_at
  })) || [];
};

export const getAuditLogs = async (limit = 50): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getAIInsights = async (): Promise<AIInsight[]> => {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .is('dismissed_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createTrade = async (trade: Omit<InstitutionalTrade, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<InstitutionalTrade> => {
  const { data, error } = await supabase
    .from('trades')
    .insert(trade)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTrade = async (id: string, updates: Partial<InstitutionalTrade>): Promise<InstitutionalTrade> => {
  const { data, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTrade = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const logAuditEvent = async (
  actionType: string,
  resourceType: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any
): Promise<void> => {
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      action_type: actionType,
      resource_type: resourceType,
      resource_id: resourceId || null,
      old_values: oldValues || null,
      new_values: newValues || null
    });

  if (error) console.error('Error logging audit event:', error);
};