
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { useSpring, animated } from 'react-spring';

interface JournalTriggers {
  loss: string[];
  win: string[];
  breakeven: string[];
  streak: string[];
}

interface JournalPromptsProps {
  triggers: JournalTriggers;
  tradeOutcome?: 'win' | 'loss' | 'breakeven';
  streakCount?: number;
  onSaveResponse?: (responses: Record<string, string>) => void;
}

const defaultTriggers: JournalTriggers = {
  loss: [
    'What went wrong with this trade?',
    'Was risk properly managed?',
    'Did you follow your trading plan?',
    'What emotions did you experience?',
    'How can you prevent this next time?'
  ],
  win: [
    'What worked well in this trade?',
    'Was this a repeatable pattern?',
    'Did you exit at the optimal time?',
    'What can you learn from this success?',
    'How did you manage emotions during the trade?'
  ],
  breakeven: [
    'Why did the trade not reach target?',
    'Was the setup as strong as expected?',
    'Did market conditions change?',
    'What would you do differently?'
  ],
  streak: [
    'Are you becoming overconfident?',
    'Are you following proper risk management?',
    'Is your position sizing appropriate?',
    'Are you sticking to your strategy?'
  ]
};

export const JournalPrompts: React.FC<JournalPromptsProps> = ({
  triggers = defaultTriggers,
  tradeOutcome,
  streakCount = 0,
  onSaveResponse
}) => {
  const [activePrompts, setActivePrompts] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const promptAnimation = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.95)' },
    config: { tension: 200, friction: 25 }
  });

  useEffect(() => {
    let prompts: string[] = [];
    
    if (tradeOutcome === 'loss') {
      prompts = triggers.loss;
    } else if (tradeOutcome === 'win') {
      prompts = triggers.win;
    } else if (tradeOutcome === 'breakeven') {
      prompts = triggers.breakeven;
    }
    
    // Add streak prompts if on a streak
    if (streakCount >= 3) {
      prompts = [...prompts, ...triggers.streak];
    }
    
    setActivePrompts(prompts);
    setCurrentPromptIndex(0);
  }, [tradeOutcome, streakCount, triggers]);

  const getOutcomeIcon = () => {
    switch (tradeOutcome) {
      case 'win':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'loss':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'breakeven':
        return <HelpCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
    }
  };

  const getOutcomeColor = () => {
    switch (tradeOutcome) {
      case 'win':
        return 'text-emerald-400';
      case 'loss':
        return 'text-red-400';
      case 'breakeven':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const handleResponseChange = (prompt: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [prompt]: response
    }));
  };

  const nextPrompt = () => {
    if (currentPromptIndex < activePrompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
    }
  };

  const previousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(prev => prev - 1);
    }
  };

  const saveResponses = () => {
    onSaveResponse?.(responses);
  };

  const currentPrompt = activePrompts[currentPromptIndex];
  const progress = activePrompts.length > 0 ? ((currentPromptIndex + 1) / activePrompts.length) * 100 : 0;

  if (activePrompts.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Lightbulb className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Active Prompts</h3>
          <p className="text-slate-400">Complete a trade to get personalized journal prompts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <animated.div style={promptAnimation}>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getOutcomeIcon()}
              <CardTitle className={`${getOutcomeColor()}`}>
                Trade Journal Prompts
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-slate-300">
              {currentPromptIndex + 1} of {activePrompts.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                {currentPrompt}
              </h3>
              <Textarea
                value={responses[currentPrompt] || ''}
                onChange={(e) => handleResponseChange(currentPrompt, e.target.value)}
                placeholder="Share your thoughts and insights..."
                className="bg-slate-600 border-slate-500 text-white min-h-[100px]"
              />
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousPrompt}
                disabled={currentPromptIndex === 0}
                className="border-slate-600 text-slate-300"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={nextPrompt}
                  disabled={currentPromptIndex === activePrompts.length - 1}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </Button>
                
                {currentPromptIndex === activePrompts.length - 1 && (
                  <Button
                    onClick={saveResponses}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Save Journal
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* All Prompts Preview */}
          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-slate-400 text-sm font-medium mb-3">All Prompts:</h4>
            <div className="space-y-2">
              {activePrompts.map((prompt, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    index === currentPromptIndex 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'hover:bg-slate-700/50'
                  }`}
                  onClick={() => setCurrentPromptIndex(index)}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    responses[prompt] 
                      ? 'bg-emerald-400' 
                      : index === currentPromptIndex 
                        ? 'bg-blue-400' 
                        : 'bg-slate-600'
                  }`} />
                  <span className={`text-sm ${
                    index === currentPromptIndex ? 'text-white' : 'text-slate-400'
                  }`}>
                    {prompt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </animated.div>
  );
};
