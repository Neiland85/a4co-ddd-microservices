import { RegisterUserDto } from '../src/application/dto/user.dto';
import { User, UserStatus } from '../src/domain/aggregates/user.aggregate';

export const createRegisterUserDto = (
  overrides: Partial<RegisterUserDto> = {}
): RegisterUserDto => {
  const dto = new RegisterUserDto();
  dto.email = overrides.email ?? process.env.TEST_EMAIL || 'test@example.com';
  dto.name = overrides.name ?? 'Test User';
  dto.password = overrides.password ?? process.env.TEST_PASSWORD || 'Password123';
  return dto;
};

export const createUser = (overrides: Partial<User> = {}): User => {
  return User.reconstruct(
    overrides.id ?? 'test-id',
    overrides.email ?? process.env.TEST_EMAIL || 'test@example.com',
    overrides.name ?? 'Test User',
    overrides.hashedPassword ?? 'hashed-password',
    overrides.status ?? UserStatus.ACTIVE,
    overrides.emailVerified ?? false,
    overrides.lastLoginAt ?? undefined,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
    {}
  );
};
