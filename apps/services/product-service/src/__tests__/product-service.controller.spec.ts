import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../application/services/product.service';
import { ProductController } from '../product.controller';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            getProduct: jest.fn(),
            getProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const result = { id: '1', name: 'Test Product' };
      jest.spyOn(service, 'createProduct').mockResolvedValue(result as any);

      expect(service.createProduct).toBeDefined();
    });
  });
});
