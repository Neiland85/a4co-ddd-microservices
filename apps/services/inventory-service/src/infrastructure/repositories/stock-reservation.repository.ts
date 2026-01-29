import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, StockReservation as PrismaReservation } from '@prisma/client';
import { StockReservation } from '../../domain/entities/stock-reservation.entity';
import { ReservationStatus } from '../../domain/entities/stock-reservation.entity';

// Definimos la interfaz aquí o la importamos si ya existe en domain
export interface IStockReservationRepository {
  findByOrderId(orderId: string): Promise<StockReservation | null>;
  findByProductId(productId: string): Promise<StockReservation[]>;
  updateStatus(reservationId: string, status: string): Promise<void>;
  delete(reservationId: string): Promise<void>;
  findExpired(): Promise<StockReservation[]>;
  releaseByOrderId(orderId: string): Promise<void>;
  save(reservation: StockReservation): Promise<void>;
}

@Injectable()
export class PrismaStockReservationRepository implements IStockReservationRepository {
  constructor(
    @Inject('PRISMA_CLIENT')
    private readonly prisma: PrismaClient,
  ) {}

  async findByOrderId(orderId: string): Promise<StockReservation | null> {
    const record = await this.prisma.stockReservation.findFirst({
      where: { orderId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByProductId(productId: string): Promise<StockReservation[]> {
    const records = await this.prisma.stockReservation.findMany({
      where: { productId },
    });
    return records.map((r) => this.toDomain(r));
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
    const records = await this.prisma.stockReservation.findMany({
      where: {
        expiresAt: { lt: now },
        status: 'RESERVED', // Asumiendo que solo buscamos las activas
      },
    });
    return records.map((r) => this.toDomain(r));
  }

  async releaseByOrderId(orderId: string): Promise<void> {
    // Actualizamos a RELEASED en lugar de borrar, para tener histórico
    await this.prisma.stockReservation.updateMany({
      where: { orderId },
      data: { status: 'RELEASED' },
    });
  }

  async save(reservation: StockReservation): Promise<void> {
    const data = reservation.toJSON();
    // Para simplificar, tomamos el primer item de la reserva
    const firstItem = data.items[0];

    await this.prisma.stockReservation.upsert({
      where: { id: data.reservationId },
      create: {
        id: data.reservationId,
        orderId: data.orderId,
        customerId: data.customerId,
        productId: firstItem.productId,
        quantity: firstItem.quantity,
        status: data.status,
        expiresAt: data.expiresAt,
        createdAt: data.createdAt,
      },
      update: {
        status: data.status,
        expiresAt: data.expiresAt,
      },
    });
  }

  // Mapper privado para convertir de Prisma a Dominio
  private toDomain(record: PrismaReservation): StockReservation {
    return new StockReservation({
      reservationId: record.id,
      orderId: record.orderId,
      customerId: record.customerId ?? '',
      items: [
        {
          productId: record.productId,
          quantity: record.quantity,
        },
      ],
      status: record.status as ReservationStatus, // Cast simple si los enums coinciden
      createdAt: record.createdAt,
      ttlMinutes: 0, // No necesitamos TTL adicional, expiresAt viene de DB
    });
  }
}
