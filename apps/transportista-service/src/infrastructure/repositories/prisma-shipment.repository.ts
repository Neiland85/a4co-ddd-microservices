import { Injectable } from '@nestjs/common';
import { Shipment, ShipmentStatus } from '../../domain/aggregates/shipment.aggregate.js';
import { ShipmentRepository } from '../../domain/repositories/shipment.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Shipment as PrismaShipment, Prisma } from '../../../prisma/generated/index.js';

@Injectable()
export class PrismaShipmentRepository implements ShipmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(shipment: Shipment): Promise<Shipment> {
    const data: Prisma.ShipmentUncheckedCreateInput = {
      id: shipment.id,
      orderId: shipment.orderId,
      transportistaId: shipment.transportistaId,
      status: shipment.status,
      shippingCost: new Prisma.Decimal(shipment.shippingCost),
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress,
      estimatedDeliveryTime: shipment.estimatedDeliveryTime,
      actualDeliveryTime: shipment.actualDeliveryTime,
      failureReason: shipment.failureReason,
      metadata: shipment.metadata ? (shipment.metadata as any) : null,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };

    const saved = await this.prisma.shipment.upsert({
      where: { id: shipment.id },
      create: data,
      update: {
        transportistaId: data.transportistaId,
        status: data.status,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        actualDeliveryTime: data.actualDeliveryTime,
        failureReason: data.failureReason,
        metadata: data.metadata,
        updatedAt: data.updatedAt,
      },
    });

    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Shipment | null> {
    const record = await this.prisma.shipment.findUnique({
      where: { id },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findByOrderId(orderId: string): Promise<Shipment | null> {
    const record = await this.prisma.shipment.findUnique({
      where: { orderId },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findByTransportistaId(transportistaId: string): Promise<Shipment[]> {
    const records = await this.prisma.shipment.findMany({
      where: { transportistaId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async findByStatus(status: ShipmentStatus): Promise<Shipment[]> {
    const records = await this.prisma.shipment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async findAll(): Promise<Shipment[]> {
    const records = await this.prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipment.delete({
      where: { id },
    });
  }

  private mapToDomain(record: PrismaShipment): Shipment {
    return new Shipment(
      record.id,
      record.orderId,
      record.pickupAddress,
      record.deliveryAddress,
      Number(record.shippingCost),
      record.status as ShipmentStatus,
      record.transportistaId,
      record.estimatedDeliveryTime,
      record.actualDeliveryTime,
      record.failureReason,
      record.metadata as any,
      record.createdAt,
      record.updatedAt,
    );
  }
}
