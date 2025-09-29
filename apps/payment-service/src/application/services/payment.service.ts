import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  getHealth() {
    return { status: 'ok', service: 'payment-service' };
  }
}
