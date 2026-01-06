import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceController } from '../order-service.controller';
import { OrderServiceService } from '../order-service.service';

describe('OrderServiceController', () => {
  let controller: OrderServiceController;
  let service: OrderServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderServiceController],
      providers: [
        {
          provide: OrderServiceService,
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

    controller = module.get<OrderServiceController>(OrderServiceController);
    service = module.get<OrderServiceService>(OrderServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of order-service', async () => {
      const result = [{ id: 1, name: 'Test order-service' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single order-service', async () => {
      const result = { id: 1, name: 'Test order-service' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });
});
