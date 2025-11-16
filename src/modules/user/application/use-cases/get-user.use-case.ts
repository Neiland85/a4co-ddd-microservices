import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { UserResponseDto } from '../dto/user.dto';

/**
 * Use Case: Obtener un usuario por ID
 */
@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado`);
    }

    return this.mapToDto(user);
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
