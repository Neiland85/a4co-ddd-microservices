'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { authService, type User } from '@/lib/security/auth';
import { rbacService, type Permission } from '@/lib/security/rbac';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  fallback?: React.ReactNode;
}

interface LoginForm {
  email: string;
  password: string;
  twoFactorCode: string;
}

// Generar ID único simple
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function AuthGuard({ children, requiredPermissions = [], fallback }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    twoFactorCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
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
        const payload = authService.verifyToken(token);
        if (payload) {
          // Simular obtención de datos del usuario
          const userData: User = {
            id: payload.userId,
            email: payload.email,
            name: 'Usuario Demo',
            role: payload.role as any,
            isActive: true,
            failedLoginAttempts: 0,
            twoFactorEnabled: false,
          };
          setUser(userData);
        } else {
          setShowLogin(true);
        }
      } else {
        setShowLogin(true);
      }
    } catch (error) {
      setShowLogin(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setLoginError(`Cuenta bloqueada. Intenta en ${Math.ceil(lockTimeRemaining / 60)} minutos.`);
      return;
    }

    try {
      setLoginError('');

      // Simular validación de credenciales
      if (loginForm.email === 'admin@demo.com' && loginForm.password === 'Admin123!') {
        const token = authService.generateToken({
          userId: '1',
          email: loginForm.email,
          role: 'admin',
          sessionId: generateId(),
        });

        localStorage.setItem('auth_token', token);

        const userData: User = {
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
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
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

  const hasRequiredPermissions = (user: User): boolean => {
    if (requiredPermissions.length === 0) return true;
    return rbacService.hasAllPermissions(user.role, requiredPermissions);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 animate-spin" />
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (showLogin || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <CardTitle>Acceso Seguro</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al backoffice</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              {isLocked && (
                <Alert variant="destructive">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Cuenta bloqueada por seguridad. Tiempo restante:{' '}
                    {Math.ceil(lockTimeRemaining / 60)} minutos
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@demo.com"
                  disabled={isLocked}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Admin123!"
                    disabled={isLocked}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLocked}>
                {isLocked ? 'Cuenta Bloqueada' : 'Iniciar Sesión'}
              </Button>

              <div className="text-muted-foreground text-center text-sm">
                Intentos restantes: {Math.max(0, 5 - loginAttempts)}
              </div>
            </form>

            {/* Credenciales de demo */}
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo:</strong> admin@demo.com / Admin123!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasRequiredPermissions(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos suficientes para acceder a esta sección
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div>
              <Badge variant="outline">Rol actual: {user.role}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Permisos requeridos: {requiredPermissions.join(', ')}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Cerrar Sesión
            </Button>
            {fallback}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de usuario autenticado */}
      <div className="fixed right-4 top-4 z-50">
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{user.role}</Badge>
            <span className="text-sm">{user.name}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </Card>
      </div>
      {children}
    </div>
  );
}
