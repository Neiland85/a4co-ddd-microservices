/**
 * User Dashboard - User Type Definitions
 * For young users (16-30) interacting with the A4CO platform
 */

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  interests: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  rafflesParticipated: number;
  forumPosts: number;
  toolsUsed: number;
  level: number;
  totalXP: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  progress: number;
  target: number;
  reward: number; // XP points
  completed: boolean;
  expiresAt: Date;
}

export type MissionType = 
  | 'view_artisan'
  | 'forum_comment'
  | 'vote_raffle'
  | 'use_tool'
  | 'daily_login';

export interface UserProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalPoints: number;
  percentage: number;
}

export interface UserPreferences {
  notifications: {
    raffles: boolean;
    forum: boolean;
    events: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
}
