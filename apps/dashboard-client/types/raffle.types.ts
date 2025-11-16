/**
 * User Dashboard - Raffle/Sorteo Type Definitions
 * Raffles for music, cinema, theater events
 */

export interface Raffle {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: RaffleCategory;
  prize: string;
  prizeValue?: number;
  startDate: Date;
  endDate: Date;
  totalParticipants: number;
  maxParticipants?: number;
  rules: string[];
  status: RaffleStatus;
  featured: boolean;
  tags: string[];
}

export type RaffleCategory = 
  | 'musica' 
  | 'cine' 
  | 'teatro' 
  | 'tecnologia'
  | 'festival'
  | 'otro';

export type RaffleStatus = 
  | 'upcoming'
  | 'active' 
  | 'completed' 
  | 'cancelled';

export interface RaffleParticipation {
  id: string;
  raffleId: string;
  userId: string;
  tickets: number;
  participatedAt: Date;
  bonusActions: BonusActions;
}

export interface BonusActions {
  viewedProfile: boolean;
  commented: boolean;
  shared: boolean;
  followedOrganizer: boolean;
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  raffle: Pick<Raffle, 'id' | 'title' | 'coverImage' | 'prize'>;
  ticketNumber: string;
  status: TicketStatus;
  createdAt: Date;
  drawDate?: Date;
}

export type TicketStatus = 
  | 'pending' 
  | 'won' 
  | 'lost';

export interface RaffleFilters {
  category?: RaffleCategory;
  status?: RaffleStatus;
  search?: string;
  featured?: boolean;
}

export interface ParticipateResponse {
  success: boolean;
  message: string;
  participation?: RaffleParticipation;
  alreadyParticipated?: boolean;
}
