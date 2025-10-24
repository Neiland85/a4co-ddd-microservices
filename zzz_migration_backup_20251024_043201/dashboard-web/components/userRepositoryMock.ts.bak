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
