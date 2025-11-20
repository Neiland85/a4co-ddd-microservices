import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryPort } from '../ports';
import { LoginUserDto, LoginResponseDto } from '../dto';

/**
 * Use Case: Login de usuario
 */
@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: LoginUserDto): Promise<LoginResponseDto> {
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

    // Limpiar eventos
    user.clearEvents();

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
