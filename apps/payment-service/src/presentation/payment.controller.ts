import { Controller, Get } from '@nestjs/common';
import { PaymentService } from '../application/services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('health')
  getHealth() {
    return this.paymentService.getHealth();
  }
}
