export class AdminService {
  createUser(username: string, role: string): string {
    return `Usuario ${username} creado con rol ${role}.`;
  }

  deleteUser(userId: string): string {
    return `Usuario con ID ${userId} eliminado.`;
  }
}
