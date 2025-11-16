# 🎮 A4CO User Dashboard - Architecture & Design Document

## 📋 Executive Summary

Modern, dynamic dashboard for young users (16-30 years) with social features, gamification, and free tools.

**Target Audience**: Young users who browse, interact, participate in raffles, and use free portal tools.
**NOT** for artisans - this is a separate user-facing dashboard.

**Business Objectives**:
- Increase traffic
- Improve retention
- Drive repeat usage through useful functionality and gamification

---

## 🏗️ Complete Folder Architecture

```
apps/dashboard-client/
├── app/                                    # Next.js 15 App Router
│   ├── (auth)/                            # Auth group routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/                       # Main dashboard routes
│   │   ├── layout.tsx                     # Dashboard layout with sidebar
│   │   ├── page.tsx                       # Home/Dashboard main
│   │   ├── sorteos/                       # Raffles & Games
│   │   │   ├── page.tsx                   # Raffles list
│   │   │   ├── [id]/page.tsx              # Single raffle detail
│   │   │   └── mis-tickets/page.tsx       # User's raffle history
│   │   ├── foro/                          # Forum
│   │   │   ├── page.tsx                   # Forum home (categories)
│   │   │   ├── [category]/page.tsx        # Category threads
│   │   │   └── [category]/[threadId]/page.tsx  # Thread detail
│   │   ├── herramientas/                  # Tools
│   │   │   ├── page.tsx                   # Tools overview
│   │   │   ├── compresor-video/page.tsx   # Video compressor
│   │   │   ├── compresor-imagen/page.tsx  # Image compressor
│   │   │   └── extractor-audio/page.tsx   # Audio extractor
│   │   ├── perfil/                        # User Profile
│   │   │   ├── page.tsx                   # Profile view/edit
│   │   │   └── galeria/page.tsx           # User gallery
│   │   └── eventos/                       # Events Feed
│   │       └── page.tsx                   # Recommended events
│   ├── api/                               # API routes (if needed)
│   ├── globals.css                        # Global styles
│   └── layout.tsx                         # Root layout
│
├── components/                            # Reusable components
│   ├── ui/                                # Base UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   ├── layout/                            # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   │
│   ├── home/                              # Home module components
│   │   ├── WelcomeCard.tsx               # Animated welcome card
│   │   ├── DailyMission.tsx              # Daily mission widget
│   │   ├── ProgressBar.tsx               # Battle pass style progress
│   │   └── QuickActions.tsx              # Quick action buttons
│   │
│   ├── sorteos/                           # Raffles module components
│   │   ├── RaffleCard.tsx                # Single raffle card
│   │   ├── RaffleGrid.tsx                # Grid of raffles
│   │   ├── RaffleDetail.tsx              # Raffle detail view
│   │   ├── ParticipateButton.tsx         # Participate CTA
│   │   ├── ConfettiAnimation.tsx         # Confetti effect
│   │   └── TicketHistory.tsx             # User's tickets
│   │
│   ├── foro/                              # Forum module components
│   │   ├── CategoryCard.tsx              # Category preview
│   │   ├── ThreadList.tsx                # List of threads
│   │   ├── ThreadCard.tsx                # Single thread preview
│   │   ├── ThreadDetail.tsx              # Full thread view
│   │   ├── CommentTree.tsx               # Nested comments
│   │   ├── CommentForm.tsx               # Comment editor
│   │   ├── ReactionBar.tsx               # Reactions (❤️🔥😮😂)
│   │   └── EmojiPicker.tsx               # Emoji selector
│   │
│   ├── herramientas/                      # Tools module components
│   │   ├── ToolCard.tsx                  # Tool preview card
│   │   ├── VideoCompressor.tsx           # Video compression tool
│   │   ├── ImageCompressor.tsx           # Image compression tool
│   │   ├── AudioExtractor.tsx            # Audio extraction tool
│   │   ├── FileUploader.tsx              # Drag & drop uploader
│   │   ├── ProgressBar.tsx               # Animated progress
│   │   └── PreviewComparison.tsx         # Before/after preview
│   │
│   ├── perfil/                            # Profile module components
│   │   ├── ProfileHeader.tsx             # Avatar + basic info
│   │   ├── ProfileForm.tsx               # Editable profile fields
│   │   ├── InterestTags.tsx              # User interests
│   │   ├── SocialLinks.tsx               # Optional social media
│   │   ├── Gallery.tsx                   # Photo gallery
│   │   └── GalleryLightbox.tsx           # Image lightbox
│   │
│   ├── eventos/                           # Events module components
│   │   ├── EventCard.tsx                 # Event card with hover effects
│   │   ├── EventGrid.tsx                 # Grid of events
│   │   └── EventFilters.tsx              # Filter by music/trends/etc
│   │
│   └── animations/                        # Animation wrappers
│       ├── FadeIn.tsx
│       ├── SlideUp.tsx
│       ├── ScaleIn.tsx
│       ├── TiltCard.tsx
│       └── WaveAnimation.tsx
│
├── lib/                                   # Utilities and helpers
│   ├── utils.ts                          # General utilities
│   ├── cn.ts                             # Class name merger
│   ├── api.ts                            # API client
│   ├── constants.ts                      # Constants
│   └── validations.ts                    # Form validations
│
├── hooks/                                 # Custom React hooks
│   ├── useAnime.ts                       # Anime.js integration hook
│   ├── useRaffle.ts                      # Raffle operations
│   ├── useForum.ts                       # Forum operations
│   ├── useTools.ts                       # Tools operations
│   ├── useProfile.ts                     # Profile management
│   ├── useEvents.ts                      # Events fetching
│   ├── useDailyMission.ts                # Daily mission logic
│   ├── useIdempotent.ts                  # Idempotency helper
│   └── useIntersectionObserver.ts        # Scroll animations
│
├── store/                                 # Zustand state management
│   ├── useAuthStore.ts                   # Auth state
│   ├── useUserStore.ts                   # User data
│   ├── useRaffleStore.ts                 # Raffle state
│   ├── useForumStore.ts                  # Forum state
│   └── useNotificationStore.ts           # Notifications
│
├── types/                                 # TypeScript types
│   ├── user.types.ts
│   ├── raffle.types.ts
│   ├── forum.types.ts
│   ├── event.types.ts
│   ├── tool.types.ts
│   └── api.types.ts
│
├── services/                              # API services
│   ├── userService.ts
│   ├── raffleService.ts
│   ├── forumService.ts
│   ├── eventService.ts
│   └── toolService.ts
│
└── public/                                # Static assets
    ├── images/
    ├── icons/
    └── animations/
```

