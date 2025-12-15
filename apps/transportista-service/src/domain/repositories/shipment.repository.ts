import { Shipment, ShipmentStatus } from '../aggregates/shipment.aggregate.js';

export interface ShipmentRepository {
  save(shipment: Shipment): Promise<Shipment>;
  findById(id: string): Promise<Shipment | null>;
  findByOrderId(orderId: string): Promise<Shipment | null>;
  findByTransportistaId(transportistaId: string): Promise<Shipment[]>;
  findByStatus(status: ShipmentStatus): Promise<Shipment[]>;
  findAll(): Promise<Shipment[]>;
  delete(id: string): Promise<void>;
}
