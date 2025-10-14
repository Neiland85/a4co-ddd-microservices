import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard Moderno - A4CO',
  description: 'Dashboard funcional para gestión de usuarios y análisis',
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100">
          {/* Texturas de fondo */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="bg-gradient-radial absolute left-0 top-0 h-96 w-96 rounded-full from-yellow-600/30 via-orange-500/20 to-transparent blur-3xl"></div>
            <div className="bg-gradient-radial absolute right-0 top-1/3 h-80 w-80 rounded-full from-fuchsia-500/20 via-pink-400/10 to-transparent blur-3xl"></div>
            <div className="bg-gradient-radial absolute bottom-0 left-1/3 h-72 w-72 rounded-full from-amber-600/25 via-yellow-500/15 to-transparent blur-3xl"></div>
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
