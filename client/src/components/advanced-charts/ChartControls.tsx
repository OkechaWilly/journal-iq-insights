
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, BarChart3, Activity } from 'lucide-react';

interface ChartControlsProps {
  showVolume: boolean;
  onVolumeToggle: (show: boolean) => void;
  chartType: 'candlestick' | 'line' | 'area';
  onChartTypeChange: (type: 'candlestick' | 'line' | 'area') => void;
  overlays: Array<{ type: 'sma' | 'ema' | 'volume'; period?: number; enabled: boolean }>;
  onOverlayToggle: (overlayType: string, enabled: boolean) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  showVolume,
  onVolumeToggle,
  chartType,
  onChartTypeChange,
  overlays,
  onOverlayToggle
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-blue-400" />
          Chart Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Chart Type</label>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="candlestick">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Candlestick
                </div>
              </SelectItem>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Line Chart
                </div>
              </SelectItem>
              <SelectItem value="area">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Area Chart
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Volume Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Volume Overlay</label>
            <p className="text-xs text-slate-500">Show volume bars on chart</p>
          </div>
          <Switch
            checked={showVolume}
            onCheckedChange={onVolumeToggle}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Technical Indicators */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Technical Indicators</label>
          <div className="space-y-3">
            {overlays.map((overlay) => (
              <div key={overlay.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">
                    {overlay.type.toUpperCase()}
                    {overlay.period && ` (${overlay.period})`}
                  </span>
                  <Badge 
                    variant={overlay.enabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {overlay.enabled ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <Switch
                  checked={overlay.enabled}
                  onCheckedChange={(enabled) => onOverlayToggle(overlay.type, enabled)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Quick Actions</label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onVolumeToggle(false);
                overlays.forEach(overlay => onOverlayToggle(overlay.type, false));
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onVolumeToggle(true);
                overlays.forEach(overlay => onOverlayToggle(overlay.type, true));
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Show All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
