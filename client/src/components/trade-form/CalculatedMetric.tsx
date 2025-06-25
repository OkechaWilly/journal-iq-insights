
import React from 'react';

interface CalculatedMetricProps {
  label: string;
  value: number | string | null;
  unit?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export const CalculatedMetric: React.FC<CalculatedMetricProps> = ({ 
  label, 
  value, 
  unit = '',
  trend = 'neutral'
}) => {
  const getTrendColor = () => {
    if (trend === 'positive') return 'text-green-400';
    if (trend === 'negative') return 'text-red-400';
    return 'text-slate-300';
  };

  const formatValue = () => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <div className="rounded-md border border-slate-600 bg-slate-800/50 p-3">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-lg font-semibold ${getTrendColor()}`}>
        {formatValue()}{unit}
      </p>
    </div>
  );
};
