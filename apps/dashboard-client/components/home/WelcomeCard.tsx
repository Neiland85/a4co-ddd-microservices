/**
 * WelcomeCard Component - Animated welcome card for Home
 * Features: Anime.js animations (blur, scale, fade-in)
 */

'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAnime } from '@/hooks/useAnime';
import type { User } from '@/types';

interface WelcomeCardProps {
  user: User;
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const { ref } = useAnime<HTMLDivElement>({
    config: {
      translateY: [50, 0],
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 1200,
      easing: 'easeOutExpo',
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 19) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  return (
    <Card
      ref={ref}
      neon
      className="relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 animate-gradient" />
      
      <CardContent className="relative p-8">
        <div className="flex items-center gap-6">
          {/* Avatar with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold text-white border-2 border-purple-400/50">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          {/* Welcome text */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {getGreeting()}, {user.username}! 👋
            </h2>
            <p className="mt-2 text-zinc-400 text-lg">
              Tienes <span className="text-purple-400 font-semibold">{user.stats.level}</span> nivel
              {' • '}
              <span className="text-pink-400 font-semibold">{user.stats.totalXP} XP</span>
            </p>
          </div>

          {/* Stats cards */}
          <div className="hidden lg:flex gap-4">
            <StatCard
              icon="🎟️"
              value={user.stats.rafflesParticipated}
              label="Sorteos"
            />
            <StatCard
              icon="💬"
              value={user.stats.forumPosts}
              label="Posts"
            />
            <StatCard
              icon="🛠️"
              value={user.stats.toolsUsed}
              label="Herramientas"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 min-w-[80px]">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
}
