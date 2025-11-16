import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/user-repository.port';

/**
 * Use Case: Eliminar un usuario
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado`);
    }

    await this.userRepository.delete(userId);
  }
}
