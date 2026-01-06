import { IsNotEmpty, IsString, IsNumber, IsOptional, IsObject, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID único de la orden asociada al pago',
    example: 'order-123',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Monto del pago en centavos',
    example: 10000,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Código de moneda ISO 4217',
    example: 'EUR',
    default: 'EUR',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['EUR', 'USD', 'GBP'])
  currency: string = 'EUR';

  @ApiProperty({
    description: 'ID del cliente',
    example: 'cust-456',
  })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Descripción del pago',
    example: 'Compra en Mercado Local de Jaén',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Metadatos adicionales del pago',
    example: { productIds: ['prod-1', 'prod-2'], promocode: 'JAEN10' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
