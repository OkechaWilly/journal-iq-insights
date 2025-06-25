
import React from 'react';

interface EmotionRadialPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

const emotions = [
  { value: 'confident', label: 'Confident', color: 'bg-green-500' },
  { value: 'uncertain', label: 'Uncertain', color: 'bg-yellow-500' },
  { value: 'fearful', label: 'Fearful', color: 'bg-red-500' },
  { value: 'disciplined', label: 'Disciplined', color: 'bg-blue-500' },
  { value: 'fomo', label: 'FOMO', color: 'bg-purple-500' },
  { value: 'greedy', label: 'Greedy', color: 'bg-orange-500' },
];

export const EmotionRadialPicker: React.FC<EmotionRadialPickerProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2 flex-wrap">
        {emotions.map((emotion) => (
          <button
            key={emotion.value}
            type="button"
            className={`h-10 w-10 rounded-full ${emotion.color} transition-all hover:scale-110 ${
              value === emotion.value ? 'ring-4 ring-offset-2 ring-primary ring-white' : ''
            }`}
            onClick={() => onChange(emotion.value)}
            aria-label={emotion.label}
            title={emotion.label}
          />
        ))}
      </div>
      {value && (
        <p className="text-center text-sm text-slate-400">
          Current: {emotions.find(e => e.value === value)?.label}
        </p>
      )}
    </div>
  );
};
