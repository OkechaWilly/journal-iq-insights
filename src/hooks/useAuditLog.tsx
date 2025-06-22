
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuditLog {
  id: number;
  user_id: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export const useAuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAuditLogs = async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Type-safe conversion
      const typedLogs: AuditLog[] = (data || []).map(item => ({
        ...item,
        ip_address: item.ip_address ? String(item.ip_address) : undefined,
        user_agent: item.user_agent || undefined,
        session_id: item.session_id || undefined,
        resource_id: item.resource_id || undefined
      }));
      
      setLogs(typedLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (
    actionType: string,
    resourceType: string,
    resourceId?: string,
    oldValues?: any,
    newValues?: any
  ) => {
    try {
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
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return {
    logs,
    loading,
    logAction,
    refetch: fetchAuditLogs
  };
};
