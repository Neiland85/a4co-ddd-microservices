/**
 * User Store - Zustand store for user state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, DailyMission, UserProgress } from '@/types';

interface UserState {
  user: User | null;
  dailyMission: DailyMission | null;
  progress: UserProgress | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setDailyMission: (mission: DailyMission | null) => void;
  setProgress: (progress: UserProgress | null) => void;
  updateStats: (stats: Partial<User['stats']>) => void;
  completeMission: () => void;
  addXP: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  dailyMission: null,
  progress: null,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setDailyMission: (mission) => set({ dailyMission: mission }),

      setProgress: (progress) => set({ progress }),

      updateStats: (stats) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                stats: { ...state.user.stats, ...stats },
              }
            : null,
        })),

      completeMission: () => {
        const { dailyMission, progress } = get();
        if (!dailyMission || dailyMission.completed) return;

        set({
          dailyMission: { ...dailyMission, completed: true },
        });

        // Add XP reward
        get().addXP(dailyMission.reward);
      },

      addXP: (amount) => {
        const { progress, user } = get();
        if (!progress || !user) return;

        const newCurrentXP = progress.currentXP + amount;
        const newTotalPoints = progress.totalPoints + amount;
        
        // Check if leveled up
        let newLevel = progress.level;
        let remainingXP = newCurrentXP;
        let nextLevelXP = progress.nextLevelXP;

        if (newCurrentXP >= progress.nextLevelXP) {
          newLevel++;
          remainingXP = newCurrentXP - progress.nextLevelXP;
          nextLevelXP = Math.floor(progress.nextLevelXP * 1.5); // Increase XP requirement
        }

        const newPercentage = Math.floor((remainingXP / nextLevelXP) * 100);

        set({
          progress: {
            level: newLevel,
            currentXP: remainingXP,
            nextLevelXP,
            totalPoints: newTotalPoints,
            percentage: newPercentage,
          },
          user: {
            ...user,
            stats: {
              ...user.stats,
              level: newLevel,
              totalXP: newTotalPoints,
            },
          },
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        progress: state.progress,
      }),
    }
  )
);
