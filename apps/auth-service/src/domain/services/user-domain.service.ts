import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/ports/user-repository.port';

@Injectable()
export class UserDomainService {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort
  ) {}

  async isEmailUnique(email: string): Promise<boolean> {
    const exists = await this.userRepository.existsByEmail(email);
    return !exists;
  }

  async validateUniqueEmail(email: string): Promise<void> {
    const isUnique = await this.isEmailUnique(email);
    if (!isUnique) {
      throw new Error('El email ya está registrado');
    }
  }

  async canUserPerformAction(userId: string, action: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }

    // Verificaciones básicas
    if (user.status !== 'active') {
      return false;
    }

    if (!user.emailVerified && action !== 'verify-email') {
      return false;
    }

    return true;
  }
}
