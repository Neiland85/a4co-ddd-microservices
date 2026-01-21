import { Module, Global } from '@nestjs/common';
import { PrismaAccelerateService } from './prisma-accelerate.service';

@Global()
@Module({
  providers: [PrismaAccelerateService],
  exports: [PrismaAccelerateService],
})
export class PrismaAccelerateModule {}
