import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepositoryPort } from '../ports';
import { UserDomainService } from '../../domain/services';
import { User } from '../../domain/aggregates';
import { RegisterUserDto, UserResponseDto } from '../dto';

/**
 * Use Case: Registrar un nuevo usuario
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(request: RegisterUserDto): Promise<UserResponseDto> {
    // Validar que el email sea único
    await this.userDomainService.validateUniqueEmail(request.email);

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(request.password, 12);

    // Crear el usuario con contraseña ya hasheada
    const user = await User.createWithHashedPassword(request.email, request.name, hashedPassword);

    // Persistir el usuario
    const savedUser = await this.userRepository.save(user);

    // Limpiar eventos (en monolito no los publicamos por ahora)
    savedUser.clearEvents();

    // Mapear a DTO de respuesta
    return this.mapToDto(savedUser);
  }

  private mapToDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.status = user.status;
    dto.emailVerified = user.emailVerified;
    dto.lastLoginAt = user.lastLoginAt;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
