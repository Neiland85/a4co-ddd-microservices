import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';

// Use Cases
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';

// Domain Services
import { UserDomainService } from './domain/services/user-domain.service';

// Infrastructure
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

// Repository interfaces
import { UserRepositoryPort } from './application/ports/user-repository.port';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret-key'),
        signOptions: {
          issuer: configService.get<string>('JWT_ISSUER', 'a4co-auth-service'),
          audience: configService.get<string>('JWT_AUDIENCE', 'a4co-platform'),
        },
      }),
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
            findUnique: async() => null,
            create: async() => ({}),
            update: async() => ({}),
            delete: async() => {},
            count: async() => 0,
            findMany: async() => [],
          },
        };
      },
    },

    // Repositories
    {
      provide: 'UserRepositoryPort',
      useFactory: (prismaClient: any) => {
        return new PrismaUserRepository(prismaClient);
      },
      inject: ['PrismaClient'],
    },

    // Domain Services
    {
      provide: UserDomainService,
      useFactory: (userRepository: UserRepositoryPort) => {
        return new UserDomainService(userRepository);
      },
      inject: ['UserRepositoryPort'],
    },

    // Use Cases
    {
      provide: RegisterUserUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        cryptographyService: any,
        eventBus: any,
        userDomainService: UserDomainService,
      ) => {
        return new RegisterUserUseCase(
          userRepository,
          cryptographyService,
          eventBus,
          userDomainService,
        );
      useFactory: (userRepository: UserRepository, userDomainService: UserDomainService) => {
        return new RegisterUserUseCase(userRepository, userDomainService);
      },
      inject: ['UserRepositoryPort', 'CryptographyServicePort', 'EventBusPort', UserDomainService],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepository: UserRepositoryPort, jwtService: any) => {
        return new LoginUserUseCase(userRepository, jwtService);
      },
      inject: ['UserRepositoryPort', JwtModule],
    },
  ],
})
export class AuthModule {}
