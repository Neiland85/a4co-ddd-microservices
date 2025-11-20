import '@/app/globals.css';
import { Header, Sidebar } from '@/components/layout';
import { AuthProvider } from '@dashboard/lib/auth-context';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

// 🧠 Carga de fuentes corporativas
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

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
  // Skip AuthProvider during static generation/prerendering
  const isPrerendering = typeof window === 'undefined';

  if (isPrerendering) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body
          className={clsx(
            geistSans.variable,
            geistMono.variable,
            'bg-background text-foreground flex min-h-screen antialiased',
          )}
        >
          <main className="flex flex-1 flex-col overflow-y-auto">
            <div className="p-8">{children}</div>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          'bg-background text-foreground flex min-h-screen antialiased',
        )}
      >
        <AuthProvider>
          <Sidebar />
          <main className="flex flex-1 flex-col overflow-y-auto">
            <Header />
            <div className="p-8">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
