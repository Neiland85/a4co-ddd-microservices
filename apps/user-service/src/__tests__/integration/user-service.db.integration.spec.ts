import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceService } from '../../user-service.service';
import { PrismaService } from '@a4co/observability';

describe('UserService Database Integration', () => {
  let service: UserServiceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceService,
        PrismaService,
      ],
    }).compile();

    service = module.get<UserServiceService>(UserServiceService);
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
