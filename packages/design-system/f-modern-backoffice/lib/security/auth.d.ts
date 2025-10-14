import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    twoFactorCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    twoFactorCode?: string | undefined;
}, {
    email: string;
    password: string;
    twoFactorCode?: string | undefined;
}>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["admin", "moderator", "user"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user" | "moderator";
}, {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user" | "moderator" | undefined;
}>;
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'moderator' | 'user';
    isActive: boolean;
    lastLogin?: Date;
    failedLoginAttempts: number;
    lockedUntil?: Date;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    sessionId: string;
    exp: number;
}
declare class AuthService {
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    private readonly MAX_LOGIN_ATTEMPTS;
    private readonly LOCK_TIME;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    generateToken(payload: Omit<JWTPayload, 'exp'>): string;
    verifyToken(token: string): JWTPayload | null;
    isAccountLocked(user: User): boolean;
    incrementFailedAttempts(userId: string): Promise<void>;
    resetFailedAttempts(userId: string): Promise<void>;
    generate2FASecret(): string;
    verify2FACode(secret: string, code: string): boolean;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.d.ts.map