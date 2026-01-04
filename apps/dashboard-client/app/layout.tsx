import '@/app/globals.css';
import { Header, Sidebar } from '@/components/layout';
import { AuthProvider } from '@dashboard/lib/auth-context';
import { ToastProvider } from '@dashboard/lib/context/ToastContext';
import { ToastContainer } from '@/components/common/Toast';
import clsx from 'clsx';
import type { Metadata } from 'next';

// 🧾 Metadatos para SEO / PWA
export const metadata: Metadata = {
  title: 'A4CO Dashboard PYME',
  description:
    'Panel de gestión de emisiones, clientes y trazabilidad para pymes integradas en el ecosistema A4CO.',
  icons: {
    icon: '/logo.webp', // ✅ Logo oficial
  },
};

// 🌍 Layout principal
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={clsx('font-sans bg-background text-foreground flex min-h-screen antialiased')}>
        <ToastProvider>
          <AuthProvider>
            <Sidebar />
            <main className="flex flex-1 flex-col overflow-y-auto">
              <Header />
              <div className="p-8">{children}</div>
            </main>
          </AuthProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
