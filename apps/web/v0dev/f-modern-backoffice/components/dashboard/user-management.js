'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagement = UserManagement;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const avatar_1 = require("@/components/ui/avatar");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
function UserManagement() {
    const [users] = (0, react_1.useState)([
        {
            id: '1',
            name: 'Ana García',
            email: 'ana@example.com',
            role: 'admin',
            status: 'active',
            lastActive: new Date(Date.now() - 300000),
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            id: '2',
            name: 'Carlos López',
            email: 'carlos@example.com',
            role: 'moderator',
            status: 'active',
            lastActive: new Date(Date.now() - 600000),
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            id: '3',
            name: 'María Rodríguez',
            email: 'maria@example.com',
            role: 'user',
            status: 'inactive',
            lastActive: new Date(Date.now() - 86400000),
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            id: '4',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'user',
            status: 'banned',
            lastActive: new Date(Date.now() - 172800000),
            avatar: '/placeholder.svg?height=32&width=32',
        },
    ]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [roleFilter, setRoleFilter] = (0, react_1.useState)('all');
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });
    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "h-3 w-3" });
            case 'moderator':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-3 w-3" });
            case 'user':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-3 w-3" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-3 w-3" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'inactive':
                return 'secondary';
            case 'banned':
                return 'destructive';
            default:
                return 'outline';
        }
    };
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-500';
            case 'moderator':
                return 'bg-blue-500';
            case 'user':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "col-span-1", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Gesti\u00F3n de Usuarios" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Control de permisos y roles de usuario" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-muted-foreground absolute left-2 top-2.5 h-4 w-4" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar usuarios...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-8" })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: roleFilter, onValueChange: setRoleFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-32", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "admin", children: "Admin" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "moderator", children: "Moderador" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "user", children: "Usuario" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-64 space-y-3 overflow-y-auto", children: filteredUsers.map(user => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-8 w-8", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: user.avatar || '/placeholder.svg' }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { children: user.name
                                                        .split(' ')
                                                        .map(n => n[0])
                                                        .join('') })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: user.name }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: `text-xs ${getRoleColor(user.role)}`, children: [getRoleIcon(user.role), (0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: user.role })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: user.email }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground text-xs", children: ["\u00DAltimo acceso: ", user.lastActive.toLocaleString('es-ES')] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: getStatusColor(user.status), className: "text-xs", children: [user.status === 'active' && (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "mr-1 h-3 w-3" }), user.status === 'banned' && (0, jsx_runtime_1.jsx)(lucide_react_1.UserX, { className: "mr-1 h-3 w-3" }), user.status] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", className: "bg-transparent text-xs", children: "Editar" })] })] }, user.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-green-500", children: users.filter(u => u.status === 'active').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: "Activos" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-yellow-500", children: users.filter(u => u.status === 'inactive').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: "Inactivos" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-red-500", children: users.filter(u => u.status === 'banned').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: "Bloqueados" })] })] })] })] }));
}
//# sourceMappingURL=user-management.js.map