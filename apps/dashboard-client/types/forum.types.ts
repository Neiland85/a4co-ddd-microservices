/**
 * User Dashboard - Forum Type Definitions
 * Reddit-style forum for young audience
 */

export type ForumCategory = 
  | 'musica' 
  | 'cine' 
  | 'teatro' 
  | 'tendencias' 
  | 'tecnologia' 
  | 'humor';

export type ReactionType = 'heart' | 'fire' | 'wow' | 'laugh';

export interface CategoryInfo {
  id: ForumCategory;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  color: string;
}

export interface ForumThread {
  id: string;
  category: ForumCategory;
  title: string;
  content: string;
  authorId: string;
  author: ThreadAuthor;
  images?: string[];
  reactions: ReactionCounts;
  userReaction?: ReactionType;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThreadAuthor {
  id: string;
  username: string;
  avatar?: string;
  level?: number;
  badge?: string;
}

export type ReactionCounts = {
  [K in ReactionType]: number;
};

export interface ForumComment {
  id: string;
  threadId: string;
  parentId?: string; // For nested replies
  authorId: string;
  author: ThreadAuthor;
  content: string;
  images?: string[];
  reactions: ReactionCounts;
  userReaction?: ReactionType;
  replies?: ForumComment[];
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface CreateThreadInput {
  category: ForumCategory;
  title: string;
  content: string;
  images?: File[];
}

export interface CreateCommentInput {
  threadId: string;
  parentId?: string;
  content: string;
  images?: File[];
}

export interface ForumFilters {
  category?: ForumCategory;
  search?: string;
  sortBy?: 'recent' | 'popular' | 'trending';
}

export interface ThreadStats {
  totalThreads: number;
  totalComments: number;
  activeUsers: number;
  trendingTopics: string[];
}
