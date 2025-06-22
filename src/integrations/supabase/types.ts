export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          actionable_data: Json | null
          confidence_score: number | null
          created_at: string | null
          description: string
          dismissed_at: string | null
          id: string
          insight_type: string
          title: string
          trades_analyzed: number | null
          user_id: string
          valid_until: string | null
        }
        Insert: {
          actionable_data?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          description: string
          dismissed_at?: string | null
          id?: string
          insight_type: string
          title: string
          trades_analyzed?: number | null
          user_id: string
          valid_until?: string | null
        }
        Update: {
          actionable_data?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          dismissed_at?: string | null
          id?: string
          insight_type?: string
          title?: string
          trades_analyzed?: number | null
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: number
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: number
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: number
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_performance: {
        Row: {
          avg_pnl: number | null
          created_at: string
          id: string
          month: string
          total_pnl: number | null
          total_trades: number | null
          updated_at: string
          user_id: string
          winning_trades: number | null
        }
        Insert: {
          avg_pnl?: number | null
          created_at?: string
          id?: string
          month: string
          total_pnl?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id: string
          winning_trades?: number | null
        }
        Update: {
          avg_pnl?: number | null
          created_at?: string
          id?: string
          month?: string
          total_pnl?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id?: string
          winning_trades?: number | null
        }
        Relationships: []
      }
      risk_metrics: {
        Row: {
          alpha: number | null
          beta: number | null
          calc_date: string
          created_at: string | null
          expected_shortfall: number | null
          id: string
          max_drawdown: number | null
          risk_of_ruin: number | null
          sharpe_ratio: number | null
          sortino_ratio: number | null
          updated_at: string | null
          user_id: string
          var_95: number | null
          volatility: number | null
        }
        Insert: {
          alpha?: number | null
          beta?: number | null
          calc_date?: string
          created_at?: string | null
          expected_shortfall?: number | null
          id?: string
          max_drawdown?: number | null
          risk_of_ruin?: number | null
          sharpe_ratio?: number | null
          sortino_ratio?: number | null
          updated_at?: string | null
          user_id: string
          var_95?: number | null
          volatility?: number | null
        }
        Update: {
          alpha?: number | null
          beta?: number | null
          calc_date?: string
          created_at?: string | null
          expected_shortfall?: number | null
          id?: string
          max_drawdown?: number | null
          risk_of_ruin?: number | null
          sharpe_ratio?: number | null
          sortino_ratio?: number | null
          updated_at?: string | null
          user_id?: string
          var_95?: number | null
          volatility?: number | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          direction: string
          emotional_state: string | null
          entry_price: number
          exit_price: number | null
          id: string
          notes: string | null
          quantity: number
          screenshot_url: string | null
          symbol: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          emotional_state?: string | null
          entry_price: number
          exit_price?: number | null
          id?: string
          notes?: string | null
          quantity: number
          screenshot_url?: string | null
          symbol: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          emotional_state?: string | null
          entry_price?: number
          exit_price?: number | null
          id?: string
          notes?: string | null
          quantity?: number
          screenshot_url?: string | null
          symbol?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          avg_risk_reward: number | null
          total_pnl: number | null
          total_trades: number | null
          updated_at: string
          user_id: string
          win_rate: number | null
          winning_trades: number | null
        }
        Insert: {
          avg_risk_reward?: number | null
          total_pnl?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id: string
          win_rate?: number | null
          winning_trades?: number | null
        }
        Update: {
          avg_risk_reward?: number | null
          total_pnl?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id?: string
          win_rate?: number | null
          winning_trades?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_advanced_risk_metrics: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      calculate_trade_pnl: {
        Args: {
          p_entry_price: number
          p_exit_price: number
          p_quantity: number
          p_direction: string
        }
        Returns: number
      }
      log_audit_event: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: undefined
      }
      refresh_monthly_performance: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_user_metrics: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
