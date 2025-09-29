import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceModule } from '../product-service.module';

describe('ProductServiceModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductServiceModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have product-service controller', () => {
    const controller = module.get('ProductServiceController');
    expect(controller).toBeDefined();
  });

  it('should have product-service service', () => {
    const service = module.get('ProductServiceService');
    expect(service).toBeDefined();
  });
});
