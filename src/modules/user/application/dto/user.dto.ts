import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para crear un nuevo usuario
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3, { message: 'Username debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'Username no puede exceder 50 caracteres' })
  username: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;
}

/**
 * DTO para actualizar un usuario existente
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'Nuevo nombre de usuario',
    example: 'johndoe_updated',
    required: false,
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'Username no puede exceder 50 caracteres' })
  username?: string;

  @ApiProperty({
    description: 'Nuevo correo electrónico',
    example: 'john.updated@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email debe ser válido' })
  email?: string;

  @ApiProperty({
    description: 'Estado de activación del usuario',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * DTO de respuesta con datos del usuario
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
