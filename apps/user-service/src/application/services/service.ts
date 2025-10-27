import { User, Username, Email, IUserRepository } from '../../domain';

// DTOs (Data Transfer Objects)

export interface CreateUserDTO {
  username: string;
  email: string;
}

export interface UpdateUserDTO {
  userId: string;
  username?: string;
  email?: string;
}

export interface GetUserDTO {
  userId?: string;
  username?: string;
  email?: string;
}

// APPLICATION SERVICE

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async createUser(dto: CreateUserDTO): Promise<User> {
    // Check if user already exists
    const existingByUsername = await this.userRepository.findByUsername(dto.username);
    if (existingByUsername) {
      throw new Error(`User with username ${dto.username} already exists`);
    }

    const existingByEmail = await this.userRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new Error(`User with email ${dto.email} already exists`);
    }

    // Create value objects
    const username = new Username(dto.username);
    const email = new Email(dto.email);

    // Generate user ID (in a real app, this might be UUID)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user aggregate
    const user = new User(userId, username, email);

    // Save user
    await this.userRepository.save(user);

    return user;
  }

  async getUser(dto: GetUserDTO): Promise<User> {
    let user: User | null = null;

    if (dto.userId) {
      user = await this.userRepository.findById(dto.userId);
    } else if (dto.username) {
      user = await this.userRepository.findByUsername(dto.username);
    } else if (dto.email) {
      user = await this.userRepository.findByEmail(dto.email);
    }

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(dto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error(`User with id ${dto.userId} not found`);
    }

    // Update username if provided
    if (dto.username) {
      const newUsername = new Username(dto.username);
      user.updateUsername(newUsername);
    }

    // Update email if provided
    if (dto.email) {
      const newEmail = new Email(dto.email);
      user.updateEmail(newEmail);
    }

    // Save updated user
    await this.userRepository.save(user);

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
