import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentStatus } from '../../domain/aggregates/shipment.aggregate.js';

export class ShipmentResponseDto {
  @ApiProperty({
    description: 'Shipment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  orderId: string;

  @ApiPropertyOptional({
    description: 'Transportista ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  transportistaId: string | null;

  @ApiProperty({
    description: 'Current shipment status',
    enum: ShipmentStatus,
    example: ShipmentStatus.ASSIGNED,
  })
  status: ShipmentStatus;

  @ApiProperty({
    description: 'Shipping cost in EUR',
    example: 15.50,
  })
  shippingCost: number;

  @ApiProperty({
    description: 'Pickup address',
    example: 'Warehouse A, Calle Principal 123, Málaga, Spain',
  })
  pickupAddress: string;

  @ApiProperty({
    description: 'Delivery address',
    example: 'Customer Name, Avenida Andalucía 456, Sevilla, Spain',
  })
  deliveryAddress: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery time',
    example: '2025-01-20T14:30:00Z',
  })
  estimatedDeliveryTime: Date | null;

  @ApiPropertyOptional({
    description: 'Actual delivery time',
    example: '2025-01-20T15:45:00Z',
  })
  actualDeliveryTime: Date | null;

  @ApiPropertyOptional({
    description: 'Failure reason if status is FAILED',
    example: 'Customer not available',
  })
  failureReason: string | null;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata: Record<string, any> | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-18T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-18T11:30:00Z',
  })
  updatedAt: Date;
}
