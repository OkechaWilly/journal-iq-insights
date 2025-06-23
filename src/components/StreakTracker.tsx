
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flame, Trophy } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { format, differenceInDays, parseISO, isSameDay } from 'date-fns';

export const StreakTracker = () => {
  const { trades } = useTrades();

  const calculateStreak = () => {
    if (trades.length === 0) return 0;

    // Get unique trading days sorted by date (most recent first)
    const tradingDays = [...new Set(
      trades.map(trade => format(parseISO(trade.created_at), 'yyyy-MM-dd'))
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (tradingDays.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    const mostRecentDay = new Date(tradingDays[0]);

    // Check if most recent trading day is today or yesterday
    const daysDiff = differenceInDays(today, mostRecentDay);
    if (daysDiff > 1) return 0;

    // Count consecutive days
    for (let i = 1; i < tradingDays.length; i++) {
      const currentDay = new Date(tradingDays[i]);
      const prevDay = new Date(tradingDays[i - 1]);
      
      if (differenceInDays(prevDay, currentDay) === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  const getStreakMessage = (streakCount: number) => {
    if (streakCount === 0) return "Start your trading journal streak!";
    if (streakCount < 3) return `${streakCount} day${streakCount > 1 ? 's' : ''} logged. Keep building!`;
    if (streakCount < 7) return `🔥 ${streakCount} days strong! You're building great habits!`;
    if (streakCount < 14) return `⚡ ${streakCount} day streak! You're on fire!`;
    return `🏆 ${streakCount} days! Trading discipline master!`;
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount === 0) return "bg-slate-600";
    if (streakCount < 3) return "bg-blue-500";
    if (streakCount < 7) return "bg-orange-500";
    if (streakCount < 14) return "bg-red-500";
    return "bg-purple-500";
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStreakColor(streak)}`}>
              {streak >= 7 ? (
                <Trophy className="w-5 h-5 text-white" />
              ) : streak >= 3 ? (
                <Flame className="w-5 h-5 text-white" />
              ) : (
                <Calendar className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-white font-semibold">
                {streak} Day{streak !== 1 ? 's' : ''}
              </div>
              <div className="text-slate-400 text-sm">
                {getStreakMessage(streak)}
              </div>
            </div>
          </div>
          {streak >= 3 && (
            <Badge 
              variant="outline" 
              className={`${getStreakColor(streak)} text-white border-none`}
            >
              Streak!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