---

## 🎨 Design System Specifications

### Color Palette (Vibrant + Modern)

```typescript
// Primary colors - Vibrant neon accents
const colors = {
  // Main brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#3b82f6',  // Main blue
    600: '#2563eb',
    900: '#1e3a8a',
  },
  
  // Neon accents
  neon: {
    pink: '#ff006e',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    green: '#10b981',
  },
  
  // Background layers
  background: {
    base: '#0a0a0f',      // Deep dark
    card: '#1a1a24',      // Card background
    hover: '#2a2a36',     // Hover state
  },
  
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    muted: '#71717a',
  }
};
```

### Typography

```typescript
const typography = {
  fontFamily: {
    sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['Geist Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  }
};
```

### Card Styles (Premium)

```css
.premium-card {
  background: linear-gradient(135deg, #1a1a24 0%, #2a2a36 100%);
  border-radius: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(139, 92, 246, 0.15);
  transition: all 0.3s ease;
}

.premium-card:hover {
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(139, 92, 246, 0.25);
  transform: translateY(-4px);
}
```

---

## 🎬 Anime.js Animation Specifications

### 1. Welcome Card Animation

```typescript
const welcomeCardAnimation = {
  targets: '.welcome-card',
  translateY: [50, 0],
  opacity: [0, 1],
  filter: ['blur(10px)', 'blur(0px)'],
  scale: [0.95, 1],
  duration: 1200,
  easing: 'easeOutExpo',
};
```

### 2. Page Transition

```typescript
const pageTransition = {
  enter: {
    targets: '.page-content',
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutCubic',
  },
  exit: {
    targets: '.page-content',
    translateX: [0, -100],
    opacity: [1, 0],
    duration: 600,
    easing: 'easeInCubic',
  }
};
```

