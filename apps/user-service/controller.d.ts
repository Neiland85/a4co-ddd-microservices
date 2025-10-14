import { BaseController } from '../../packages/shared-utils/src/base';
import { UserService } from './service';
interface CreateUserRequest {
    username: string;
    email: string;
}
interface GetUserRequest {
    username: string;
}
export declare class UserController extends BaseController<UserService> {
    constructor();
    createUser(req: CreateUserRequest): string;
    getUser(req: GetUserRequest): string;
}
export {};
//# sourceMappingURL=controller.d.ts.map