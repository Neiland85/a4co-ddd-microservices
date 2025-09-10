import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
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
  title: 'A4CO Dashboard - Microservices',
  description: 'Dashboard para gestión de microservicios DDD',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
