import { IsString, IsNumber, IsOptional, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShipmentDto {
  @ApiProperty({
    description: 'Order ID associated with this shipment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Pickup address',
    example: 'Warehouse A, Calle Principal 123, Málaga, Spain',
  })
  @IsString()
  pickupAddress: string;

  @ApiProperty({
    description: 'Delivery address',
    example: 'Customer Name, Avenida Andalucía 456, Sevilla, Spain',
  })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({
    description: 'Shipping cost in EUR',
    example: 15.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  shippingCost: number;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { weight: 5.2, notes: 'Handle with care' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