### 3. Confetti Animation (Raffle Participation)

```typescript
const confettiAnimation = {
  targets: '.confetti-piece',
  translateY: ['-100vh', '100vh'],
  translateX: () => anime.random(-200, 200),
  rotate: () => anime.random(0, 360),
  scale: [1, 0.5],
  opacity: [1, 0],
  duration: 3000,
  delay: anime.stagger(50),
  easing: 'easeInCubic',
};
```

### 4. Card Hover Microinteraction

```typescript
const cardHoverAnimation = {
  scale: 1.02,
  rotateX: 5,
  rotateY: 5,
  duration: 300,
  easing: 'easeOutQuad',
};
```

### 5. Progress Bar Animation

```typescript
const progressBarAnimation = {
  targets: '.progress-fill',
  width: '75%', // Dynamic value
  duration: 1500,
  easing: 'easeInOutQuad',
};
```

### 6. Comment Slide-Up

```typescript
const commentAnimation = {
  targets: '.comment-item',
  translateY: [30, 0],
  opacity: [0, 1],
  duration: 600,
  delay: anime.stagger(100),
  easing: 'easeOutQuad',
};
```

---

## 📦 TypeScript Type Definitions

### User Types

```typescript
// types/user.types.ts
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
  };
  stats: {
    rafflesParticipated: number;
    forumPosts: number;
    toolsUsed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number; // Points
  completed: boolean;
  expiresAt: Date;
}

export interface UserProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalPoints: number;
}
```

### Raffle Types

```typescript
// types/raffle.types.ts
export interface Raffle {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: 'musica' | 'cine' | 'teatro' | 'tecnologia';
  prize: string;
  startDate: Date;
  endDate: Date;
  totalParticipants: number;
  maxParticipants?: number;
  rules: string[];
  status: 'active' | 'completed' | 'cancelled';
}

export interface RaffleParticipation {
  id: string;
  raffleId: string;
  userId: string;
  tickets: number;
  participatedAt: Date;
  bonusActions: {
    viewedProfile: boolean;
    commented: boolean;
    shared: boolean;
  };
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  raffle: Raffle;
  ticketNumber: string;
  status: 'pending' | 'won' | 'lost';
  createdAt: Date;
}
```

### Forum Types

```typescript
// types/forum.types.ts
export type ForumCategory = 
  | 'musica' 
  | 'cine' 
  | 'teatro' 
  | 'tendencias' 
  | 'tecnologia' 
  | 'humor';

export type ReactionType = 'heart' | 'fire' | 'wow' | 'laugh';

export interface ForumThread {
  id: string;
  category: ForumCategory;
  title: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  images?: string[];
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumComment {
  id: string;
  threadId: string;
  parentId?: string; // For nested replies
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType;
  replies?: ForumComment[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Event Types

```typescript
// types/event.types.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: 'musica' | 'cine' | 'teatro' | 'festival';
  location: string;
  startDate: Date;
  endDate?: Date;
  price?: number;
  isFree: boolean;
  organizer: string;
  tags: string[];
  attendeeCount: number;
  isRecommended: boolean;
}
```

### Tool Types

```typescript
// types/tool.types.ts
export type CompressionQuality = 'mobile' | 'standard' | 'minimal';

export interface VideoCompressionOptions {
  quality: CompressionQuality;
  maxSizeMB?: number;
  targetResolution?: string;
}

export interface CompressionProgress {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  originalSize: number;
  compressedSize?: number;
  estimatedTime?: number;
  error?: string;
}

