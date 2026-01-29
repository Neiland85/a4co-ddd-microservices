import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaAccelerateService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Extiende el cliente con Accelerate
    super().$extends(withAccelerate());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(_app: any) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
    });
  }
}
