import { AuthService } from './service';

export class AuthController {
  private authService = new AuthService();

  login(req: { username: string; password: string }): string {
    return this.authService.login(req.username, req.password);
  }

  register(req: { username: string; password: string }): string {
    return this.authService.register(req.username, req.password);
  }
}
