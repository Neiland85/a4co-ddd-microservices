import { BaseDto } from '@a4co/shared-utils';
export declare class RegisterUserDto extends BaseDto {
    email: string;
    name: string;
    password: string;
}
export declare class LoginUserDto extends BaseDto {
    email: string;
    password: string;
}
export declare class ChangePasswordDto extends BaseDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UserResponseDto extends BaseDto {
    id: string;
    email: string;
    name: string;
    status: string;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.dto.d.ts.map