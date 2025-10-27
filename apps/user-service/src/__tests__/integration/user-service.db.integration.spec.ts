import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceService } from '../../user-service.service';
import { PrismaClient } from '@prisma/client';

describe('UserService Database Integration', () => {
  let service: UserServiceService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceService,
        { provide: PrismaClient, useValue: new PrismaClient(), },
      ],
    }).compile();

    service = module.get<UserServiceService>(UserServiceService);
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
