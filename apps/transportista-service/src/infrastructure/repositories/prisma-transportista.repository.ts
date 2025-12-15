import { Injectable } from '@nestjs/common';
import { Transportista } from '../../domain/aggregates/transportista.entity.js';
import { TransportistaRepository } from '../../domain/repositories/transportista.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Transportista as PrismaTransportista } from '../../../prisma/generated/index.js';

@Injectable()
export class PrismaTransportistaRepository implements TransportistaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transportista: Transportista): Promise<Transportista> {
    const saved = await this.prisma.transportista.upsert({
      where: { id: transportista.id },
      create: {
        id: transportista.id,
        name: transportista.name,
        email: transportista.email,
        phone: transportista.phone,
        serviceAreas: transportista.serviceAreas,
        totalShipments: transportista.totalShipments,
        successfulShipments: transportista.successfulShipments,
        averageDeliveryTime: transportista.averageDeliveryTime,
        rating: transportista.rating,
        isActive: transportista.isActive,
        createdAt: transportista.createdAt,
        updatedAt: transportista.updatedAt,
      },
      update: {
        name: transportista.name,
        email: transportista.email,
        phone: transportista.phone,
        serviceAreas: transportista.serviceAreas,
        totalShipments: transportista.totalShipments,
        successfulShipments: transportista.successfulShipments,
        averageDeliveryTime: transportista.averageDeliveryTime,
        rating: transportista.rating,
        isActive: transportista.isActive,
        updatedAt: transportista.updatedAt,
      },
    });

    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Transportista | null> {
    const record = await this.prisma.transportista.findUnique({
      where: { id },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findByEmail(email: string): Promise<Transportista | null> {
    const record = await this.prisma.transportista.findUnique({
      where: { email },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findActive(): Promise<Transportista[]> {
    const records = await this.prisma.transportista.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async findByServiceArea(area: string): Promise<Transportista[]> {
    const records = await this.prisma.transportista.findMany({
      where: {
        isActive: true,
        serviceAreas: {
          has: area,
        },
      },
      orderBy: { rating: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async findAll(): Promise<Transportista[]> {
    const records = await this.prisma.transportista.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transportista.delete({
      where: { id },
    });
  }

  private mapToDomain(record: PrismaTransportista): Transportista {
    return new Transportista(
      record.id,
      record.name,
      record.email,
      record.phone,
      record.serviceAreas,
      record.totalShipments,
      record.successfulShipments,
      record.averageDeliveryTime,
      record.rating || 5.0,
      record.isActive,
      record.createdAt,
      record.updatedAt,
    );
  }
}
