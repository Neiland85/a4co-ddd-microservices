export interface AuthState {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}
export declare function loginAction(prevState: AuthState | null, formData: FormData): Promise<AuthState>;
export declare function registerAction(prevState: AuthState | null, formData: FormData): Promise<AuthState>;
//# sourceMappingURL=actions.d.ts.map