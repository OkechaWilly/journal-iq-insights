
-- Create a proper table for monthly performance
CREATE TABLE IF NOT EXISTS monthly_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month DATE NOT NULL,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  total_pnl DECIMAL(12,2) DEFAULT 0,
  avg_pnl DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Enable RLS on the table
ALTER TABLE monthly_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for monthly_performance table
CREATE POLICY "Users can view own monthly performance" ON monthly_performance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monthly performance" ON monthly_performance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own monthly performance" ON monthly_performance
  FOR UPDATE USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_monthly_performance_user_month ON monthly_performance(user_id, month DESC);

-- Create function to refresh monthly performance data
CREATE OR REPLACE FUNCTION refresh_monthly_performance(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete existing data for the user
  DELETE FROM monthly_performance WHERE user_id = p_user_id;
  
  -- Insert fresh monthly performance data
  INSERT INTO monthly_performance (user_id, month, total_trades, winning_trades, total_pnl, avg_pnl)
  SELECT 
    user_id,
    DATE_TRUNC('month', created_at)::DATE as month,
    COUNT(*) as total_trades,
    SUM(CASE WHEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) > 0 THEN 1 ELSE 0 END) as winning_trades,
    SUM(calculate_trade_pnl(entry_price, exit_price, quantity, direction)) as total_pnl,
    AVG(calculate_trade_pnl(entry_price, exit_price, quantity, direction)) as avg_pnl
  FROM trades 
  WHERE user_id = p_user_id AND exit_price IS NOT NULL
  GROUP BY user_id, DATE_TRUNC('month', created_at)::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update monthly performance when trades change
CREATE OR REPLACE FUNCTION trigger_refresh_monthly_performance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_monthly_performance(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM refresh_monthly_performance(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on trades table
DROP TRIGGER IF EXISTS refresh_monthly_performance_trigger ON trades;
CREATE TRIGGER refresh_monthly_performance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON trades
  FOR EACH ROW EXECUTE FUNCTION trigger_refresh_monthly_performance();
