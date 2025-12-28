'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@dashboard/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.webp"
                alt="A4CO Logo"
                width={48}
                height={48}
                className="rounded-lg"
                priority
              />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                A4CO Dashboard
              </h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Inicia sesión
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Accede a tu panel de administración
            </p>
          </div>

          <LoginForm />

          <div className="mt-6">
            <p className="text-center text-xs text-slate-500">
              © {new Date().getFullYear()} A4CO. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image/Branding */}
      <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-12">
            <h2 className="text-4xl font-bold mb-4">
              Gestiona tu negocio
            </h2>
            <p className="text-xl opacity-90">
              Panel de control para comercio colaborativo andaluz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
