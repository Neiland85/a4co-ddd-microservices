import { randomUUID } from 'crypto';

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
  CONFIRMED = 'CONFIRMED',
}

export interface ReservationItem {
  productId: string;
  quantity: number;
}

export class StockReservation {
  public readonly reservationId: string;
  public readonly orderId: string;
  public readonly items: ReservationItem[];
  public readonly createdAt: Date;
  public readonly expiresAt: Date;
  public status: ReservationStatus;
  public releasedAt?: Date;
  public releaseReason?: string;

  constructor(params: {
    reservationId?: string;
    orderId: string;
    items: ReservationItem[];
    ttlMinutes?: number;
    status?: ReservationStatus;
    createdAt?: Date;
  }) {
    this.reservationId = params.reservationId || `res-${randomUUID()}`;
    this.orderId = params.orderId;
    this.items = params.items;
    this.status = params.status || ReservationStatus.ACTIVE;
    this.createdAt = params.createdAt || new Date();
    
    const ttl = params.ttlMinutes || 15; // Default 15 minutos
    this.expiresAt = new Date(this.createdAt.getTime() + ttl * 60 * 1000);
  }

  /**
   * Verifica si la reserva ha expirado
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt && this.status === ReservationStatus.ACTIVE;
  }

  /**
   * Libera la reserva
   */
  release(reason: 'order_cancelled' | 'order_expired' | 'payment_failed'): void {
    if (this.status !== ReservationStatus.ACTIVE) {
      throw new Error(`Cannot release reservation in status ${this.status}`);
    }

    this.status = ReservationStatus.RELEASED;
    this.releasedAt = new Date();
    this.releaseReason = reason;
  }

  /**
   * Confirma la reserva (conversión a venta real)
   */
  confirm(): void {
    if (this.status !== ReservationStatus.ACTIVE) {
      throw new Error(`Cannot confirm reservation in status ${this.status}`);
    }

    this.status = ReservationStatus.CONFIRMED;
  }

  /**
   * Marca la reserva como expirada
   */
  expire(): void {
    if (this.status !== ReservationStatus.ACTIVE) {
      return;
    }

    this.status = ReservationStatus.EXPIRED;
    this.releasedAt = new Date();
    this.releaseReason = 'order_expired';
  }

  /**
   * Obtiene el total de items reservados
   */
  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
