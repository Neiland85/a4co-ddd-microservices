import { RegisterUserDto } from '../src/application/dto/user.dto';
import { User, UserStatus } from '../src/domain/aggregates/user.aggregate';

export const createRegisterUserDto = (
  overrides: Partial<RegisterUserDto> = {},
): RegisterUserDto => {
  const dto = new RegisterUserDto();
  dto.email = overrides.email ?? 'test@example.com';
  dto.name = overrides.name ?? 'Test User';
  dto.password = overrides.password ?? 'Password123';
  return dto;
};

export const createUser = (overrides: Partial<User> = {}): User => {
  const id = overrides.id ?? 'test-id';
  const email = overrides.email ?? 'test@example.com';
  const name = overrides.name ?? 'Test User';
  const hashedPassword = overrides.hashedPassword ?? 'hashed-password';
  const status = overrides.status ?? UserStatus.ACTIVE;
  const emailVerified = overrides.emailVerified ?? false;
  const lastLoginAt = overrides.lastLoginAt;
  const createdAt = overrides.createdAt ?? new Date();
  const updatedAt = overrides.updatedAt ?? new Date();

  const timestamps: any = { createdAt, updatedAt };
  if (lastLoginAt !== undefined) {
    timestamps.lastLoginAt = lastLoginAt;
  }

  return User.reconstruct(
    { id, email, name },
    { hashedPassword, status, emailVerified },
    timestamps,
    {
      id,
      email,
      name,
      hashedPassword,
      status,
      emailVerified,
      ...(lastLoginAt && { lastLoginAt }),
      createdAt,
      updatedAt,
    },
  );
};