export interface ImageCompressionOptions {
  quality: number; // 0-100
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface AudioExtractionOptions {
  format: 'mp3' | 'wav' | 'ogg';
  quality: 'low' | 'medium' | 'high';
}
```

---

## 🔌 Backend API Specifications

### API Endpoints Structure

```typescript
// Base URL: /api/v1/user-dashboard

// User endpoints
GET    /users/me                           // Current user profile
PUT    /users/me                           // Update profile
GET    /users/me/stats                     // User statistics
GET    /users/me/daily-mission             // Get daily mission
POST   /users/me/daily-mission/complete    // Complete mission

// Raffle endpoints
GET    /sorteos                            // List active raffles
GET    /sorteos/:id                        // Get raffle details
POST   /sorteos/:id/participate            // Participate (idempotent)
GET    /sorteos/mis-tickets                // User's tickets
GET    /sorteos/:id/participants           // Raffle participants

// Forum endpoints
GET    /forum/categories                   // List categories
GET    /forum/:category/threads            // Threads by category
POST   /forum/:category/threads            // Create thread
GET    /forum/threads/:id                  // Thread detail
POST   /forum/threads/:id/comments         // Add comment
POST   /forum/comments/:id/replies         // Reply to comment
POST   /forum/threads/:id/react            // Add/remove reaction
POST   /forum/comments/:id/react           // React to comment

// Events endpoints
GET    /events                             // List events
GET    /events/recommended                 // Recommended for user
GET    /events/:id                         // Event details

// Tools endpoints
POST   /tools/compress-video               // Video compression
POST   /tools/compress-image               // Image compression
POST   /tools/extract-audio                // Audio extraction
GET    /tools/job/:id                      // Check job status
```

### API DTOs (Request/Response)

```typescript
// contracts/api/v1/user/

export class UpdateUserProfileV1Dto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export class UserResponseV1Dto {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  interests: string[];
  socialLinks?: Record<string, string>;
  stats: {
    rafflesParticipated: number;
    forumPosts: number;
    toolsUsed: number;
  };
  createdAt: string;
}

export class DailyMissionResponseV1Dto {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
  expiresAt: string;
}
```

```typescript
// contracts/api/v1/raffle/

export class ParticipateInRaffleV1Dto {
  @IsString()
  raffleId: string;

  @IsOptional()
  @IsObject()
  bonusActions?: {
    viewedProfile?: boolean;
    commented?: boolean;
    shared?: boolean;
  };
}

export class RaffleResponseV1Dto {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  prize: string;
  startDate: string;
  endDate: string;
  totalParticipants: number;
  maxParticipants?: number;
  rules: string[];
  status: string;
  userParticipated: boolean;
  userTickets: number;
}
```

```typescript
// contracts/api/v1/forum/

export class CreateThreadV1Dto {
  @IsString()
  category: ForumCategory;

  @IsString()
  @Length(5, 200)
  title: string;

  @IsString()
  @Length(10, 5000)
  content: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class CreateCommentV1Dto {
  @IsString()
  threadId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  @Length(1, 2000)
  content: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class ReactV1Dto {
  @IsEnum(['heart', 'fire', 'wow', 'laugh'])
  reaction: ReactionType;
}
```

---

## 🎣 Custom Hooks Specifications

### useAnime Hook

```typescript
// hooks/useAnime.ts
import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface UseAnimeOptions {
  autoPlay?: boolean;
  config: anime.AnimeParams;
}

export function useAnime(options: UseAnimeOptions) {
  const ref = useRef<HTMLElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animation = anime({
      targets: ref.current,
      ...options.config,
      autoplay: options.autoPlay ?? true,
    });

    animationRef.current = animation;

    return () => {
      animation.pause();
    };
  }, [options]);

  const play = () => animationRef.current?.play();
  const pause = () => animationRef.current?.pause();
  const restart = () => animationRef.current?.restart();

