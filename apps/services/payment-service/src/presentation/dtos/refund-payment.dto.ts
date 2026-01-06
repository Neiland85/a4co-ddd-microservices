import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentDto {
  @ApiProperty({
    description: 'Monto a reembolsar en centavos. Si no se especifica, se reembolsa el total',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({
    description: 'Razón del reembolso',
    example: 'Producto defectuoso',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
