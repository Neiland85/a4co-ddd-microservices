import { BaseService } from '@a4co/shared-utils';

export class AuthService extends BaseService {
  constructor() {
    super('AuthService');
  }

  login(username: string, password: string): string {
    try {
      this.log('User authenticated', { username });
      return `Usuario ${username} autenticado.`;
    } catch (error) {
      return this.handleServiceError(error, 'login');
    }
  }

  register(username: string, password: string): string {
    try {
      this.log('User registration', { username });
      return `Usuario ${username} registrado.`;
    } catch (error) {
      return this.handleServiceError(error, 'register');
    }
  }
}
