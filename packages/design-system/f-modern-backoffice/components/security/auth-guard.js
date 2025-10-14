'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = AuthGuard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const alert_1 = require("@/components/ui/alert");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const auth_1 = require("@/lib/security/auth");
const rbac_1 = require("@/lib/security/rbac");
// Generar ID único simple
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
function AuthGuard({ children, requiredPermissions = [], fallback }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [showLogin, setShowLogin] = (0, react_1.useState)(false);
    const [loginForm, setLoginForm] = (0, react_1.useState)({
        email: '',
        password: '',
        twoFactorCode: '',
    });
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [loginError, setLoginError] = (0, react_1.useState)('');
    const [loginAttempts, setLoginAttempts] = (0, react_1.useState)(0);
    const [isLocked, setIsLocked] = (0, react_1.useState)(false);
    const [lockTimeRemaining, setLockTimeRemaining] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        checkAuth();
    }, []);
    (0, react_1.useEffect)(() => {
        if (isLocked && lockTimeRemaining > 0) {
            const timer = setInterval(() => {
                setLockTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        setLoginAttempts(0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLocked, lockTimeRemaining]);
    const checkAuth = async () => {
        try {
            // Simular verificación de autenticación
            const token = localStorage.getItem('auth_token');
            if (token) {
                const payload = auth_1.authService.verifyToken(token);
                if (payload) {
                    // Simular obtención de datos del usuario
                    const userData = {
                        id: payload.userId,
                        email: payload.email,
                        name: 'Usuario Demo',
                        role: payload.role,
                        isActive: true,
                        failedLoginAttempts: 0,
                        twoFactorEnabled: false,
                    };
                    setUser(userData);
                }
                else {
                    setShowLogin(true);
                }
            }
            else {
                setShowLogin(true);
            }
        }
        catch (error) {
            setShowLogin(true);
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        if (isLocked) {
            setLoginError(`Cuenta bloqueada. Intenta en ${Math.ceil(lockTimeRemaining / 60)} minutos.`);
            return;
        }
        try {
            setLoginError('');
            // Simular validación de credenciales
            if (loginForm.email === 'admin@demo.com' && loginForm.password === 'Admin123!') {
                const token = auth_1.authService.generateToken({
                    userId: '1',
                    email: loginForm.email,
                    role: 'admin',
                    sessionId: generateId(),
                });
                localStorage.setItem('auth_token', token);
                const userData = {
                    id: '1',
                    email: loginForm.email,
                    name: 'Administrador Demo',
                    role: 'admin',
                    isActive: true,
                    failedLoginAttempts: 0,
                    twoFactorEnabled: false,
                };
                setUser(userData);
                setShowLogin(false);
                setLoginAttempts(0);
            }
            else {
                throw new Error('Credenciales inválidas');
            }
        }
        catch (error) {
            setLoginAttempts(prev => prev + 1);
            setLoginError('Credenciales inválidas');
            if (loginAttempts >= 4) {
                // 5 intentos total
                setIsLocked(true);
                setLockTimeRemaining(30 * 60); // 30 minutos
                setLoginError('Demasiados intentos fallidos. Cuenta bloqueada por 30 minutos.');
            }
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        setShowLogin(true);
    };
    const hasRequiredPermissions = (user) => {
        if (requiredPermissions.length === 0)
            return true;
        return rbac_1.rbacService.hasAllPermissions(user.role, requiredPermissions);
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mx-auto mb-4 h-12 w-12 animate-spin" }), (0, jsx_runtime_1.jsx)("p", { children: "Verificando autenticaci\u00F3n..." })] }) }));
    }
    if (showLogin || !user) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full max-w-md", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "text-primary h-6 w-6" }) }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Acceso Seguro" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Ingresa tus credenciales para acceder al backoffice" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleLogin, className: "space-y-4", children: [loginError && ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { variant: "destructive", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: loginError })] })), isLocked && ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { variant: "destructive", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { children: ["Cuenta bloqueada por seguridad. Tiempo restante:", ' ', Math.ceil(lockTimeRemaining / 60), " minutos"] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "email", children: "Email" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", type: "email", value: loginForm.email, onChange: e => setLoginForm(prev => ({ ...prev, email: e.target.value })), placeholder: "admin@demo.com", disabled: isLocked, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "password", children: "Contrase\u00F1a" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { id: "password", type: showPassword ? 'text' : 'password', value: loginForm.password, onChange: e => setLoginForm(prev => ({ ...prev, password: e.target.value })), placeholder: "Admin123!", disabled: isLocked, required: true }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "ghost", size: "sm", className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent", onClick: () => setShowPassword(!showPassword), disabled: isLocked, children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "w-full", disabled: isLocked, children: isLocked ? 'Cuenta Bloqueada' : 'Iniciar Sesión' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground text-center text-sm", children: ["Intentos restantes: ", Math.max(0, 5 - loginAttempts)] })] }), (0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "mt-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Demo:" }), " admin@demo.com / Admin123!"] })] })] })] }) }));
    }
    if (!hasRequiredPermissions(user)) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen items-center justify-center", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full max-w-md", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "mx-auto mb-4 h-12 w-12 text-red-500" }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Acceso Denegado" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "No tienes permisos suficientes para acceder a esta secci\u00F3n" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: ["Rol actual: ", user.role] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { className: "text-muted-foreground text-sm", children: ["Permisos requeridos: ", requiredPermissions.join(', ')] }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleLogout, variant: "outline", children: "Cerrar Sesi\u00F3n" }), fallback] })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed right-4 top-4 z-50", children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: "p-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: user.role }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: user.name }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: handleLogout, children: "Salir" })] }) }) }), children] }));
}
//# sourceMappingURL=auth-guard.js.map