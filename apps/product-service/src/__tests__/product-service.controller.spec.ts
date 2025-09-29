import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceController } from '../product-service.controller';
import { ProductServiceService } from '../product-service.service';

describe('ProductServiceController', () => {
  let controller: ProductServiceController;
  let service: ProductServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductServiceController],
      providers: [
        {
          provide: ProductServiceService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductServiceController>(ProductServiceController);
    service = module.get<ProductServiceService>(ProductServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of product-service', async () => {
      const result = [{ id: 1, name: 'Test product-service' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product-service', async () => {
      const result = { id: 1, name: 'Test product-service' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });
});
