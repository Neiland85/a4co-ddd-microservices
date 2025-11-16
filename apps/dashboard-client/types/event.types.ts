/**
 * User Dashboard - Event Type Definitions
 * Events and recommendations
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: EventCategory;
  location: EventLocation;
  startDate: Date;
  endDate?: Date;
  price?: number;
  isFree: boolean;
  organizer: EventOrganizer;
  tags: string[];
  attendeeCount: number;
  maxAttendees?: number;
  isRecommended: boolean;
  isFeatured: boolean;
  status: EventStatus;
}

export type EventCategory = 
  | 'musica' 
  | 'cine' 
  | 'teatro' 
  | 'festival'
  | 'exposicion'
  | 'taller'
  | 'conferencia';

export type EventStatus = 
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface EventLocation {
  venue: string;
  address: string;
  city: string;
  province: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  onlineUrl?: string;
}

export interface EventOrganizer {
  id: string;
  name: string;
  logo?: string;
  verified: boolean;
}

export interface EventFilters {
  category?: EventCategory;
  city?: string;
  province?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  isFree?: boolean;
  isOnline?: boolean;
}

export interface EventRecommendation {
  event: Event;
  score: number;
  reasons: RecommendationReason[];
}

export type RecommendationReason = 
  | 'matches_interests'
  | 'popular_in_area'
  | 'trending'
  | 'similar_to_attended'
  | 'friend_attending';
