// API client to replace Supabase functionality
import type { InstitutionalTrade as Trade, TradeMetrics, RiskMetric, AuditLog, AIInsight } from '@/types/trade';

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Trade methods
  async getTrades(limit = 50, offset = 0): Promise<Trade[]> {
    return this.request<Trade[]>(`/trades?limit=${limit}&offset=${offset}`);
  }

  async getTradeById(id: string): Promise<Trade> {
    return this.request<Trade>(`/trades/${id}`);
  }

  async createTrade(trade: Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Trade> {
    return this.request<Trade>('/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
    });
  }

  async updateTrade(id: string, updates: Partial<Trade>): Promise<Trade> {
    return this.request<Trade>(`/trades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTrade(id: string): Promise<void> {
    await this.request(`/trades/${id}`, {
      method: 'DELETE',
    });
  }

  // Metrics methods
  async getMetrics(): Promise<TradeMetrics> {
    return this.request<TradeMetrics>('/metrics');
  }

  async getMonthlyPerformance(): Promise<any[]> {
    return this.request<any[]>('/monthly-performance');
  }

  async getRiskMetrics(): Promise<RiskMetric[]> {
    return this.request<RiskMetric[]>('/risk-metrics');
  }

  // Audit and insights methods
  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    return this.request<AuditLog[]>(`/audit-logs?limit=${limit}`);
  }

  async getAiInsights(): Promise<AIInsight[]> {
    return this.request<AIInsight[]>('/ai-insights');
  }

  async createAiInsight(insight: Omit<AIInsight, 'id' | 'user_id' | 'created_at'>): Promise<AIInsight> {
    return this.request<AIInsight>('/ai-insights', {
      method: 'POST',
      body: JSON.stringify(insight),
    });
  }
}

export const apiClient = new ApiClient();