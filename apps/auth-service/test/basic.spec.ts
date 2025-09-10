import { RegisterUserDto, UserResponseDto } from '../src/application/dto/user.dto';
import { UserStatus } from '../src/domain/aggregates/user.aggregate';
import { Email, UserName } from '../src/domain/value-objects/user-value-objects';

describe('Auth Service - Basic Integration', () => {
  it('should create RegisterUserDto with valid data', () => {
    const dto = new RegisterUserDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.password = 'SecurePassword123';

    expect(dto.email).toBe('test@example.com');
    expect(dto.name).toBe('Test User');
    expect(dto.password).toBe('SecurePassword123');
  });

  it('should create UserResponseDto correctly', () => {
    const responseDto = new UserResponseDto();
    responseDto.id = 'test-id-123';
    responseDto.email = 'test@example.com';
    responseDto.name = 'Test User';
    responseDto.status = UserStatus.ACTIVE;
    responseDto.emailVerified = false;
    responseDto.createdAt = new Date();
    responseDto.updatedAt = new Date();

    expect(responseDto.id).toBe('test-id-123');
    expect(responseDto.email).toBe('test@example.com');
    expect(responseDto.status).toBe(UserStatus.ACTIVE);
    expect(responseDto.emailVerified).toBe(false);
  });

  it('should create Email value object', () => {
    const email = new Email('user@example.com');
    expect(email.value).toBe('user@example.com');
  });

  it('should create UserName value object', () => {
    const userName = new UserName('John Doe');
    expect(userName.value).toBe('John Doe');
  });

  it('should validate UserStatus enum', () => {
    expect(UserStatus.ACTIVE).toBe('active');
    expect(UserStatus.INACTIVE).toBe('inactive');
    expect(UserStatus.SUSPENDED).toBe('suspended');
  });

  it('should serialize/deserialize DTOs correctly', () => {
    const dto = new RegisterUserDto();
    dto.email = 'serialize@test.com';
    dto.name = 'Serialize Test';
    dto.password = 'TestPassword123';

    const json = dto.toJSON();
    expect(json.email).toBe('serialize@test.com');
    expect(json.name).toBe('Serialize Test');
    expect(typeof json).toBe('object');
  });
});
