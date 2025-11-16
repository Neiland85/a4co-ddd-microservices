/**
 * DailyMission Component - Daily mission tracker
 * Features: Progress bar animation, completion celebration
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnime } from '@/hooks/useAnime';
import type { DailyMission } from '@/types';
import { MISSION_TYPES } from '@/lib/constants';
import { formatRelativeTime, calculatePercentage } from '@/lib/utils';

interface DailyMissionProps {
  mission: DailyMission;
  onComplete?: () => void;
}

export function DailyMission({ mission, onComplete }: DailyMissionProps) {
  const percentage = calculatePercentage(mission.progress, mission.target);
  const missionConfig = MISSION_TYPES[mission.type];
  const isCompleted = mission.completed;

  const { ref } = useAnime<HTMLDivElement>({
    config: {
      translateX: [-30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad',
    },
  });

  return (
    <Card ref={ref} className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">{missionConfig.icon}</span>
            Misión Diaria
          </CardTitle>
          {isCompleted ? (
            <Badge variant="success">
              ✓ Completada
            </Badge>
          ) : (
            <Badge variant="outline">
              Expira {formatRelativeTime(mission.expiresAt)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mission info */}
        <div>
          <h3 className="font-semibold text-white mb-1">{missionConfig.title}</h3>
          <p className="text-sm text-zinc-400">{missionConfig.description}</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Progreso</span>
            <span className="text-white font-medium">
              {mission.progress}/{mission.target}
            </span>
          </div>
          <Progress value={percentage} neon showLabel={false} />
        </div>

        {/* Reward */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-sm text-zinc-400">Recompensa</p>
              <p className="font-semibold text-purple-400">+{missionConfig.reward} XP</p>
            </div>
          </div>

          {isCompleted && (
            <Button size="sm" variant="neon" onClick={onComplete}>
              Reclamar
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        {!isCompleted && percentage > 0 && (
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              {percentage >= 100 ? '¡Casi lo tienes!' : `${percentage}% completado`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
