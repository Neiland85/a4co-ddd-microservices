export type Permission = 'users:read' | 'users:write' | 'users:delete' | 'security:read' | 'security:write' | 'content:read' | 'content:write' | 'content:moderate' | 'system:read' | 'system:write' | 'system:admin' | 'reports:read' | 'reports:write';
export type Role = 'admin' | 'moderator' | 'user';
export declare class RBACService {
    hasPermission(role: Role, permission: Permission): boolean;
    hasAnyPermission(role: Role, permissions: Permission[]): boolean;
    hasAllPermissions(role: Role, permissions: Permission[]): boolean;
    getRolePermissions(role: Role): Permission[];
    requirePermission(permission: Permission): (userRole: Role) => boolean;
}
export declare const rbacService: RBACService;
//# sourceMappingURL=rbac.d.ts.map