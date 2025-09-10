import { UserRepositoryPort } from '../../application/ports/user-repository.port';
export declare class UserDomainService {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    isEmailUnique(email: string): Promise<boolean>;
    validateUniqueEmail(email: string): Promise<void>;
    canUserPerformAction(userId: string, action: string): Promise<boolean>;
}
//# sourceMappingURL=user-domain.service.d.ts.map