
import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { Edit, Trash2, TrendingUp } from 'lucide-react';
import { CompactTradeCard } from './CompactTradeCard';
import { Trade } from '@/hooks/useTrades';

interface SwipeableTradeItemProps {
  trade: Trade;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export const SwipeableTradeItem: React.FC<SwipeableTradeItemProps> = ({
  trade,
  onEdit,
  onDelete,
  onView
}) => {
  const [swiped, setSwiped] = useState<'left' | 'right' | null>(null);
  
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: config.stiff
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2 || Math.abs(mx) > 50;
      
      if (active) {
        api.start({ x: mx, immediate: true });
      } else {
        if (trigger && xDir > 0) {
          // Swipe right - Edit action
          setSwiped('right');
          api.start({ x: 80 });
          setTimeout(() => {
            onEdit?.();
            setSwiped(null);
            api.start({ x: 0 });
          }, 200);
        } else if (trigger && xDir < 0) {
          // Swipe left - Delete action  
          setSwiped('left');
          api.start({ x: -80 });
          setTimeout(() => {
            onDelete?.();
            setSwiped(null);
            api.start({ x: 0 });
          }, 200);
        } else {
          api.start({ x: 0 });
        }
      }
    },
    {
      axis: 'x',
      bounds: { left: -100, right: 100 },
      rubberband: true
    }
  );

  return (
    <div className="relative overflow-hidden">
      {/* Action Buttons Background */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full">
          <Edit className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full">
          <Trash2 className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Swipeable Card */}
      <animated.div
        {...bind()}
        style={{
          x,
          touchAction: 'pan-y'
        }}
        className="relative z-10 select-none"
      >
        <CompactTradeCard trade={trade} onClick={onView} />
      </animated.div>

      {/* Swipe Hints */}
      {!swiped && (
        <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-4 py-1 bg-slate-700/30 backdrop-blur-sm text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Edit className="w-3 h-3" />
            Swipe right to edit
          </span>
          <span className="flex items-center gap-1">
            Swipe left to delete
            <Trash2 className="w-3 h-3" />
          </span>
        </div>
      )}
    </div>
  );
};
