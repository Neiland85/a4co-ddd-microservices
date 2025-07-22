import { AdminService } from './service';

export class AdminController {
  private adminService = new AdminService();

  createUser(username: string, role: string): string {
    return this.adminService.createUser(username, role);
  }

  deleteUser(userId: string): string {
    return this.adminService.deleteUser(userId);
  }
}
