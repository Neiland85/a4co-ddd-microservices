import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return login message', () => {
      const result = service.login('testuser', 'password');
      expect(result).toBe('Usuario testuser autenticado.');
    });
  });

  describe('register', () => {
    it('should return register message', () => {
      const result = service.register('testuser', 'password');
      expect(result).toBe('Usuario testuser registrado.');
    });
  });
});
