import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from '../user-service.controller';
import { UserServiceService } from '../user-service.service';

describe('UserServiceController', () => {
  let controller: UserServiceController;
  let service: UserServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [
        {
          provide: UserServiceService,
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

    controller = module.get<UserServiceController>(UserServiceController);
    service = module.get<UserServiceService>(UserServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of user-service', async () => {
      const result = [{ id: 1, name: 'Test user-service' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user-service', async () => {
      const result = { id: 1, name: 'Test user-service' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });
});
