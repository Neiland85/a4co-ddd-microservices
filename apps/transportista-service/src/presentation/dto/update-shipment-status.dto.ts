import { IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentStatus } from '../../domain/aggregates/shipment.aggregate.js';

export class UpdateShipmentStatusDto {
  @ApiProperty({
    description: 'New status for the shipment',
    enum: ShipmentStatus,
    example: ShipmentStatus.IN_TRANSIT,
  })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @ApiPropertyOptional({
    description: 'Failure reason (required if status is FAILED)',
    example: 'Customer not available',
  })
  @IsOptional()
  @IsString()
  failureReason?: string;

  @ApiPropertyOptional({
    description: 'Actual delivery time (for DELIVERED status)',
    example: '2025-01-20T14:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  actualDeliveryTime?: string;
}
