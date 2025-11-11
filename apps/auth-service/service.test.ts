import { AuthService } from './service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should authenticate a user', () => {
    const result = authService.login('testUser', 'testPass');
    expect(result).toBe('User authenticated successfully: testUser');
  });

  it('should register a user', () => {
    const result = authService.register('newUser', 'newPass');
    expect(result).toBe('User registered successfully: newUser');
  });
});
