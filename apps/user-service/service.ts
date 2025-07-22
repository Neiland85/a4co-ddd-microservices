export class UserService {
  createUser(username: string, email: string): string {
    return `Usuario ${username} creado con email ${email}.`;
  }

  getUser(username: string): string {
    return `Información del usuario ${username}.`;
  }
}
