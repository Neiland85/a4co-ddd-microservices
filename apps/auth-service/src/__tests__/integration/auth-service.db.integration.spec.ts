import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../service';

describe('AuthService Database Integration', () => {
  let service: AuthService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaClient,
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should connect to database', async () => {
    const isConnected = await prisma.$connect();
    expect(isConnected).toBeUndefined(); // $connect() returns void on success
  });

  it('should perform database operations', async () => {
    // Add database integration tests
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
