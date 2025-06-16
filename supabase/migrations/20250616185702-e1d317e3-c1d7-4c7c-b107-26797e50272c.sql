
-- Create trades table
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  entry_price DECIMAL(12,4) NOT NULL,
  exit_price DECIMAL(12,4),
  quantity DECIMAL(12,4) NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  tags TEXT[],
  emotional_state TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_metrics table
CREATE TABLE public.user_metrics (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_pnl DECIMAL(12,2) DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  avg_risk_reward DECIMAL(8,4) DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trades table
CREATE POLICY "Users can view their own trades" 
  ON public.trades 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades" 
  ON public.trades 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" 
  ON public.trades 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" 
  ON public.trades 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for user_metrics table
CREATE POLICY "Users can view their own metrics" 
  ON public.user_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics" 
  ON public.user_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics" 
  ON public.user_metrics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for optimization
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_created_at ON public.trades(created_at DESC);
CREATE INDEX idx_trades_user_created ON public.trades(user_id, created_at DESC);
CREATE INDEX idx_user_metrics_user_id ON public.user_metrics(user_id);

-- Function to calculate P&L for a trade
CREATE OR REPLACE FUNCTION calculate_trade_pnl(
  p_entry_price DECIMAL,
  p_exit_price DECIMAL,
  p_quantity DECIMAL,
  p_direction TEXT
) RETURNS DECIMAL AS $$
BEGIN
  IF p_exit_price IS NULL THEN
    RETURN 0; -- Open trade
  END IF;
  
  IF p_direction = 'long' THEN
    RETURN (p_exit_price - p_entry_price) * p_quantity;
  ELSE -- short
    RETURN (p_entry_price - p_exit_price) * p_quantity;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user metrics
CREATE OR REPLACE FUNCTION update_user_metrics(p_user_id UUID) 
RETURNS VOID AS $$
DECLARE
  v_total_pnl DECIMAL := 0;
  v_total_trades INTEGER := 0;
  v_winning_trades INTEGER := 0;
  v_win_rate DECIMAL := 0;
  v_avg_risk_reward DECIMAL := 0;
  v_total_wins DECIMAL := 0;
  v_total_losses DECIMAL := 0;
BEGIN
  -- Calculate metrics from closed trades only
  SELECT 
    COALESCE(SUM(calculate_trade_pnl(entry_price, exit_price, quantity, direction)), 0),
    COUNT(*),
    COUNT(CASE WHEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) > 0 THEN 1 END),
    COALESCE(SUM(CASE WHEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) > 0 
                     THEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) END), 0),
    COALESCE(ABS(SUM(CASE WHEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) < 0 
                         THEN calculate_trade_pnl(entry_price, exit_price, quantity, direction) END)), 0)
  INTO v_total_pnl, v_total_trades, v_winning_trades, v_total_wins, v_total_losses
  FROM public.trades 
  WHERE user_id = p_user_id AND exit_price IS NOT NULL;
  
  -- Calculate win rate
  IF v_total_trades > 0 THEN
    v_win_rate := (v_winning_trades::DECIMAL / v_total_trades::DECIMAL) * 100;
  END IF;
  
  -- Calculate average risk-reward ratio
  IF v_total_losses > 0 AND v_winning_trades > 0 THEN
    v_avg_risk_reward := (v_total_wins / v_winning_trades) / (v_total_losses / (v_total_trades - v_winning_trades));
  END IF;
  
  -- Insert or update user metrics
  INSERT INTO public.user_metrics (user_id, total_pnl, win_rate, avg_risk_reward, total_trades, winning_trades, updated_at)
  VALUES (p_user_id, v_total_pnl, v_win_rate, v_avg_risk_reward, v_total_trades, v_winning_trades, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_pnl = EXCLUDED.total_pnl,
    win_rate = EXCLUDED.win_rate,
    avg_risk_reward = EXCLUDED.avg_risk_reward,
    total_trades = EXCLUDED.total_trades,
    winning_trades = EXCLUDED.winning_trades,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to update metrics when trades change
CREATE OR REPLACE FUNCTION trigger_update_user_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update metrics for the affected user
  IF TG_OP = 'DELETE' THEN
    PERFORM update_user_metrics(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM update_user_metrics(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trades_update_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.trades
  FOR EACH ROW EXECUTE FUNCTION trigger_update_user_metrics();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on trades
CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
