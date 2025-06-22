
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAuditLogs, logAuditEvent } from '@/lib/supabase';
import type { AuditLog } from '@/types/trade';

export const useAuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAuditLogs = async (limit = 50) => {
    try {
      const data = await getAuditLogs(limit);
      setLogs(data);
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
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    try {
      await logAuditEvent(actionType, resourceType, resourceId, oldValues, newValues);
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
