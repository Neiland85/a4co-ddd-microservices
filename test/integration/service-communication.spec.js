"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const axios_1 = require("@nestjs/axios");
const auth_service_1 = require("../../../apps/auth-service/src/auth.service");
const user_service_1 = require("../../../apps/user-service/src/user.service");
describe('Service Communication Integration', () => {
    let authService;
    let userService;
    let httpService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                user_service_1.UserService,
                {
                    provide: axios_1.HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                    },
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        userService = module.get(user_service_1.UserService);
        httpService = module.get(axios_1.HttpService);
    });
    it('should communicate between auth and user services', async () => {
        jest.spyOn(httpService, 'get').mockResolvedValue({
            data: { id: 1, email: 'user@test.com' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        });
        const user = await userService.findById('1');
        expect(user).toBeDefined();
        expect(user.email).toBe('user@test.com');
    });
});
//# sourceMappingURL=service-communication.spec.js.map