import { Module, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
    providers: [
        {
            provide: PrismaClient,
            useFactory: () => {
                return new PrismaClient({
                    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
                });
            },
        },
    ],
    exports: [PrismaClient],
})
export class DatabaseModule {}
