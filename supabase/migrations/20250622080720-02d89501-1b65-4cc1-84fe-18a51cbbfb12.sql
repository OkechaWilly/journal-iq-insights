
-- Advanced Risk Metrics Table
CREATE TABLE IF NOT EXISTS risk_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  calc_date DATE NOT NULL DEFAULT CURRENT_DATE,
  var_95 DECIMAL(12,4), -- Value at Risk (95% confidence)
  expected_shortfall DECIMAL(12,4), -- Conditional VaR
  risk_of_ruin DECIMAL(8,4), -- Probability of ruin
  sharpe_ratio DECIMAL(8,4),
  sortino_ratio DECIMAL(8,4),
  max_drawdown DECIMAL(8,4),
  volatility DECIMAL(8,4),
  beta DECIMAL(8,4), -- Market beta
  alpha DECIMAL(8,4), -- Jensen's alpha
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, calc_date)
);

-- Audit Trail System
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'trade', 'report', 'settings'
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pattern Recognition Cache
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'pattern', 'risk-warning', 'opportunity'
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actionable_data JSONB,
  trades_analyzed INTEGER,
  valid_until TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE risk_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for risk_metrics
CREATE POLICY "Users can view own risk metrics" ON risk_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk metrics" ON risk_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own risk metrics" ON risk_metrics
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for audit_logs (read-only for users)
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for ai_insights
CREATE POLICY "Users can view own AI insights" ON ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own AI insights" ON ai_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- Advanced Risk Calculation Function
CREATE OR REPLACE FUNCTION calculate_advanced_risk_metrics(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_returns DECIMAL[];
  v_sorted_returns DECIMAL[];
  v_var_95 DECIMAL;
  v_expected_shortfall DECIMAL;
  v_volatility DECIMAL;
  v_mean_return DECIMAL;
  v_sharpe DECIMAL;
  v_max_dd DECIMAL;
  v_peak DECIMAL := 0;
  v_trough DECIMAL := 0;
  v_running_total DECIMAL := 0;
BEGIN
  -- Get daily returns for the user
  SELECT ARRAY_AGG(daily_pnl ORDER BY trade_date)
  INTO v_returns
  FROM (
    SELECT 
      DATE(created_at) as trade_date,
      SUM(calculate_trade_pnl(entry_price, exit_price, quantity, direction)) as daily_pnl
    FROM trades 
    WHERE user_id = p_user_id 
      AND exit_price IS NOT NULL
      AND created_at >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY DATE(created_at)
  ) daily_returns;

  -- Skip if insufficient data
  IF array_length(v_returns, 1) < 30 THEN
    RETURN;
  END IF;

  -- Calculate basic statistics
  SELECT 
    AVG(val),
    STDDEV(val)
  INTO v_mean_return, v_volatility
  FROM unnest(v_returns) val;

  -- Calculate VaR (95% confidence) - 5th percentile
  SELECT val INTO v_var_95
  FROM (
    SELECT val, 
           ROW_NUMBER() OVER (ORDER BY val) as rn,
           COUNT(*) OVER () as total
    FROM unnest(v_returns) val
  ) ranked
  WHERE rn = CEIL(0.05 * total);

  -- Calculate Expected Shortfall (average of losses beyond VaR)
  SELECT AVG(val) INTO v_expected_shortfall
  FROM unnest(v_returns) val
  WHERE val <= v_var_95;

  -- Calculate Sharpe Ratio (assuming risk-free rate of 0)
  IF v_volatility > 0 THEN
    v_sharpe := v_mean_return / v_volatility;
  END IF;

  -- Calculate Maximum Drawdown
  FOR i IN 1..array_length(v_returns, 1) LOOP
    v_running_total := v_running_total + v_returns[i];
    
    IF v_running_total > v_peak THEN
      v_peak := v_running_total;
      v_trough := v_running_total;
    END IF;
    
    IF v_running_total < v_trough THEN
      v_trough := v_running_total;
    END IF;
    
    IF v_peak > 0 AND (v_peak - v_trough) / v_peak > v_max_dd THEN
      v_max_dd := (v_peak - v_trough) / v_peak;
    END IF;
  END LOOP;

  -- Insert or update risk metrics
  INSERT INTO risk_metrics (
    user_id, calc_date, var_95, expected_shortfall, 
    sharpe_ratio, max_drawdown, volatility
  )
  VALUES (
    p_user_id, CURRENT_DATE, v_var_95, v_expected_shortfall,
    v_sharpe, v_max_dd, v_volatility
  )
  ON CONFLICT (user_id, calc_date)
  DO UPDATE SET
    var_95 = EXCLUDED.var_95,
    expected_shortfall = EXCLUDED.expected_shortfall,
    sharpe_ratio = EXCLUDED.sharpe_ratio,
    max_drawdown = EXCLUDED.max_drawdown,
    volatility = EXCLUDED.volatility,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit logging function
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, action_type, resource_type, resource_id,
    old_values, new_values
  )
  VALUES (
    p_user_id, p_action_type, p_resource_type, p_resource_id,
    p_old_values, p_new_values
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically calculate risk metrics when trades change
CREATE OR REPLACE FUNCTION trigger_risk_calculation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_advanced_risk_metrics(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_advanced_risk_metrics(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on trades table for risk calculation
DROP TRIGGER IF EXISTS calculate_risk_metrics_trigger ON trades;
CREATE TRIGGER calculate_risk_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON trades
  FOR EACH ROW EXECUTE FUNCTION trigger_risk_calculation();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_metrics_user_date ON risk_metrics(user_id, calc_date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_valid ON ai_insights(user_id, valid_until) WHERE dismissed_at IS NULL;
