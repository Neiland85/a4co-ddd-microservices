import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '@shared/index';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { User } from '../../domain/aggregates/user.aggregate';
import { RegisterUserDto, UserResponseDto } from '../dto/user.dto';

@Injectable()
export class RegisterUserUseCase
  implements UseCase<RegisterUserDto, UserResponseDto>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly userDomainService: UserDomainService
  ) {}

  async execute(request: RegisterUserDto): Promise<UserResponseDto> {
    // Validar que el email sea único
    await this.userDomainService.validateUniqueEmail(request.email);

    // Crear el usuario
    const user = await User.create(
      request.email,
      request.name,
      request.password
    );

    // Persistir el usuario
    const savedUser = await this.userRepository.save(user);

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
