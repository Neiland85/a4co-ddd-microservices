import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from '../product.module';

describe('ProductModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have product controller', () => {
    const controller = module.get('ProductController');
    expect(controller).toBeDefined();
  });

  it('should have product service', () => {
    const service = module.get('ProductService');
    expect(service).toBeDefined();
  });
});
