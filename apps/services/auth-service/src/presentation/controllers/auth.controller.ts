import { Controller, Get } from '@nestjs/common';
import { AuthHealthUseCase } from '../../application/use-cases/auth-health.usecase';
import { AuthHealthResponseDto } from '../../contracts/api/v1/auth-health-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly healthUseCase: AuthHealthUseCase) {}

  @Get('health')
  healthCheck(): AuthHealthResponseDto {
    return this.healthUseCase.execute();
  }
}
