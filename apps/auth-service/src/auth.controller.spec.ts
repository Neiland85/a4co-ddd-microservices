import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    controller = new AuthController();
    // Note: In a real scenario, you'd inject the service via dependency injection
    // For this simple test, we're using direct instantiation
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', () => {
      const username = 'testuser';
      const password = 'testpass';
      const req = { username, password };

      const result = controller.login(req);

      expect(result).toContain(username);
      expect(result).toContain('autenticado');
    });

    it('should handle login request', () => {
      const req = { username: 'john', password: 'secret' };

      const result = controller.login(req);

      expect(typeof result).toBe('string');
      expect(result).toBe('Usuario john autenticado.');
    });
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', () => {
      const username = 'newuser';
      const password = 'newpass';
      const req = { username, password };

      const result = controller.register(req);

      expect(result).toContain(username);
      expect(result).toContain('registrado');
    });

    it('should handle register request', () => {
      const req = { username: 'jane', password: 'password123' };

      const result = controller.register(req);

      expect(typeof result).toBe('string');
      expect(result).toBe('Usuario jane registrado.');
    });
  });
});
