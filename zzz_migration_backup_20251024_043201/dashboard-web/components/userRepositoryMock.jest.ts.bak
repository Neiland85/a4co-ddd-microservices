const userRepositoryMock: jest.Mocked<UserRepositoryPort> = {
  existsByEmail: jest.fn().mockResolvedValue(false),
  findActiveUsers: jest.fn().mockResolvedValue([]),
  findPaginated: jest.fn().mockResolvedValue([]),
  // Otros métodos...
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// tsconfig.json
{
  "compilerOptions": {
    "types": ["jest", "node"],
    "module": "commonjs",
    "target": "es6",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
