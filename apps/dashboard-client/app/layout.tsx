import '@/app/globals.css';
import { Header, Sidebar } from '@/components/layout';
import { PageTransition } from '@/components/PageTransition';
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
  title: 'Dashboard Artesanos A4CO',
  description:
    'Panel de gestión para artesanos: productos, pedidos y perfil en el ecosistema A4CO.',
  icons: {
    icon: '/logo.webp', // ✅ Logo oficial
  },
};

// 🌍 Layout principal
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          'bg-background text-foreground flex min-h-screen antialiased',
        )}
      >
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto">
          <Header />
          <PageTransition>
            <div className="p-8">{children}</div>
          </PageTransition>
        </main>
      </body>
    </html>
  );
}
