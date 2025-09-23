import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';

// Use Cases
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';

// Domain Services
import { UserDomainService } from './domain/services/user-domain.service';

// Infrastructure
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

// Repository interfaces
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return {
          secret: jwtSecret,
          signOptions: {
            issuer: configService.get<string>('JWT_ISSUER', 'a4co-auth-service'),
            audience: configService.get<string>('JWT_AUDIENCE', 'a4co-platform'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Database - Proveedor personalizado de PrismaClient
    {
      provide: 'PrismaClient',
      useFactory: () => {
        // Simulamos PrismaClient por ahora para que compile
        return {
          user: {
            findUnique: async () => null,
            create: async () => ({}),
            update: async () => ({}),
            delete: async () => {},
            count: async () => 0,
            findMany: async () => [],
          },
        };
      },
    },

    // Repositories
    {
      provide: 'UserRepository',
      useFactory: (prismaClient: any) => {
        return new PrismaUserRepository(prismaClient);
      },
      inject: ['PrismaClient'],
    },

    // Domain Services
    {
      provide: UserDomainService,
      useFactory: (userRepository: UserRepository) => {
        return new UserDomainService(userRepository);
      },
      inject: ['UserRepository'],
    },

    // Use Cases
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepository: UserRepository, userDomainService: UserDomainService) => {
        return new RegisterUserUseCase(userRepository, userDomainService);
      },
      inject: ['UserRepository', UserDomainService],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepository: UserRepository, jwtService: any) => {
        return new LoginUserUseCase(userRepository, jwtService);
      },
      inject: ['UserRepository', JwtModule],
    },
  ],
})
export class AuthModule {}
