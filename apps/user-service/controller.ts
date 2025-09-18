import { BaseController } from '../../packages/shared-utils/src/base';
import { UserService } from './service';

interface CreateUserRequest {
  username: string;
  email: string;
}

interface GetUserRequest {
  username: string;
}

export class UserController extends BaseController<UserService> {
  constructor() {
    super(UserService);
  }

  createUser(req: CreateUserRequest): string {
    try {
      const validated = this.validateRequest<CreateUserRequest>(req, ['username', 'email']);
      const result = this.service.createUser(validated.username, validated.email);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }

  getUser(req: GetUserRequest): string {
    try {
      const validated = this.validateRequest<GetUserRequest>(req, ['username']);
      const result = this.service.getUser(validated.username);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }
}
