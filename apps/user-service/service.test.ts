import { UserService } from './service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should create a user', () => {
    const result = userService.createUser('testUser', process.env.TEST_EMAIL || 'test@example.com');
    expect(result).toBe(`Usuario testUser creado con email ${process.env.TEST_EMAIL || 'test@example.com'}.`);
  });

  it('should get user information', () => {
    const result = userService.getUser('testUser');
    expect(result).toBe('Información del usuario testUser.');
  });
});
