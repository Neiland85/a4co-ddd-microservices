import { UseCase } from '@a4co/shared-utils';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/user.dto';
import { UserRepositoryPort } from '../ports/user-repository.port';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class LoginUserUseCase implements UseCase<LoginUserDto, LoginResponse> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: LoginUserDto): Promise<LoginResponse> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Validar password
    const isPasswordValid = await user.validatePassword(request.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'active') {
      throw new Error('Usuario inactivo');
    }

    // Registrar el login
    user.recordLogin();
    await this.userRepository.update(user);

    // Generar tokens
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