  return { ref, play, pause, restart };
}
```

### useRaffle Hook

```typescript
// hooks/useRaffle.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { raffleService } from '@/services/raffleService';

export function useRaffle() {
  const queryClient = useQueryClient();

  const { data: raffles, isLoading } = useQuery({
    queryKey: ['raffles', 'active'],
    queryFn: () => raffleService.getActiveRaffles(),
  });

  const participateMutation = useMutation({
    mutationFn: (raffleId: string) => 
      raffleService.participate(raffleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raffles'] });
      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
    },
  });

  return {
    raffles,
    isLoading,
    participate: participateMutation.mutate,
    isParticipating: participateMutation.isPending,
  };
}
```

### useIdempotent Hook

```typescript
// hooks/useIdempotent.ts
import { useState, useCallback, useRef } from 'react';

export function useIdempotent<T extends (...args: any[]) => Promise<any>>(
  fn: T
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef<Set<string>>(new Set());

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      // Create unique key from arguments
      const key = JSON.stringify(args);

      if (processingRef.current.has(key)) {
        console.warn('Request already in progress:', key);
        return null;
      }

      processingRef.current.add(key);
      setIsProcessing(true);

      try {
        const result = await fn(...args);
        return result;
      } finally {
        processingRef.current.delete(key);
        setIsProcessing(false);
      }
    },
    [fn]
  );

  return { execute, isProcessing };
}
```

---

## 🎮 Module-by-Module Implementation Plan

### 2.1 Home Module

**Components**:
- `WelcomeCard`: Animated greeting with blur+scale effect
- `DailyMission`: Mission card with progress tracker
- `ProgressBar`: Battle pass style level progression
- `QuickActions`: Grid of action buttons with icons

**Animations**:
- Entry: Staggered fade-in + slide-up
- Welcome card: Scale + blur transition
- Progress bar: Width animation on mount

**Data Flow**:
1. Fetch user data and daily mission on mount
2. Update progress in real-time
3. Show completion celebration on mission complete

---

### 2.2 Raffles & Games Module

**Components**:
- `RaffleGrid`: Masonry grid of raffle cards
- `RaffleCard`: Visual card with category badge
- `RaffleDetail`: Full detail page with rules
- `ParticipateButton`: CTA with loading state
- `ConfettiAnimation`: Celebration on participation
- `TicketHistory`: List of user's tickets

**Animations**:
- Confetti: Multiple colored pieces falling
- Card hover: Tilt + glow effect
- Participation success: Confetti + success message

**Idempotency**:
- Check if user already participated before API call
- Show "Already participated" state
- Prevent double-submission with request deduplication

---

### 2.3 Forum Module

**Components**:
- `CategoryCard`: Category with icon + thread count
- `ThreadList`: Infinite scroll thread list
- `ThreadCard`: Preview with reactions
- `ThreadDetail`: Full thread with comments
- `CommentTree`: Recursively nested comments
- `CommentForm`: Rich text editor with image upload
- `ReactionBar`: Emoji reactions (❤️🔥😮😂)

**Animations**:
- New comment: Slide-up + fade-in
- Reaction click: Scale pulse
- Thread expansion: Smooth height transition

**Features**:
- Reddit-style nested comments
- Real-time reaction counts
- Image upload with preview
- Basic content moderation (word filter)

---

### 2.4 Tools Module

#### A) Video Compressor

**Components**:
- `VideoCompressor`: Main interface
- `FileUploader`: Drag & drop zone
- `CompressionSettings`: Quality selector
- `ProgressBar`: Animated progress with ETA
- `DownloadButton`: Download compressed video

**Implementation**:
```typescript
// Uses ffmpeg-wasm for client-side compression
import { FFmpeg } from '@ffmpeg/ffmpeg';

