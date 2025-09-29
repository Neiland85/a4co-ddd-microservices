import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceService } from '../../product-service.service';
import { PrismaService } from '@a4co/observability';

describe('ProductService Database Integration', () => {
  let service: ProductServiceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductServiceService,
        PrismaService,
      ],
    }).compile();

    service = module.get<ProductServiceService>(ProductServiceService);
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
