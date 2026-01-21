import { AuthService } from '../../application/services/auth.service';

export class AuthController {
  private authService = new AuthService();

  login(req: { username: string; password: string }): string {
    return this.authService.login(req.username, req.password);
  }

  register(req: { username: string; password: string }): string {
    return this.authService.register(req.username, req.password);
  }
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
