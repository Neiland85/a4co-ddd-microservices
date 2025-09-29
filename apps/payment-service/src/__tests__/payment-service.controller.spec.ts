import { Test, TestingModule } from '@nestjs/testing';
import { PaymentServiceController } from '../payment-service.controller';
import { PaymentServiceService } from '../payment-service.service';

describe('PaymentServiceController', () => {
  let controller: PaymentServiceController;
  let service: PaymentServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentServiceController],
      providers: [
        {
          provide: PaymentServiceService,
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

    controller = module.get<PaymentServiceController>(PaymentServiceController);
    service = module.get<PaymentServiceService>(PaymentServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of payment-service', async () => {
      const result = [{ id: 1, name: 'Test payment-service' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single payment-service', async () => {
      const result = { id: 1, name: 'Test payment-service' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });
});
