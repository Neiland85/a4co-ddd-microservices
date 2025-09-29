import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '../components/navbar';
import { ThemeProvider } from '../components/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin' as const],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin' as const],
});

export const metadata: Metadata = {
  title: 'A4CO - Plataforma de Comercio Andaluz',
  description: 'Conecta, colabora y crece con el pequeño comercio de Andalucía',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 antialiased`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            <div className="container mx-auto px-4 py-8">{children}</div>
          </main>
          <footer className="border-t bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>© 2025 A4CO · Plataforma de Comercio Andaluz</p>
                <div className="flex gap-4">
                  <a href="#" className="transition-colors hover:text-gray-900">
                    Privacidad
                  </a>
                  <a href="#" className="transition-colors hover:text-gray-900">
                    Términos
                  </a>
                  <a href="#" className="transition-colors hover:text-gray-900">
                    Soporte
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
