import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A4CO Dashboard',
  description: 'Dashboard for Andalusian small commerce platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
