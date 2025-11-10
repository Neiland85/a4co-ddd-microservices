import { BaseService } from '@a4co/shared-utils/src/base';

export class AuthService extends BaseService {
  constructor() {
    super('AuthService');
  }

  login(username: string, password: string): string {
    try {
      const validatedUsername = this.validateRequired(username, 'username');
      this.validateRequired(password, 'password');

      this.log('User authenticated', { username: validatedUsername });

      return this.createSuccessMessage('User', 'authenticated', validatedUsername);
    } catch (error) {
      return this.handleServiceError(error, 'login');
    }
  }

  register(username: string, password: string): string {
    try {
      const validatedUsername = this.validateRequired(username, 'username');
      this.validateRequired(password, 'password');

      this.log('User registration', { username: validatedUsername });

      return this.createSuccessMessage('User', 'registered', validatedUsername);
    } catch (error) {
      return this.handleServiceError(error, 'register');
    }
  }
}
