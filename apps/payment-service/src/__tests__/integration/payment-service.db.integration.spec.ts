import { Test, TestingModule } from '@nestjs/testing';
import { PaymentServiceService } from '../../payment-service.service';
import { PrismaService } from '@a4co/observability';

describe('PaymentService Database Integration', () => {
  let service: PaymentServiceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentServiceService,
        PrismaService,
      ],
    }).compile();

    service = module.get<PaymentServiceService>(PaymentServiceService);
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
