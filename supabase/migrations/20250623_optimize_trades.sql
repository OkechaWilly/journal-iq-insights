
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trades_user_symbol ON trades(user_id, symbol);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_user_date ON trades(user_id, DATE(created_at));

-- Add materialized view for daily metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_metrics AS
SELECT
  user_id,
  DATE(created_at) as trade_date,
  COUNT(*) as trade_count,
  SUM(CASE 
    WHEN exit_price IS NOT NULL AND direction = 'long' AND exit_price > entry_price THEN 1 
    WHEN exit_price IS NOT NULL AND direction = 'short' AND entry_price > exit_price THEN 1
    ELSE 0 
  END) as win_count,
  SUM(CASE WHEN exit_price IS NOT NULL THEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) ELSE 0 END) as total_pnl
FROM trades
GROUP BY user_id, DATE(created_at);

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_daily_metrics_user_date ON daily_metrics(user_id, trade_date DESC);

-- Add function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_daily_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics;
END;
$$;

-- Add audit logging function
CREATE OR REPLACE FUNCTION log_trade_changes() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, old_values)
    VALUES (OLD.user_id, 'delete', 'trade', OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, old_values, new_values)
    VALUES (NEW.user_id, 'update', 'trade', NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, new_values)
    VALUES (NEW.user_id, 'insert', 'trade', NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create audit trigger
DROP TRIGGER IF EXISTS trade_audit_trigger ON trades;
CREATE TRIGGER trade_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON trades
  FOR EACH ROW EXECUTE FUNCTION log_trade_changes();

-- Add RLS policies for audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" 
  ON audit_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add advanced analytics function
CREATE OR REPLACE FUNCTION get_trade_analytics(p_user_id uuid, p_time_range text DEFAULT '30d')
RETURNS TABLE (
  win_rate numeric,
  win_rate_change numeric,
  total_pnl numeric,
  avg_pnl numeric,
  total_trades integer,
  equity_curve jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_days integer;
  v_current_win_rate numeric;
  v_previous_win_rate numeric;
BEGIN
  -- Parse time range
  v_days := CASE 
    WHEN p_time_range = '7d' THEN 7
    WHEN p_time_range = '30d' THEN 30
    WHEN p_time_range = '90d' THEN 90
    ELSE 30
  END;

  -- Calculate current period metrics
  SELECT 
    CASE WHEN COUNT(*) > 0 THEN 
      (COUNT(CASE WHEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) > 0 THEN 1 END)::numeric / COUNT(*)::numeric) * 100 
    ELSE 0 END,
    COALESCE(SUM(calculate_trade_pnl(entry_price, exit_price, quantity, direction)), 0),
    CASE WHEN COUNT(*) > 0 THEN 
      COALESCE(AVG(calculate_trade_pnl(entry_price, exit_price, quantity, direction)), 0) 
    ELSE 0 END,
    COUNT(*)
  INTO win_rate, total_pnl, avg_pnl, total_trades
  FROM trades 
  WHERE user_id = p_user_id 
    AND exit_price IS NOT NULL
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * v_days;

  -- Calculate previous period win rate for comparison
  SELECT 
    CASE WHEN COUNT(*) > 0 THEN 
      (COUNT(CASE WHEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) > 0 THEN 1 END)::numeric / COUNT(*)::numeric) * 100 
    ELSE 0 END
  INTO v_previous_win_rate
  FROM trades 
  WHERE user_id = p_user_id 
    AND exit_price IS NOT NULL
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * (v_days * 2)
    AND created_at < CURRENT_DATE - INTERVAL '1 day' * v_days;

  win_rate_change := win_rate - COALESCE(v_previous_win_rate, 0);

  -- Generate equity curve data
  SELECT json_agg(
    json_build_object(
      'date', trade_date,
      'value', running_total
    ) ORDER BY trade_date
  )
  INTO equity_curve
  FROM (
    SELECT 
      DATE(created_at) as trade_date,
      SUM(SUM(calculate_trade_pnl(entry_price, exit_price, quantity, direction))) 
        OVER (ORDER BY DATE(created_at)) as running_total
    FROM trades
    WHERE user_id = p_user_id 
      AND exit_price IS NOT NULL
      AND created_at >= CURRENT_DATE - INTERVAL '1 day' * v_days
    GROUP BY DATE(created_at)
  ) equity_data;

  RETURN QUERY SELECT win_rate, win_rate_change, total_pnl, avg_pnl, total_trades, equity_curve;
END;
$$;
