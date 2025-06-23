
import { supabase } from '@/integrations/supabase/client';
import type { InstitutionalTrade, TradeMetrics, RiskMetric, AuditLog, AIInsight } from '@/types/trade';
import type { Database } from '@/integrations/supabase/types';

type DatabaseTrade = Database['public']['Tables']['trades']['Row'];
type DatabaseAuditLog = Database['public']['Tables']['audit_logs']['Row'];
type DatabaseAIInsight = Database['public']['Tables']['ai_insights']['Row'];

export const getTrades = async (): Promise<InstitutionalTrade[]> => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Cast database rows to our interface with proper type assertions
  return (data || []).map((trade: DatabaseTrade): InstitutionalTrade => ({
    ...trade,
    direction: trade.direction as 'long' | 'short',
    exit_price: trade.exit_price || null,
    tags: trade.tags || null,
    emotional_state: trade.emotional_state || null,
    notes: trade.notes || null,
    screenshot_url: trade.screenshot_url || null,
    execution_quality: undefined,
    slippage: undefined,
    ai_insights: undefined
  }));
};

export const getTradeMetrics = async (): Promise<TradeMetrics | null> => {
  const { data, error } = await supabase
    .from('user_metrics')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getRiskMetrics = async (): Promise<RiskMetric[]> => {
  const { data, error } = await supabase
    .from('risk_metrics')
    .select('*')
    .order('calc_date', { ascending: false })
    .limit(30);

  if (error) throw error;
  return data || [];
};

export const getAuditLogs = async (limit = 50): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  // Cast database rows to our interface
  return (data || []).map((log: DatabaseAuditLog): AuditLog => ({
    ...log,
    old_values: (log.old_values as Record<string, any>) || null,
    new_values: (log.new_values as Record<string, any>) || null,
    ip_address: log.ip_address as string | null
  }));
};

export const getAIInsights = async (): Promise<AIInsight[]> => {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .is('dismissed_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Cast database rows to our interface
  return (data || []).map((insight: DatabaseAIInsight): AIInsight => ({
    ...insight,
    insight_type: insight.insight_type as 'pattern' | 'risk-warning' | 'opportunity',
    actionable_data: (insight.actionable_data as Record<string, any>) || null
  }));
};

export const createTrade = async (trade: Omit<InstitutionalTrade, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<InstitutionalTrade> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trades')
    .insert([{
      ...trade,
      user_id: user.id
    }])
    .select()
    .single();

  if (error) throw error;
  
  // Cast the returned data
  return {
    ...data,
    direction: data.direction as 'long' | 'short',
    execution_quality: (data as any).execution_quality as 'excellent' | 'good' | 'fair' | 'poor' | undefined,
    slippage: (data as any).slippage || undefined,
    ai_insights: (data as any).ai_insights as { pattern: string; confidence: number; actionable: boolean } | undefined
  };
};

export const updateTrade = async (id: string, updates: Partial<InstitutionalTrade>): Promise<InstitutionalTrade> => {
  const { data, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Cast the returned data
  return {
    ...data,
    direction: data.direction as 'long' | 'short',
    execution_quality: (data as any).execution_quality as 'excellent' | 'good' | 'fair' | 'poor' | undefined,
    slippage: (data as any).slippage || undefined,
    ai_insights: (data as any).ai_insights as { pattern: string; confidence: number; actionable: boolean } | undefined
  };
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
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.rpc('log_audit_event', {
    p_user_id: user.id,
    p_action_type: actionType,
    p_resource_type: resourceType,
    p_resource_id: resourceId,
    p_old_values: oldValues,
    p_new_values: newValues
  });
};
