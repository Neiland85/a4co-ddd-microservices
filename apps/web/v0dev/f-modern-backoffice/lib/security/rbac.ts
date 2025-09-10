// Sistema de Control de Acceso Basado en Roles (RBAC)

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'security:read'
  | 'security:write'
  | 'content:read'
  | 'content:write'
  | 'content:moderate'
  | 'system:read'
  | 'system:write'
  | 'system:admin'
  | 'reports:read'
  | 'reports:write';

export type Role = 'admin' | 'moderator' | 'user';

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'users:read',
    'users:write',
    'users:delete',
    'security:read',
    'security:write',
    'content:read',
    'content:write',
    'content:moderate',
    'system:read',
    'system:write',
    'system:admin',
    'reports:read',
    'reports:write',
  ],
  moderator: [
    'users:read',
    'security:read',
    'content:read',
    'content:write',
    'content:moderate',
    'system:read',
    'reports:read',
  ],
  user: ['content:read', 'system:read'],
};

export class RBACService {
  // Verificar si un rol tiene un permiso específico
  hasPermission(role: Role, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) || false;
  }

  // Verificar múltiples permisos
  hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  // Verificar todos los permisos
  hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(role, permission));
  }

  // Obtener todos los permisos de un rol
  getRolePermissions(role: Role): Permission[] {
    return rolePermissions[role] || [];
  }

  // Middleware para verificar permisos
  requirePermission(permission: Permission) {
    return (userRole: Role) => {
      if (!this.hasPermission(userRole, permission)) {
        throw new Error(`Acceso denegado. Se requiere el permiso: ${permission}`);
      }
      return true;
    };
  }
}

export const rbacService = new RBACService();
