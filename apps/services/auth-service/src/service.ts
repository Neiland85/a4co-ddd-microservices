import { Injectable, Logger } from '@nestjs/common';
import { UserRepositoryPort } from './application/ports/user-repository.port';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async login(username: string, password: string): Promise<any> {
    this.logger.log('User authenticated', { username });
    throw new Error('Not implemented');
  }

  async register(username: string, password: string): Promise<any> {
    this.logger.log('User registration', { username });
    throw new Error('Not implemented');
  }
}
