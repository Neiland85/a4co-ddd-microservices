import { Controller, Get } from '@nestjs/common';
import { UserService } from '../application/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }
}
