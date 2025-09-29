import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceModule } from '../user-service.module';

describe('UserServiceModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserServiceModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have user-service controller', () => {
    const controller = module.get('UserServiceController');
    expect(controller).toBeDefined();
  });

  it('should have user-service service', () => {
    const service = module.get('UserServiceService');
    expect(service).toBeDefined();
  });
});
