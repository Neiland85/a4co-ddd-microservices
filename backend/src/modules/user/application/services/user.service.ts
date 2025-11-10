import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHealth() {
    return { status: 'ok', service: 'user-service' };
  }
}
