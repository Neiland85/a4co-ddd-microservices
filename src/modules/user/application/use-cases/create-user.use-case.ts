import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';

/**
 * Use Case: Crear un nuevo usuario
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Validar que username y email sean únicos
    const existingUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictException(`Username "${dto.username}" ya está registrado`);
    }

    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException(`Email "${dto.email}" ya está registrado`);
    }

    // Crear el usuario usando el factory method del aggregate
    const user = User.create(dto.username, dto.email);

    // Persistir el usuario
    const savedUser = await this.userRepository.save(user);

    // Limpiar eventos (en monolito no los publicamos externamente)
    savedUser.clearEvents();

    // Mapear a DTO de respuesta
    return this.mapToDto(savedUser);
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
