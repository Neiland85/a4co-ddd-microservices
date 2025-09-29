import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '../components/theme-provider';
import { Navbar } from '../components/navbar';
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
  title: 'TributariApp - Gestión Tributaria Inteligente',
  description: 'Automatización inteligente de procesos tributarios y subvenciones',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
          <footer className="border-t bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>© 2025 TributariApp · Todos los derechos reservados</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
                  <a href="#" className="hover:text-gray-900 transition-colors">Términos</a>
                  <a href="#" className="hover:text-gray-900 transition-colors">Soporte</a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
