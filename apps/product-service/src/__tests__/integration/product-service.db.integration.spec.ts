import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../../application/services/product.service';

describe('ProductService Database Integration', () => {
  let service: ProductService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, { provide: PrismaClient, useValue: new PrismaClient() }],
    }).compile();

    service = module.get<ProductService>(ProductService);
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
