import { UseCase } from '@a4co/shared-utils';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoginUserDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}
export declare class LoginUserUseCase implements UseCase<LoginUserDto, LoginResponse> {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    execute(request: LoginUserDto): Promise<LoginResponse>;
}
//# sourceMappingURL=login-user.use-case.d.ts.map