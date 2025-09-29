import { Test, TestingModule } from '@nestjs/testing';
import { PaymentServiceModule } from '../payment-service.module';

describe('PaymentServiceModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PaymentServiceModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have payment-service controller', () => {
    const controller = module.get('PaymentServiceController');
    expect(controller).toBeDefined();
  });

  it('should have payment-service service', () => {
    const service = module.get('PaymentServiceService');
    expect(service).toBeDefined();
  });
});
