import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: { username: string; password: string }): Promise<any> {
    return this.authService.login(req.username, req.password);
  }

  @Post('register')
  async register(@Body() req: { username: string; password: string }): Promise<any> {
    return this.authService.register(req.username, req.password);
  }
}
