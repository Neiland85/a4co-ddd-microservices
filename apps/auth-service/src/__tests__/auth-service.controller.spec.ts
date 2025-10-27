import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../presentation/controllers/auth.controller';
import { AuthService } from '../service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const result = 'Usuario test registrado.';
      jest.spyOn(service, 'register').mockReturnValue(result);

      expect(service.register('test', 'password')).toBe(result);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const result = 'Usuario test autenticado.';
      jest.spyOn(service, 'login').mockReturnValue(result);

      expect(service.login('test', 'password')).toBe(result);
    });
  });
});
