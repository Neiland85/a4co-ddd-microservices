import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async findAll(): Promise<any[]> {
    this.logger.log('Fetching all users');
    return [];
  }
}
