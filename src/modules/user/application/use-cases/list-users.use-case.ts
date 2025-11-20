import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { UserResponseDto } from '../dto/user.dto';

/**
 * Use Case: Listar todos los usuarios
 */
@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.mapToDto(user));
  }

  private mapToDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.email = user.email;
    dto.isActive = user.isActive;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
