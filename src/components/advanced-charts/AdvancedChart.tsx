
import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpring, animated } from 'react-spring';

interface Overlay {
  type: 'sma' | 'volume' | 'ema';
  period?: number;
  color?: string;
}

interface MarketData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AdvancedChartProps {
  type: 'candlestick' | 'line' | 'area';
  data: MarketData[];
  overlays?: Overlay[];
  height?: number;
  title?: string;
}

const calculateSMA = (data: MarketData[], period: number) => {
  return data.map((item, index) => {
    if (index < period - 1) return { ...item, sma: null };
    
    const slice = data.slice(index - period + 1, index + 1);
    const sma = slice.reduce((sum, d) => sum + d.close, 0) / period;
    return { ...item, sma };
  });
};

const CandlestickBar = ({ payload, x, y, width, height }: any) => {
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isUp = close > open;
  const color = isUp ? '#10b981' : '#ef4444';
  
  const bodyHeight = Math.abs(close - open);
  const bodyY = Math.min(open, close);
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={high}
        x2={x + width / 2}
        y2={low}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x + 1}
        y={bodyY}
        width={width - 2}
        height={bodyHeight}
        fill={isUp ? 'transparent' : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export const AdvancedChart: React.FC<AdvancedChartProps> = ({
  type,
  data,
  overlays = [],
  height = 400,
  title = "Advanced Chart"
}) => {
  const processedData = useMemo(() => {
    let result = [...data];
    
    overlays.forEach(overlay => {
      if (overlay.type === 'sma' && overlay.period) {
        result = calculateSMA(result, overlay.period);
      }
    });
    
    return result;
  }, [data, overlays]);

  const chartAnimation = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.95)' },
    config: { tension: 280, friction: 60 }
  });

  const hasVolume = overlays.some(o => o.type === 'volume');

  return (
    <animated.div style={chartAnimation}>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any, name: string) => [
                  typeof value === 'number' ? `$${value.toFixed(2)}` : value,
                  name
                ]}
              />
              <Legend />
              
              {type === 'candlestick' && (
                <Bar
                  dataKey="close"
                  shape={<CandlestickBar />}
                  fill="transparent"
                />
              )}
              
              {type === 'line' && (
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              
              {overlays.map((overlay, index) => (
                <Line
                  key={`overlay-${index}`}
                  type="monotone"
                  dataKey={overlay.type === 'sma' ? 'sma' : overlay.type}
                  stroke={overlay.color || '#f59e0b'}
                  strokeWidth={1}
                  dot={false}
                  connectNulls={false}
                />
              ))}
              
              {hasVolume && (
                <Bar
                  dataKey="volume"
                  fill="#6b7280"
                  fillOpacity={0.3}
                  yAxisId="volume"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </animated.div>
  );
};
