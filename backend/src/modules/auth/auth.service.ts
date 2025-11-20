import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(email: string, password: string) {
    // TODO: Implement authentication logic
    return {
      access_token: 'mock-jwt-token',
      user: { id: 1, email, name: 'Mock User' },
    };
  }

  async register(registerDto: { email: string; password: string; name: string }) {
    // TODO: Implement user registration logic
    return {
      message: 'User registered successfully',
      user: { id: 1, ...registerDto },
    };
  }
}
