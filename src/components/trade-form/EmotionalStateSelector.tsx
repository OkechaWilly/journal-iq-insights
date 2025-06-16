
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface EmotionalStateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const emotionalStates = [
  { value: 'confident', label: 'Confident', color: 'bg-green-100 text-green-800' },
  { value: 'nervous', label: 'Nervous', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'excited', label: 'Excited', color: 'bg-blue-100 text-blue-800' },
  { value: 'fearful', label: 'Fearful', color: 'bg-red-100 text-red-800' },
  { value: 'calm', label: 'Calm', color: 'bg-gray-100 text-gray-800' },
  { value: 'greedy', label: 'Greedy', color: 'bg-orange-100 text-orange-800' },
  { value: 'patient', label: 'Patient', color: 'bg-purple-100 text-purple-800' },
  { value: 'fomo', label: 'FOMO', color: 'bg-red-100 text-red-800' },
  { value: 'disciplined', label: 'Disciplined', color: 'bg-green-100 text-green-800' },
  { value: 'revenge', label: 'Revenge Trading', color: 'bg-red-100 text-red-800' },
];

export const EmotionalStateSelector = ({ value, onChange }: EmotionalStateSelectorProps) => {
  const selectedState = emotionalStates.find(state => state.value === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="emotionalState">Emotional State</Label>
      <div className="space-y-2">
        <Select onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select emotional state" />
          </SelectTrigger>
          <SelectContent>
            {emotionalStates.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedState && (
          <Badge className={selectedState.color}>
            {selectedState.label}
          </Badge>
        )}
      </div>
    </div>
  );
};
