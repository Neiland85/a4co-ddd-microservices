import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have auth controller', () => {
    const controller = module.get('AuthController');
    expect(controller).toBeDefined();
  });

  it('should have auth service', () => {
    const service = module.get('AuthService');
    expect(service).toBeDefined();
  });
});
