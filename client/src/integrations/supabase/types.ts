export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trades: {
        Row: {
          id: string
          user_id: string
          symbol: string
          direction: string
          entry_price: string
          exit_price: string | null
          quantity: string
          tags: string[] | null
          emotional_state: string | null
          notes: string | null
          screenshot_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          symbol: string
          direction: string
          entry_price: string
          exit_price?: string | null
          quantity: string
          tags?: string[] | null
          emotional_state?: string | null
          notes?: string | null
          screenshot_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          direction?: string
          entry_price?: string
          exit_price?: string | null
          quantity?: string
          tags?: string[] | null
          emotional_state?: string | null
          notes?: string | null
          screenshot_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_metrics: {
        Row: {
          id: string
          user_id: string
          total_trades: number
          winning_trades: number
          total_pnl: string
          avg_pnl: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          total_trades?: number
          winning_trades?: number
          total_pnl?: string
          avg_pnl?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_trades?: number
          winning_trades?: number
          total_pnl?: string
          avg_pnl?: string
          created_at?: string
          updated_at?: string
        }
      }
      monthly_performance: {
        Row: {
          id: string
          user_id: string
          month: string
          total_trades: number
          winning_trades: number
          total_pnl: string
          avg_pnl: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          month: string
          total_trades?: number
          winning_trades?: number
          total_pnl?: string
          avg_pnl?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          total_trades?: number
          winning_trades?: number
          total_pnl?: string
          avg_pnl?: string
          created_at?: string
          updated_at?: string
        }
      }
      risk_metrics: {
        Row: {
          id: number
          user_id: string
          var_95: number | null
          expected_shortfall: number | null
          risk_of_ruin: number | null
          sharpe_ratio: number | null
          sortino_ratio: number | null
          max_drawdown: number | null
          beta: number | null
          alpha: number | null
          volatility: number | null
          calc_date: string
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string
          var_95?: number | null
          expected_shortfall?: number | null
          risk_of_ruin?: number | null
          sharpe_ratio?: number | null
          sortino_ratio?: number | null
          max_drawdown?: number | null
          beta?: number | null
          alpha?: number | null
          volatility?: number | null
          calc_date?: string
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          var_95?: number | null
          expected_shortfall?: number | null
          risk_of_ruin?: number | null
          sharpe_ratio?: number | null
          sortino_ratio?: number | null
          max_drawdown?: number | null
          beta?: number | null
          alpha?: number | null
          volatility?: number | null
          calc_date?: string
          created_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: number
          user_id: string
          action_type: string
          resource_type: string
          resource_id: string | null
          old_values: Json
          new_values: Json
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string
          action_type: string
          resource_type: string
          resource_id?: string | null
          old_values?: Json
          new_values?: Json
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          action_type?: string
          resource_type?: string
          resource_id?: string | null
          old_values?: Json
          new_values?: Json
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string | null
        }
      }
      ai_insights: {
        Row: {
          id: string
          user_id: string
          insight_type: string
          confidence_score: string | null
          title: string
          description: string
          actionable_data: Json
          trades_analyzed: number | null
          valid_until: string | null
          dismissed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          insight_type: string
          confidence_score?: string | null
          title: string
          description: string
          actionable_data?: Json
          trades_analyzed?: number | null
          valid_until?: string | null
          dismissed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          insight_type?: string
          confidence_score?: string | null
          title?: string
          description?: string
          actionable_data?: Json
          trades_analyzed?: number | null
          valid_until?: string | null
          dismissed_at?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}