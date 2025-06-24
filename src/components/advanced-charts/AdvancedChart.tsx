
import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpring, animated } from 'react-spring';
import { ChartControls } from './ChartControls';

interface Overlay {
  type: 'sma' | 'volume' | 'ema';
  period?: number;
  color?: string;
  enabled?: boolean;
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
  type?: 'candlestick' | 'line' | 'area';
  data: MarketData[];
  overlays?: Overlay[];
  height?: number;
  title?: string;
  showControls?: boolean;
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
  type = 'candlestick',
  data,
  overlays = [],
  height = 400,
  title = "Advanced Chart",
  showControls = true
}) => {
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>(type);
  const [showVolume, setShowVolume] = useState(false);
  const [chartOverlays, setChartOverlays] = useState<Array<{ type: 'sma' | 'ema' | 'volume'; period?: number; enabled: boolean }>>([
    { type: 'sma', period: 20, enabled: false },
    { type: 'ema', period: 50, enabled: false },
    { type: 'volume', enabled: false }
  ]);

  const processedData = useMemo(() => {
    let result = [...data];
    
    chartOverlays.forEach(overlay => {
      if (overlay.enabled && overlay.type === 'sma' && overlay.period) {
        result = calculateSMA(result, overlay.period);
      }
    });
    
    return result;
  }, [data, chartOverlays]);

  const chartAnimation = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.95)' },
    config: { tension: 280, friction: 60 }
  });

  const handleOverlayToggle = (overlayType: string, enabled: boolean) => {
    setChartOverlays(prev => 
      prev.map(overlay => 
        overlay.type === overlayType 
          ? { ...overlay, enabled }
          : overlay
      )
    );
    
    if (overlayType === 'volume') {
      setShowVolume(enabled);
    }
  };

  const enabledOverlays = chartOverlays.filter(o => o.enabled);
  const hasVolume = showVolume || enabledOverlays.some(o => o.type === 'volume');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chart */}
      <div className={showControls ? "lg:col-span-3" : "lg:col-span-4"}>
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
                    yAxisId="price"
                    stroke="#9ca3af"
                    fontSize={12}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  {hasVolume && (
                    <YAxis 
                      yAxisId="volume"
                      orientation="right"
                      stroke="#6b7280"
                      fontSize={12}
                      width={60}
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                  )}
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
                  
                  {chartType === 'candlestick' && (
                    <Bar
                      dataKey="close"
                      shape={<CandlestickBar />}
                      fill="transparent"
                      yAxisId="price"
                    />
                  )}
                  
                  {chartType === 'line' && (
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      yAxisId="price"
                    />
                  )}
                  
                  {enabledOverlays.map((overlay, index) => {
                    if (overlay.type === 'sma') {
                      return (
                        <Line
                          key={`sma-${index}`}
                          type="monotone"
                          dataKey="sma"
                          stroke="#f59e0b"
                          strokeWidth={1}
                          dot={false}
                          connectNulls={false}
                          yAxisId="price"
                          name={`SMA(${overlay.period})`}
                        />
                      );
                    }
                    return null;
                  })}
                  
                  {hasVolume && (
                    <Bar
                      dataKey="volume"
                      fill="#6366f1"
                      fillOpacity={0.3}
                      yAxisId="volume"
                      name="Volume"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </animated.div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="lg:col-span-1">
          <ChartControls
            showVolume={showVolume}
            onVolumeToggle={setShowVolume}
            chartType={chartType}
            onChartTypeChange={setChartType}
            overlays={chartOverlays}
            onOverlayToggle={handleOverlayToggle}
          />
        </div>
      )}
    </div>
  );
};
