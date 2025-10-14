"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
class LoginUserUseCase {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async execute(request) {
        // Buscar usuario por email
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        // Validar password
        const isPasswordValid = await user.validatePassword(request.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }
        // Verificar que el usuario esté activo
        if (user.status !== 'active') {
            throw new Error('Usuario inactivo');
        }
        // Registrar el login
        user.recordLogin();
        await this.userRepository.update(user);
        // Generar tokens
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=login-user.use-case.js.map