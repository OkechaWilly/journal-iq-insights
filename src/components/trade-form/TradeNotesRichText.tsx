
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Lightbulb, Target, AlertTriangle } from 'lucide-react';

interface TradeNotesRichTextProps {
  value: string;
  onChange: (notes: string) => void;
}

const NOTE_TEMPLATES = [
  {
    icon: Target,
    label: 'Setup',
    template: 'Setup: \nEntry reason: \nStop loss: \nTarget: \nRisk/Reward: '
  },
  {
    icon: Lightbulb,
    label: 'Lesson',
    template: 'What I learned: \nWhat went well: \nWhat to improve: \nNext time I will: '
  },
  {
    icon: AlertTriangle,
    label: 'Mistake',
    template: 'Mistake made: \nWhy it happened: \nEmotional state: \nHow to prevent: '
  },
  {
    icon: FileText,
    label: 'Review',
    template: 'Post-trade review: \nExecution quality: \nMarket conditions: \nStrategy effectiveness: '
  }
];

export const TradeNotesRichText: React.FC<TradeNotesRichTextProps> = ({ value, onChange }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const applyTemplate = (template: string) => {
    const newValue = value ? `${value}\n\n${template}` : template;
    onChange(newValue);
    setShowTemplates(false);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white">Trade Notes</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="bg-slate-700 border-slate-600 text-slate-300"
          >
            Templates
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showTemplates && (
          <div className="grid grid-cols-2 gap-2">
            {NOTE_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Badge
                  key={template.label}
                  variant="outline"
                  className="cursor-pointer justify-start p-2 h-auto border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
                  onClick={() => applyTemplate(template.template)}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {template.label}
                </Badge>
              );
            })}
          </div>
        )}
        
        <Textarea
          placeholder="Add your trade notes, strategy, emotions, lessons learned..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] bg-slate-800 border-slate-600 text-white resize-none"
          rows={5}
        />
        
        <div className="text-xs text-slate-500">
          {value.length} characters • Use templates above for structured notes
        </div>
      </CardContent>
    </Card>
  );
};
