import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceModule } from '../auth-service.module';

describe('AuthServiceModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthServiceModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have auth-service controller', () => {
    const controller = module.get('AuthServiceController');
    expect(controller).toBeDefined();
  });

  it('should have auth-service service', () => {
    const service = module.get('AuthServiceService');
    expect(service).toBeDefined();
  });
});
