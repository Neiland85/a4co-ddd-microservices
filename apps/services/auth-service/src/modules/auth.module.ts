import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/controllers/auth.controller';
import { AuthHealthUseCase } from '../application/use-cases/auth-health.usecase';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthHealthUseCase],
})
export class AuthModule {}
