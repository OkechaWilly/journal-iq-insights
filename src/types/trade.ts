
export interface InstitutionalTrade {
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
  screenshot_url?: string;
  created_at: string;
  updated_at: string;
  execution_quality?: 'excellent' | 'good' | 'fair' | 'poor';
  slippage?: number;
  ai_insights?: {
    pattern: string;
    confidence: number;
    actionable: boolean;
  };
}

export interface TradeMetrics {
  total_pnl: number;
  win_rate: number;
  avg_risk_reward: number;
  total_trades: number;
  winning_trades: number;
  max_drawdown?: number;
  sharpe_ratio?: number;
}

export interface RiskMetric {
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

export interface AuditLog {
  id: number;
  user_id: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: 'pattern' | 'risk-warning' | 'opportunity';
  confidence_score: number;
  title: string;
  description: string;
  actionable_data?: Record<string, any>;
  trades_analyzed?: number;
  valid_until?: string;
  dismissed_at?: string;
  created_at: string;
}

export type ExecutionQuality = 'excellent' | 'good' | 'fair' | 'poor';
export type InsightType = 'pattern' | 'risk-warning' | 'opportunity';
export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'export';
