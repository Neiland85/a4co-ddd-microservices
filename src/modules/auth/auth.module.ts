import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Prisma (común)
import { PrismaModule } from '../../common/prisma/prisma.module';

// Presentation Layer
import { AuthController } from './presentation/controllers';
import { JwtStrategy } from './presentation/strategies';

// Application Layer
import { RegisterUserUseCase, LoginUserUseCase } from './application/use-cases';

// Domain Layer
import { UserDomainService } from './domain/services';

// Infrastructure Layer
import { PrismaUserRepository } from './infrastructure/repositories';

@Module({
  imports: [
    // Prisma centralizado
    PrismaModule,

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret-key'),
        signOptions: {
          expiresIn: '15m',
          issuer: 'artisan-portal',
          audience: 'artisan-portal-users',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Infrastructure
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },

    // Domain Services
    UserDomainService,

    // Application Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,

    // Strategies
    JwtStrategy,
  ],
  exports: [JwtModule, PassportModule, 'UserRepositoryPort', UserDomainService],
})
export class AuthModule {}
