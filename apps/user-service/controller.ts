import { UserService } from './service';

export class UserController {
  private userService = new UserService();

  createUser(req: { username: string; email: string }): string {
    return this.userService.createUser(req.username, req.email);
  }

  getUser(req: { username: string }): string {
    return this.userService.getUser(req.username);
  }
}
