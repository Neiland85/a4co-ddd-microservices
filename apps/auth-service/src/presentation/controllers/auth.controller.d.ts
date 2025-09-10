import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserDto, LoginUserDto, UserResponseDto } from '../../application/dto/user.dto';
export declare class AuthController {
    private readonly registerUserUseCase;
    private readonly loginUserUseCase;
    constructor(registerUserUseCase: RegisterUserUseCase, loginUserUseCase: LoginUserUseCase);
    register(registerDto: RegisterUserDto): Promise<UserResponseDto>;
    login(loginDto: LoginUserDto): Promise<import("../../application/use-cases/login-user.use-case").LoginResponse>;
}
//# sourceMappingURL=auth.controller.d.ts.map