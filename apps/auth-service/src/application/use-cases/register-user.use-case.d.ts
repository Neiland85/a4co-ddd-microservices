import { UseCase } from '@a4co/shared-utils';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { CryptographyServicePort } from '../ports/cryptography-service.port';
import { EventBusPort } from '../ports/event-bus.port';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { RegisterUserDto, UserResponseDto } from '../dto/user.dto';
export declare class RegisterUserUseCase implements UseCase<RegisterUserDto, UserResponseDto> {
    private readonly userRepository;
    private readonly cryptographyService;
    private readonly eventBus;
    private readonly userDomainService;
    constructor(userRepository: UserRepositoryPort, cryptographyService: CryptographyServicePort, eventBus: EventBusPort, userDomainService: UserDomainService);
    execute(request: RegisterUserDto): Promise<UserResponseDto>;
    private mapToDto;
}
//# sourceMappingURL=register-user.use-case.d.ts.map