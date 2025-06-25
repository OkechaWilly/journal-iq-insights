
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DirectionToggleProps {
  value: 'long' | 'short';
  onChange: (direction: 'long' | 'short') => void;
}

export const DirectionToggle: React.FC<DirectionToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex rounded-lg bg-slate-800/50 p-1 border border-slate-700">
      <Button
        type="button"
        variant={value === 'long' ? 'default' : 'ghost'}
        className={`flex-1 flex items-center justify-center gap-2 transition-all ${
          value === 'long'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
        onClick={() => onChange('long')}
      >
        <TrendingUp className="w-4 h-4" />
        Long
      </Button>
      <Button
        type="button"
        variant={value === 'short' ? 'default' : 'ghost'}
        className={`flex-1 flex items-center justify-center gap-2 transition-all ${
          value === 'short'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
        onClick={() => onChange('short')}
      >
        <TrendingDown className="w-4 h-4" />
        Short
      </Button>
    </div>
  );
};
