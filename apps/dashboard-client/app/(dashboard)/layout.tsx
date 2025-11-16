/**
 * Dashboard Layout
 * Wraps all dashboard pages with navigation
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - A4CO',
  description: 'Tu panel personal en A4CO',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                A4CO
              </h1>
              <div className="hidden md:flex items-center gap-4">
                <span className="text-zinc-400 text-sm">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
                <span className="text-2xl">🔔</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
                <span className="text-2xl">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
