'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoadingButton } from '../common/LoadingSpinner';
import { useAuth } from '@dashboard/lib/auth-context';
import { useToast } from '@dashboard/lib/context/ToastContext';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials.email, credentials.password);
      showToast('¡Bienvenido! Inicio de sesión exitoso', 'success');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      showToast(
        error instanceof Error ? error.message : 'Error al iniciar sesión. Por favor verifica tus credenciales.',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          placeholder="tu@email.com"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Contraseña
        </label>
        <Input
          id="password"
          type="password"
          required
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <LoadingButton>Iniciando sesión...</LoadingButton> : 'Iniciar Sesión'}
      </Button>
    </form>
  );
}
