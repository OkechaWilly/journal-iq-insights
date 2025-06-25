
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSpring, animated } from 'react-spring';

interface BenchmarkData {
  label: string;
  data: Array<{
    date: string;
    value: number;
    drawdown?: number;
  }>;
  color?: string;
}

interface EquityCurveProps {
  benchmarks: BenchmarkData[];
  drawdownMode?: 'toggle' | 'overlay' | 'separate';
  height?: number;
}

export const EquityCurve: React.FC<EquityCurveProps> = ({
  benchmarks,
  drawdownMode = 'toggle',
  height = 400
}) => {
  const [showDrawdown, setShowDrawdown] = useState(false);
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(
    benchmarks.map(b => b.label)
  );

  const chartAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 200, friction: 25 }
  });

  // Combine all benchmark data into a single dataset
  const combinedData = React.useMemo(() => {
    if (benchmarks.length === 0) return [];

    const allDates = Array.from(
      new Set(benchmarks.flatMap(b => b.data.map(d => d.date)))
    ).sort();

    return allDates.map(date => {
      const dataPoint: any = { date };
      
      benchmarks.forEach(benchmark => {
        const point = benchmark.data.find(d => d.date === date);
        if (point) {
          dataPoint[benchmark.label] = point.value;
          if (point.drawdown !== undefined) {
            dataPoint[`${benchmark.label}_drawdown`] = point.drawdown;
          }
        }
      });
      
      return dataPoint;
    });
  }, [benchmarks]);

  const toggleBenchmark = (label: string) => {
    setSelectedBenchmarks(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <animated.div style={chartAnimation}>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Equity Curve Comparison</CardTitle>
            <div className="flex items-center space-x-4">
              {drawdownMode === 'toggle' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="drawdown-mode"
                    checked={showDrawdown}
                    onCheckedChange={setShowDrawdown}
                  />
                  <Label htmlFor="drawdown-mode" className="text-slate-300">
                    Show Drawdown
                  </Label>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {benchmarks.map((benchmark, index) => (
              <Button
                key={benchmark.label}
                variant={selectedBenchmarks.includes(benchmark.label) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBenchmark(benchmark.label)}
                className="h-8"
                style={{
                  backgroundColor: selectedBenchmarks.includes(benchmark.label) 
                    ? colors[index % colors.length] 
                    : 'transparent',
                  borderColor: colors[index % colors.length]
                }}
              >
                {benchmark.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            {showDrawdown ? (
              <AreaChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any, name: string) => [
                    `${value}%`,
                    name.replace('_drawdown', ' Drawdown')
                  ]}
                />
                <Legend />
                
                {benchmarks.map((benchmark, index) => {
                  if (!selectedBenchmarks.includes(benchmark.label)) return null;
                  
                  return (
                    <Area
                      key={`${benchmark.label}_drawdown`}
                      type="monotone"
                      dataKey={`${benchmark.label}_drawdown`}
                      stroke={colors[index % colors.length]}
                      fill={colors[index % colors.length]}
                      fillOpacity={0.3}
                      name={`${benchmark.label} Drawdown`}
                    />
                  );
                })}
              </AreaChart>
            ) : (
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any, name: string) => [
                    `$${Number(value).toLocaleString()}`,
                    name
                  ]}
                />
                <Legend />
                
                {benchmarks.map((benchmark, index) => {
                  if (!selectedBenchmarks.includes(benchmark.label)) return null;
                  
                  return (
                    <Line
                      key={benchmark.label}
                      type="monotone"
                      dataKey={benchmark.label}
                      stroke={benchmark.color || colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      name={benchmark.label}
                    />
                  );
                })}
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </animated.div>
  );
};
