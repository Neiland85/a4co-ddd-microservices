import { Module } from '@nestjs/common';

// Prisma centralizado
import { PrismaModule } from '../../common/prisma/prisma.module';

// Presentation Layer
import { UserController } from './presentation/controllers';

// Application Layer
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  DeleteUserUseCase,
} from './application/use-cases';

// Infrastructure Layer
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  imports: [
    // Prisma centralizado
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [
    // Infrastructure - Repository
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },

    // Application - Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    'UserRepositoryPort',
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
