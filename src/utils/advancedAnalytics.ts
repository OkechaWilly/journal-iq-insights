import type { InstitutionalTrade } from '@/types/trade';

// Use InstitutionalTrade as Trade for consistency
type Trade = InstitutionalTrade;

export interface AdvancedMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  winStreak: number;
  lossStreak: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  volatility: number;
  sortino: number;
}

export const calculatePnL = (trade: Trade): number => {
  if (!trade.exit_price) return 0;
  
  const pnl = trade.direction === 'long' 
    ? (trade.exit_price - trade.entry_price) * trade.quantity
    : (trade.entry_price - trade.exit_price) * trade.quantity;
  
  return pnl;
};

export const calculateAdvancedMetrics = (trades: Trade[]): AdvancedMetrics => {
  const closedTrades = trades.filter(trade => trade.exit_price);
  const pnls = closedTrades.map(calculatePnL);
  
  if (pnls.length === 0) {
    return {
      sharpeRatio: 0,
      maxDrawdown: 0,
      winStreak: 0,
      lossStreak: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0,
      expectancy: 0,
      volatility: 0,
      sortino: 0
    };
  }

  const wins = pnls.filter(pnl => pnl > 0);
  const losses = pnls.filter(pnl => pnl < 0);
  
  // Basic calculations
  const totalWins = wins.reduce((sum, win) => sum + win, 0);
  const totalLosses = Math.abs(losses.reduce((sum, loss) => sum + loss, 0));
  const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
  const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
  
  // Profit Factor
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
  
  // Expectancy
  const winRate = wins.length / pnls.length;
  const expectancy = (winRate * averageWin) - ((1 - winRate) * averageLoss);
  
  // Volatility (standard deviation of returns)
  const meanReturn = pnls.reduce((sum, pnl) => sum + pnl, 0) / pnls.length;
  const variance = pnls.reduce((sum, pnl) => sum + Math.pow(pnl - meanReturn, 2), 0) / pnls.length;
  const volatility = Math.sqrt(variance);
  
  // Sharpe Ratio (assuming risk-free rate of 0)
  const sharpeRatio = volatility > 0 ? meanReturn / volatility : 0;
  
  // Sortino Ratio (downside deviation)
  const downsideReturns = pnls.filter(pnl => pnl < meanReturn);
  const downsideVariance = downsideReturns.length > 0 
    ? downsideReturns.reduce((sum, pnl) => sum + Math.pow(pnl - meanReturn, 2), 0) / downsideReturns.length
    : 0;
  const downsideDeviation = Math.sqrt(downsideVariance);
  const sortino = downsideDeviation > 0 ? meanReturn / downsideDeviation : 0;
  
  // Max Drawdown
  let peak = 0;
  let maxDrawdown = 0;
  let runningTotal = 0;
  
  for (const pnl of pnls) {
    runningTotal += pnl;
    if (runningTotal > peak) {
      peak = runningTotal;
    }
    const drawdown = (peak - runningTotal) / Math.max(peak, 1) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  // Win/Loss Streaks
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  
  for (const pnl of pnls) {
    if (pnl > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (pnl < 0) {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    }
  }

  return {
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    winStreak: maxWinStreak,
    lossStreak: maxLossStreak,
    profitFactor: Math.round(profitFactor * 100) / 100,
    averageWin: Math.round(averageWin * 100) / 100,
    averageLoss: Math.round(averageLoss * 100) / 100,
    expectancy: Math.round(expectancy * 100) / 100,
    volatility: Math.round(volatility * 100) / 100,
    sortino: Math.round(sortino * 100) / 100
  };
};

export const generateTradeInsights = (trades: Trade[]): string[] => {
  const insights: string[] = [];
  const metrics = calculateAdvancedMetrics(trades);
  
  if (metrics.sharpeRatio > 1) {
    insights.push(`Excellent risk-adjusted returns with Sharpe ratio of ${metrics.sharpeRatio}`);
  } else if (metrics.sharpeRatio < 0) {
    insights.push(`Consider reviewing strategy - negative Sharpe ratio indicates poor risk-adjusted returns`);
  }
  
  if (metrics.maxDrawdown > 20) {
    insights.push(`High drawdown of ${metrics.maxDrawdown}% - consider risk management improvements`);
  }
  
  if (metrics.profitFactor > 2) {
    insights.push(`Strong profit factor of ${metrics.profitFactor} indicates profitable strategy`);
  } else if (metrics.profitFactor < 1) {
    insights.push(`Profit factor below 1.0 suggests strategy needs refinement`);
  }
  
  if (metrics.winStreak > 5) {
    insights.push(`Impressive winning streak of ${metrics.winStreak} trades`);
  }
  
  return insights;
};
