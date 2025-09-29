import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from '../../auth-service.service';
import { PrismaService } from '@a4co/observability';

describe('AuthService Database Integration', () => {
  let service: AuthServiceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceService,
        PrismaService,
      ],
    }).compile();

    service = module.get<AuthServiceService>(AuthServiceService);
    prisma = module.get<PrismaService>(PrismaService);
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
