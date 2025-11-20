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

    // Corrección: Convertir minutos a milisegundos
    const ttl = params.ttlMinutes || 15; // Default 15 minutos
    this.expiresAt = new Date(this.createdAt.getTime() + ttl * 60 * 1000);
  }

  // Getter para compatibilidad con repositorios que buscan .id
  get id(): string {
    return this.reservationId;
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
  release(reason: 'order_cancelled' | 'order_expired' | 'payment_failed' | 'manual_correction'): void {
    if (this.status !== ReservationStatus.ACTIVE) {
      // Permitimos liberar si ya está expirada para asegurar consistencia, 
      // pero lanzamos error si ya estaba liberada o confirmada.
      if (this.status === ReservationStatus.RELEASED || this.status === ReservationStatus.CONFIRMED) {
         return; // Idempotencia: si ya está liberada, no hacemos nada
      }
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

  /**
   * Serializa la entidad para eventos o persistencia
   * CRÍTICO: Esto faltaba y causaba errores en el EventBus
   */
  toJSON() {
    return {
      id: this.reservationId,
      reservationId: this.reservationId,
      orderId: this.orderId,
      items: this.items,
      status: this.status,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      releasedAt: this.releasedAt,
      releaseReason: this.releaseReason,
    };
  }
}
