import { Injectable, Inject } from '@nestjs/common';
import type { UseCase } from './use-case';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { CryptographyServicePort } from '../ports/cryptography-service.port';
import { EventBusPort } from '../ports/event-bus.port';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { User } from '../../domain/aggregates/user.aggregate';
import { RegisterUserDto, UserResponseDto } from '../dto/user.dto';

@Injectable()
export class RegisterUserUseCase implements UseCase<RegisterUserDto, UserResponseDto> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('CryptographyServicePort')
    private readonly cryptographyService: CryptographyServicePort,
    @Inject('EventBusPort')
    private readonly eventBus: EventBusPort,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(request: RegisterUserDto): Promise<UserResponseDto> {
    try {
      // Validar que el email sea único usando el dominio service
      await this.userDomainService.validateUniqueEmail(request.email);

      // Hash de la contraseña usando el adapter
      const hashedPassword = await this.cryptographyService.hashPassword(request.password);

      // Crear el usuario con contraseña ya hasheada
      const name = (request.name ?? request.fullName ?? '').trim();
    const user = await User.createWithHashedPassword(request.email, name, hashedPassword);

      // Persistir el usuario usando el adapter
      const savedUser = await this.userRepository.save(user);

      // Publicar eventos de dominio
      const domainEvents = savedUser.getUncommittedEvents();
      await this.eventBus.publishAll(domainEvents);
      savedUser.clearEvents();

      // Mapear a DTO de respuesta
      return this.mapToDto(savedUser);
    } catch (error) {
      const err = error as Error;
      console.error(`Error en RegisterUserUseCase: ${err.message}`);
      throw err;
    }
  }

  private mapToDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.status = user.status;
    dto.emailVerified = user.emailVerified;
    if (user.lastLoginAt !== undefined) {
    dto.lastLoginAt = user.lastLoginAt;
    }
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
