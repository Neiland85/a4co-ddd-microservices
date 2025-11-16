/**
 * UserProgressBar Component - Battle pass style progress bar
 * Features: Animated progress, level display, XP visualization
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAnime } from '@/hooks/useAnime';
import type { UserProgress } from '@/types';
import { calculatePercentage, formatNumber } from '@/lib/utils';

interface UserProgressBarProps {
  progress: UserProgress;
}

export function UserProgressBar({ progress }: UserProgressBarProps) {
  const percentage = calculatePercentage(progress.currentXP, progress.nextLevelXP);
  const xpNeeded = progress.nextLevelXP - progress.currentXP;

  const { ref } = useAnime<HTMLDivElement>({
    config: {
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 200,
      easing: 'easeOutQuad',
    },
  });

  return (
    <Card ref={ref} neon className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="neon" className="text-lg px-4 py-2">
                <span className="text-2xl mr-2">⭐</span>
                Nivel {progress.level}
              </Badge>
              <div>
                <p className="text-sm text-zinc-400">Próximo nivel</p>
                <p className="text-xs text-zinc-500">
                  Necesitas {formatNumber(xpNeeded)} XP más
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-400">XP Total</p>
              <p className="text-2xl font-bold text-purple-400">
                {formatNumber(progress.totalPoints)}
              </p>
            </div>
          </div>

          {/* Progress bar with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-20" />
            <Progress
              value={percentage}
              neon
              className="h-4 relative"
              indicatorClassName="animate-pulse"
            />
          </div>

          {/* XP Details */}
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">
              {formatNumber(progress.currentXP)} XP
            </span>
            <span className="font-semibold text-purple-400">
              {percentage}%
            </span>
            <span className="text-zinc-400">
              {formatNumber(progress.nextLevelXP)} XP
            </span>
          </div>

          {/* Level milestones */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const milestone = Math.floor((i + 1) * 20);
              const isReached = percentage >= milestone;
              return (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                    isReached
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                      : 'bg-zinc-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
