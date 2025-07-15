import { AdminService } from './service';

describe('AdminService', () => {
  const adminService = new AdminService();

  it('should create a user', () => {
    const result = adminService.createUser('admin', 'superuser');
    expect(result).toBe('Usuario admin creado con rol superuser.');
  });

  it('should delete a user', () => {
    const result = adminService.deleteUser('user1');
    expect(result).toBe('Usuario con ID user1 eliminado.');
  });
});
