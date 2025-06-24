
import { useMemo } from 'react';

interface TradeValues {
  entryPrice?: number;
  exitPrice?: number;
  quantity?: number;
  direction?: 'long' | 'short';
  stopLoss?: number;
  takeProfit?: number;
}

interface TradeCalculations {
  grossPL: number;
  netPL: number;
  roi: number;
  riskReward?: number;
  potentialLoss?: number;
  potentialGain?: number;
}

const calculateFees = (values: TradeValues): number => {
  // Simple fee calculation - can be customized
  const feePercentage = 0.001; // 0.1%
  const entryFee = (values.entryPrice || 0) * (values.quantity || 0) * feePercentage;
  const exitFee = (values.exitPrice || 0) * (values.quantity || 0) * feePercentage;
  return entryFee + exitFee;
};

export const useTradeCalculations = (values: TradeValues): TradeCalculations | null => {
  return useMemo(() => {
    const { entryPrice, exitPrice, quantity, direction, stopLoss, takeProfit } = values;
    
    if (!entryPrice || !quantity) return null;

    const directionMultiplier = direction === 'short' ? -1 : 1;
    
    let calculations: TradeCalculations = {
      grossPL: 0,
      netPL: 0,
      roi: 0,
    };

    // If exit price is available, calculate actual P&L
    if (exitPrice) {
      const grossPL = (exitPrice - entryPrice) * quantity * directionMultiplier;
      const fees = calculateFees(values);
      const netPL = grossPL - fees;
      const roi = (netPL / (entryPrice * quantity)) * 100;

      calculations = {
        grossPL,
        netPL,
        roi,
      };
    }

    // Calculate potential risk/reward if stop loss and take profit are set
    if (stopLoss) {
      const potentialLoss = Math.abs((stopLoss - entryPrice) * quantity * directionMultiplier);
      calculations.potentialLoss = potentialLoss;
    }

    if (takeProfit) {
      const potentialGain = (takeProfit - entryPrice) * quantity * directionMultiplier;
      calculations.potentialGain = potentialGain;
    }

    if (calculations.potentialLoss && calculations.potentialGain) {
      calculations.riskReward = calculations.potentialGain / calculations.potentialLoss;
    }

    return calculations;
  }, [values]);
};
