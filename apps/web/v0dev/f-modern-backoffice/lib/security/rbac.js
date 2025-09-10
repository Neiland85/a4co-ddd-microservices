"use strict";
// Sistema de Control de Acceso Basado en Roles (RBAC)
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacService = exports.RBACService = void 0;
const rolePermissions = {
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
class RBACService {
    // Verificar si un rol tiene un permiso específico
    hasPermission(role, permission) {
        return rolePermissions[role]?.includes(permission) || false;
    }
    // Verificar múltiples permisos
    hasAnyPermission(role, permissions) {
        return permissions.some(permission => this.hasPermission(role, permission));
    }
    // Verificar todos los permisos
    hasAllPermissions(role, permissions) {
        return permissions.every(permission => this.hasPermission(role, permission));
    }
    // Obtener todos los permisos de un rol
    getRolePermissions(role) {
        return rolePermissions[role] || [];
    }
    // Middleware para verificar permisos
    requirePermission(permission) {
        return (userRole) => {
            if (!this.hasPermission(userRole, permission)) {
                throw new Error(`Acceso denegado. Se requiere el permiso: ${permission}`);
            }
            return true;
        };
    }
}
exports.RBACService = RBACService;
exports.rbacService = new RBACService();
//# sourceMappingURL=rbac.js.map