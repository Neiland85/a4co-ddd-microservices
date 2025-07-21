import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import {
  RegisterUserDto,
  LoginUserDto,
  UserResponseDto,
} from '../../application/dto/user.dto';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya registrado',
  })
  async register(
    @Body() registerDto: RegisterUserDto
  ): Promise<UserResponseDto> {
    try {
      return await this.registerUserUseCase.execute(registerDto);
    } catch (error: any) {
      console.error(`Error en registro: ${error.message}`);
      if (error.message?.includes('ya está registrado')) {
        throw new Error('CONFLICT: Email ya registrado');
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginDto: LoginUserDto) {
    try {
      return await this.loginUserUseCase.execute(loginDto);
    } catch (error: any) {
      if (
        error.message?.includes('Credenciales inválidas') ||
        error.message?.includes('inactivo')
      ) {
        throw new Error('UNAUTHORIZED: ' + error.message);
      }
      throw error;
    }
  }
}
