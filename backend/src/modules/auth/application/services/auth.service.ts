export class AuthService {
  login(username: string, password: string): string {
    return `Usuario ${username} autenticado.`;
  }

  register(username: string, password: string): string {
    return `Usuario ${username} registrado.`;
  }
}
