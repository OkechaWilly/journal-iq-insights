
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { useSpring, animated } from 'react-spring';

interface TradeTemplate {
  id: string;
  name: string;
  takeProfit: number;
  stopLoss: number;
  riskReward: number;
  checklist: string[];
  description?: string;
  tags: string[];
}

const defaultTemplates: TradeTemplate[] = [
  {
    id: '1',
    name: 'Swing Trade',
    takeProfit: 2,
    stopLoss: 1,
    riskReward: 2,
    checklist: [
      'Confirmed trend direction',
      'Volume > 20-day MA',
      'RSI between 30-70',
      'Support/Resistance identified'
    ],
    description: 'Medium-term position trade based on technical analysis',
    tags: ['Technical', 'Medium Term']
  },
  {
    id: '2',
    name: 'Breakout Trade',
    takeProfit: 3,
    stopLoss: 1,
    riskReward: 3,
    checklist: [
      'Clear resistance level',
      'High volume on breakout',
      'Price above breakout level',
      'No major resistance nearby'
    ],
    description: 'Trading breakouts from key levels',
    tags: ['Breakout', 'High Risk']
  },
  {
    id: '3',
    name: 'Scalp Trade',
    takeProfit: 0.5,
    stopLoss: 0.25,
    riskReward: 2,
    checklist: [
      'Tight spreads',
      'High liquidity',
      'Clear entry signal',
      'Quick exit plan'
    ],
    description: 'Short-term trades for quick profits',
    tags: ['Scalping', 'Short Term']
  }
];

interface TradeTemplatesProps {
  onApplyTemplate?: (template: TradeTemplate) => void;
}

export const TradeTemplates: React.FC<TradeTemplatesProps> = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState<TradeTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<TradeTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<TradeTemplate>>({
    name: '',
    takeProfit: 1,
    stopLoss: 1,
    checklist: [],
    tags: []
  });

  const containerAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 200, friction: 25 }
  });

  const applyTemplate = (template: TradeTemplate) => {
    onApplyTemplate?.(template);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const duplicateTemplate = (template: TradeTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const saveTemplate = () => {
    if (!newTemplate.name) return;

    const template: TradeTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      takeProfit: newTemplate.takeProfit || 1,
      stopLoss: newTemplate.stopLoss || 1,
      riskReward: (newTemplate.takeProfit || 1) / (newTemplate.stopLoss || 1),
      checklist: newTemplate.checklist || [],
      description: newTemplate.description,
      tags: newTemplate.tags || []
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({
      name: '',
      takeProfit: 1,
      stopLoss: 1,
      checklist: [],
      tags: []
    });
    setIsEditing(false);
  };

  return (
    <animated.div style={containerAnimation}>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Trade Templates</CardTitle>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>Create Trade Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="take-profit">Take Profit (%)</Label>
                      <Input
                        id="take-profit"
                        type="number"
                        value={newTemplate.takeProfit || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, takeProfit: Number(e.target.value) }))}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                      <Input
                        id="stop-loss"
                        type="number"
                        value={newTemplate.stopLoss || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTemplate.description || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveTemplate} disabled={!newTemplate.name}>
                      Save Template
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => duplicateTemplate(template)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTemplate(template.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Risk:Reward</span>
                    <span className="text-emerald-400 font-medium">
                      1:{template.riskReward.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-medium">Checklist:</p>
                    <div className="space-y-1">
                      {template.checklist.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox className="h-3 w-3" disabled checked />
                          <span className="text-xs text-slate-300">{item}</span>
                        </div>
                      ))}
                      {template.checklist.length > 3 && (
                        <p className="text-xs text-slate-500">
                          +{template.checklist.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => applyTemplate(template)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Apply Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </animated.div>
  );
};
