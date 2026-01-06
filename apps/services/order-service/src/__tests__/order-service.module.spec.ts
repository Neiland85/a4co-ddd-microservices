import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceModule } from '../order-service.module';

describe('OrderServiceModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OrderServiceModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have order-service controller', () => {
    const controller = module.get('OrderServiceController');
    expect(controller).toBeDefined();
  });

  it('should have order-service service', () => {
    const service = module.get('OrderServiceService');
    expect(service).toBeDefined();
  });
});
