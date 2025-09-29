import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../../../apps/auth-service/src/auth.service';
import { UserService } from '../../../apps/user-service/src/user.service';

describe('Service Communication Integration', () => {
  let authService: AuthService;
  let userService: UserService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should communicate between auth and user services', async () => {
    // Mock HTTP responses
    jest.spyOn(httpService, 'get').mockResolvedValue({
      data: { id: 1, email: 'user@test.com' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    const user = await userService.findById('1');
    expect(user).toBeDefined();
    expect(user.email).toBe('user@test.com');
  });
});
