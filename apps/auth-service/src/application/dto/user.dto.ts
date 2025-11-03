import { IsEmail, IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

/**
 * DTO para registro: incluye `name` porque los use-cases lo usan.
 */
export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  // Algunos archivos usan `name`, otros `fullName` — incluimos ambos (opcionales)
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  fullName?: string;
}

/**
 * DTO para login
 */
export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

/**
 * Respuesta pública del usuario — refleja los campos que se usan en los use-cases.
 * Usamos tipos Date | string para evitar errores cuando la entidad devuelve Date.
 */
export class UserResponseDto {
  id!: string;
  email!: string;

  // Nombre (coexistencia name / fullName)
  name?: string;
  fullName?: string;

  // Estado y verificación
  status?: string;
  emailVerified?: boolean;

  // Fechas pueden venir como Date desde la entidad/DB — aceptar Date | string
  lastLoginAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
