import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { UpdateUserDto, UserResponseDto } from '../dto/user.dto';

/**
 * Use Case: Actualizar un usuario existente
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    // Buscar el usuario
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado`);
    }

    // Actualizar username si se proporciona
    if (dto.username && dto.username !== user.username) {
      // Verificar que el nuevo username no esté en uso
      const existingUsername = await this.userRepository.findByUsername(dto.username);
      if (existingUsername && existingUsername.id !== userId) {
        throw new ConflictException(`Username "${dto.username}" ya está registrado`);
      }
      user.updateUsername(dto.username);
    }

    // Actualizar email si se proporciona
    if (dto.email && dto.email !== user.email) {
      // Verificar que el nuevo email no esté en uso
      const existingEmail = await this.userRepository.findByEmail(dto.email);
      if (existingEmail && existingEmail.id !== userId) {
        throw new ConflictException(`Email "${dto.email}" ya está registrado`);
      }
      user.updateEmail(dto.email);
    }

    // Actualizar estado si se proporciona
    if (dto.isActive !== undefined && dto.isActive !== user.isActive) {
      if (dto.isActive) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    // Persistir cambios
    const updatedUser = await this.userRepository.save(user);

    // Limpiar eventos
    updatedUser.clearEvents();

    // Mapear a DTO de respuesta
    return this.mapToDto(updatedUser);
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
