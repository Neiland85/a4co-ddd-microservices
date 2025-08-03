import { BaseService } from '../../packages/shared-utils/src/base';

export class UserService extends BaseService {
  constructor() {
    super('UserService');
  }

  createUser(username: string, email: string): string {
    try {
      const validatedUsername = this.validateRequired(username, 'username');
      const validatedEmail = this.validateRequired(email, 'email');
      
      this.log('Creating user', { username, email });
      
      return this.createSuccessMessage(
        'User',
        'created',
        `with ${validatedUsername} and ${validatedEmail}`
      );
    } catch (error) {
      return this.handleServiceError(error, 'createUser');
    }
  }

  getUser(username: string): string {
    try {
      const validatedUsername = this.validateId(username, 'username');
      
      this.log('Getting user', { username: validatedUsername });
      
      return this.createSuccessMessage(
        'User',
        'retrieved',
        validatedUsername
      );
    } catch (error) {
      return this.handleServiceError(error, 'getUser');
    }
  }
}
