import { UserService } from '../../application/services/service';
import { InMemoryUserRepository } from '../../infrastructure/repositories/user.repository';
import { CreateUserRequestV1, UpdateUserRequestV1, UserResponseV1 } from '../../contracts/api/v1/dto';

export class UserController {
  private service: UserService;

  constructor() {
    const repository = new InMemoryUserRepository();
    this.service = new UserService(repository);
  }

  async createUser(req: CreateUserRequestV1): Promise<UserResponseV1> {
    const result = await this.service.createUser(req);
    return {
      userId: result.id,
      username: result.username.value,
      email: result.email.value,
      isActive: result.isActive,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async getUserById(userId: string): Promise<UserResponseV1> {
    const result = await this.service.getUser({ userId });
    return {
      userId: result.id,
      username: result.username.value,
      email: result.email.value,
      isActive: result.isActive,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async getUserByUsername(username: string): Promise<UserResponseV1> {
    const result = await this.service.getUser({ username });
    return {
      userId: result.id,
      username: result.username.value,
      email: result.email.value,
      isActive: result.isActive,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async updateUser(userId: string, req: UpdateUserRequestV1): Promise<UserResponseV1> {
    const result = await this.service.updateUser({ userId, ...req });
    return {
      userId: result.id,
      username: result.username.value,
      email: result.email.value,
      isActive: result.isActive,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }
}
