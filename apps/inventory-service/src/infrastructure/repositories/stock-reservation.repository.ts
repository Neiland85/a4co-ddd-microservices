import { PrismaClient } from '@prisma/client';
import { StockReservation } from '@prisma/client';

export interface IStockReservationRepository {
  create(reservation: {
    productId: string;
    quantity: number;
    orderId: string;
    customerId: string;
    expiresAt: Date;
  }): Promise<StockReservation>;
  
  findByOrderId(orderId: string): Promise<StockReservation | null>;
  
  findByProductId(productId: string): Promise<StockReservation[]>;
  
  updateStatus(reservationId: string, status: string): Promise<void>;
  
  delete(reservationId: string): Promise<void>;
  
  findExpired(): Promise<StockReservation[]>;
  
  releaseByOrderId(orderId: string): Promise<void>;
}

export class PrismaStockReservationRepository implements IStockReservationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(reservation: {
    productId: string;
    quantity: number;
    orderId: string;
    customerId: string;
    expiresAt: Date;
  }): Promise<StockReservation> {
    return this.prisma.stockReservation.create({
      data: {
        productId: reservation.productId,
        quantity: reservation.quantity,
        orderId: reservation.orderId,
        customerId: reservation.customerId,
        expiresAt: reservation.expiresAt,
        status: 'active',
      },
    });
  }

  async findByOrderId(orderId: string): Promise<StockReservation | null> {
    return this.prisma.stockReservation.findUnique({
      where: { orderId },
    });
  }

  async findByProductId(productId: string): Promise<StockReservation[]> {
    return this.prisma.stockReservation.findMany({
      where: {
        productId,
        status: 'active',
      },
    });
  }

  async updateStatus(reservationId: string, status: string): Promise<void> {
    await this.prisma.stockReservation.update({
      where: { id: reservationId },
      data: { status },
    });
  }

  async delete(reservationId: string): Promise<void> {
    await this.prisma.stockReservation.delete({
      where: { id: reservationId },
    });
  }

  async findExpired(): Promise<StockReservation[]> {
    const now = new Date();
    return this.prisma.stockReservation.findMany({
      where: {
        status: 'active',
        expiresAt: {
          lt: now,
        },
      },
    });
  }

  async releaseByOrderId(orderId: string): Promise<void> {
    await this.prisma.stockReservation.updateMany({
      where: {
        orderId,
        status: 'active',
      },
      data: {
        status: 'released',
      },
    });
  }
}
