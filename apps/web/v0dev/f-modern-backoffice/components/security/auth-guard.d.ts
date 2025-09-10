import type React from 'react';
import { type Permission } from '@/lib/security/rbac';
interface AuthGuardProps {
    children: React.ReactNode;
    requiredPermissions?: Permission[];
    fallback?: React.ReactNode;
}
export declare function AuthGuard({ children, requiredPermissions, fallback }: AuthGuardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=auth-guard.d.ts.map