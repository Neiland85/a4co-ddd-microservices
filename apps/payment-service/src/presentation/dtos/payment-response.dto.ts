import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'ID único del pago',
    example: 'pay_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la orden asociada',
    example: 'order-123',
  })
  orderId: string;

  @ApiProperty({
    description: 'Monto del pago en centavos',
    example: 10000,
  })
  amount: number;

  @ApiProperty({
    description: 'Código de moneda',
    example: 'EUR',
  })
  currency: string;

  @ApiProperty({
    description: 'Estado del pago',
    example: 'pending',
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
  })
  status: string;

  @ApiProperty({
    description: 'ID del PaymentIntent de Stripe',
    example: 'pi_1234567890',
    required: false,
  })
  stripePaymentIntentId?: string;

  @ApiProperty({
    description: 'ID del cliente',
    example: 'cust-456',
  })
  customerId: string;

  @ApiProperty({
    description: 'Metadatos adicionales',
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-16T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-16T12:05:00Z',
  })
  updatedAt: Date;
}