const compressVideo = async (
  file: File, 
  quality: CompressionQuality
) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();
  
  // Compression logic based on quality
  const compressionSettings = {
    mobile: '-vf scale=720:-2 -crf 28',
    standard: '-vf scale=1280:-2 -crf 23',
    minimal: '-vf scale=1920:-2 -crf 18',
  };
  
  // ... compression process with progress callback
};
```

#### B) Image Compressor

**Components**:
- `ImageCompressor`: Main interface
- `ImageUploader`: Multi-file drag & drop
- `PreviewComparison`: Before/after slider
- `BatchDownload`: Download all compressed

**Features**:
- Batch processing
- Live preview
- Multiple formats (JPEG, PNG, WebP)
- Quality slider

#### C) Audio Extractor

**Components**:
- `AudioExtractor`: Main interface
- `URLInput`: Video URL input
- `WaveAnimation`: Animated waveform
- `FormatSelector`: Audio format chooser

**Features**:
- URL-based extraction
- Format conversion
- Quality options
- Legal disclaimer

---

### 2.5 Profile Module

**Components**:
- `ProfileHeader`: Avatar + username + bio
- `ProfileForm`: Editable fields with validation
- `InterestTags`: Pill-style tag selector
- `SocialLinks`: Social media inputs
- `Gallery`: Photo grid with 3D hover
- `GalleryLightbox`: Fullscreen image viewer

**Animations**:
- Field edit: Smooth transition to edit mode
- Gallery hover: 3D perspective tilt
- Save success: Checkmark animation

**3D Effect**:
```typescript
// Anime.js transform on mouse move
const handle3DEffect = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  anime({
    targets: card,
    rotateX: rotateX,
    rotateY: rotateY,
    duration: 300,
    easing: 'easeOutQuad',
  });
};
```

---

### 2.6 Events Feed

**Components**:
- `EventGrid`: Responsive grid
- `EventCard`: Card with hover tilt + glow
- `EventFilters`: Category + date filters
- `EventDetail`: Modal with full info

**Animations**:
- Card hover: Tilt + glow
- Filter change: Crossfade transition
- Scroll reveal: Staggered fade-in

**Recommendation Logic**:
- Based on user interests
- Recent raffle participations
- Trending events
- Location-based (optional)

---

## 🔐 Security & Performance

### Idempotency Implementation

```typescript
// Backend (NestJS)
@Post('sorteos/:id/participate')
@UseGuards(JwtAuthGuard)
async participate(
  @Param('id') raffleId: string,
  @CurrentUser() user: User,
) {
  // Check if already participated
  const existing = await this.raffleService.findParticipation(
    raffleId,
    user.id
  );
  
  if (existing) {
    return {
      success: false,
      message: 'Ya has participado en este sorteo',
      participation: existing,
    };
  }
  
  // Create participation with transaction
  const participation = await this.raffleService.participate(
    raffleId,
    user.id
  );
  
  return {
    success: true,
    participation,
  };
}
```

### Performance Optimizations

1. **Code Splitting**: Dynamic imports for tools
2. **Image Optimization**: Next.js Image component
3. **Lazy Loading**: React.lazy for heavy components
4. **Caching**: React Query with stale-while-revalidate
5. **Debouncing**: Search and filter inputs
6. **Virtual Scrolling**: For long lists (forum threads)

---

## 📱 Responsive Design Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
};
```

**Mobile-First Approach**: All components designed for mobile, enhanced for desktop.

---

## 🧪 Testing Strategy

### Component Tests
```typescript
// Example: WelcomeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { WelcomeCard } from './WelcomeCard';

describe('WelcomeCard', () => {
  it('renders user name', () => {
    render(<WelcomeCard user={{ name: 'Juan' }} />);
    expect(screen.getByText(/Juan/i)).toBeInTheDocument();
  });

  it('animates on mount', () => {
    // Test animation presence
  });
});
```

### Integration Tests
- API call mocking with MSW
- User flow tests (participate in raffle, post comment)
- Form validation tests

---

## 🚀 Deployment Considerations

1. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Backend API URL
   - `NEXT_PUBLIC_FFMPEG_CORE_PATH`: FFmpeg WASM path

2. **Build Optimization**:
   - Image optimization
   - Font subsetting
   - CSS purging
   - Bundle analysis

3. **CDN Assets**:
   - Static images
   - WASM files
   - Animation assets

---

## ✅ Definition of Done

- [ ] All 6 modules implemented
- [ ] Anime.js animations working smoothly
- [ ] Fully responsive on all breakpoints
- [ ] TypeScript strict mode passing
- [ ] All API integrations complete
- [ ] Idempotency checks in place
- [ ] Performance score >90 (Lighthouse)
- [ ] Accessibility score >90
- [ ] Component tests coverage >80%
- [ ] Documentation complete

---

## 🎯 READY_FOR_ACTION

**Architecture document complete!**

This document provides:
✅ Complete folder structure
✅ All component names and organization
✅ Exact design specifications (colors, typography, card styles)
✅ All Anime.js animations with code
✅ TypeScript types for every module
✅ Backend API structure and DTOs
✅ Custom hooks implementations
✅ Module-by-module implementation details
✅ Security and performance guidelines
✅ Testing strategy

**Next Steps**: 
¿Quieres que genere ahora los componentes uno a uno?
Puedo empezar con cualquier módulo que prefieras:
1. Home (Welcome + Daily Mission)
2. Sorteos (Raffles System)
3. Foro (Forum)
4. Herramientas (Tools)
5. Perfil (Profile)
6. Eventos (Events)

Dime por cuál módulo quieres empezar y procederé a generar los componentes completos con código.
