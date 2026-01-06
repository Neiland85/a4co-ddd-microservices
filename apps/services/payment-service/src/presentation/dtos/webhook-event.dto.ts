import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WebhookEventDto {
  @ApiProperty({
    description: 'ID del evento de Stripe',
    example: 'evt_1234567890',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Tipo de evento',
    example: 'payment_intent.succeeded',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Datos del evento',
  })
  @IsObject()
  data: any;
}
