import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { BaseDto } from '@a4co/shared-utils';

export class RegisterUserDto extends BaseDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email!: string;

  @IsString({ message: 'Nombre debe ser texto' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  @MinLength(2, { message: 'Nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'Nombre no puede tener más de 50 caracteres' })
  name!: string;

  @IsString({ message: 'Password debe ser texto' })
  @IsNotEmpty({ message: 'Password es requerido' })
  @MinLength(8, { message: 'Password debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'Password no puede tener más de 100 caracteres' })
  password!: string;
}

export class LoginUserDto extends BaseDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email!: string;

  @IsString({ message: 'Password debe ser texto' })
  @IsNotEmpty({ message: 'Password es requerido' })
  password!: string;
}

export class ChangePasswordDto extends BaseDto {
  @IsString({ message: 'Password actual debe ser texto' })
  @IsNotEmpty({ message: 'Password actual es requerido' })
  currentPassword!: string;

  @IsString({ message: 'Nuevo password debe ser texto' })
  @IsNotEmpty({ message: 'Nuevo password es requerido' })
  @MinLength(8, { message: 'Nuevo password debe tener al menos 8 caracteres' })
  @MaxLength(100, {
    message: 'Nuevo password no puede tener más de 100 caracteres',
  })
  newPassword!: string;
}

export class UserResponseDto extends BaseDto {
  id!: string;
  email!: string;
  name!: string;
  status!: string;
  emailVerified!: boolean;
  lastLoginAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
