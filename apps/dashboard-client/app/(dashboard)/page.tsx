/**
 * Dashboard Home Page
 * Main landing page with Welcome Card, Daily Mission, Progress Bar, and Quick Actions
 */

'use client';

import { WelcomeCard, DailyMission, UserProgressBar, QuickActions } from '@/components/home';
import { useUserStore } from '@/store/useUserStore';
import { useEffect } from 'react';

// Mock data for demonstration
const mockUser = {
  id: '1',
  email: 'usuario@a4co.es',
  username: 'Usuario123',
  avatar: '',
  bio: 'Amante de la música y el cine',
  interests: ['música', 'cine', 'teatro'],
  socialLinks: {
    instagram: '@usuario123',
  },
  stats: {
    rafflesParticipated: 12,
    forumPosts: 48,
    toolsUsed: 25,
    level: 8,
    totalXP: 2450,
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
};

const mockDailyMission = {
  id: '1',
  title: 'Participa en un sorteo',
  description: 'Únete a cualquier sorteo activo',
  type: 'vote_raffle' as const,
  progress: 0,
  target: 1,
  reward: 100,
  completed: false,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
};

const mockProgress = {
  level: 8,
  currentXP: 450,
  nextLevelXP: 1000,
  totalPoints: 2450,
  percentage: 45,
};

export default function DashboardPage() {
  const { setUser, setDailyMission, setProgress, completeMission } = useUserStore();

  // Initialize with mock data
  useEffect(() => {
    setUser(mockUser);
    setDailyMission(mockDailyMission);
    setProgress(mockProgress);
  }, [setUser, setDailyMission, setProgress]);

  const { user, dailyMission, progress } = useUserStore();

  if (!user || !dailyMission || !progress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-zinc-400">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Section */}
      <section>
        <WelcomeCard user={user} />
      </section>

      {/* Progress & Mission Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserProgressBar progress={progress} />
        <DailyMission mission={dailyMission} onComplete={completeMission} />
      </section>

      {/* Quick Actions Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Acceso Rápido</h2>
        <QuickActions />
      </section>

      {/* Additional sections can be added here */}
      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>🔥</span>
              Tendencias
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Descubre lo más popular en A4CO
            </p>
            <div className="space-y-3">
              {['Sorteo de entradas VIP', 'Nueva sección de tecnología', 'Evento de música en vivo'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <span className="text-purple-400 font-semibold">#{i + 1}</span>
                  <span className="text-white text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>⚡</span>
              Actividad Reciente
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Tus últimas acciones
            </p>
            <div className="space-y-3">
              {[
                { action: 'Participaste en un sorteo', time: 'Hace 2 horas', icon: '🎟️' },
                { action: 'Comentaste en el foro', time: 'Hace 5 horas', icon: '💬' },
                { action: 'Usaste el compresor de video', time: 'Ayer', icon: '🛠️' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{item.action}</p>
                    <p className="text-zinc-500 text-xs">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
