
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmotionSelectorProps {
  value?: string;
  onChange: (emotion: string) => void;
}

const EMOTIONS = [
  { value: 'disciplined', label: 'Disciplined', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'planned', label: 'Planned', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'confident', label: 'Confident', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'FOMO', label: 'FOMO', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'revenge', label: 'Revenge', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'fear', label: 'Fear', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'greedy', label: 'Greedy', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'uncertain', label: 'Uncertain', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
];

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({ value, onChange }) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white">Emotional State</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((emotion) => (
            <Badge
              key={emotion.value}
              variant={value === emotion.value ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                value === emotion.value 
                  ? emotion.color 
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
              onClick={() => onChange(emotion.value)}
            >
              {emotion.label}
            </Badge>
          ))}
        </div>
        {!value && (
          <p className="text-xs text-slate-500 mt-2">
            Select your emotional state when entering this trade
          </p>
        )}
      </CardContent>
    </Card>
  );
};
