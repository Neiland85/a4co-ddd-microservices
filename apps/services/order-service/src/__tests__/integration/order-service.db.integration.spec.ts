import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceService } from '../../order-service.service';
import { PrismaClient } from '@prisma/client';

describe('OrderService Database Integration', () => {
  let service: OrderServiceService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderServiceService,
        { provide: PrismaClient, useValue: new PrismaClient(), },
      ],
    }).compile();

    service = module.get<OrderServiceService>(OrderServiceService);
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
