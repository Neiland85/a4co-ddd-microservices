'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-3 backdrop-blur-md dark:bg-slate-900/70">
      {/* 🧩 Logo + nombre */}
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
          <Image
            src="/logo.webp"
            alt="A4CO Logo"
            fill
            sizes="(max-width: 640px) 36px, (max-width: 768px) 48px, 64px"
            className="rounded-xl object-contain select-none"
            priority
          />
        </div>
        <h1 className="text-brand-dark dark:text-brand-light text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
          A4CO Dashboard PYME
        </h1>
      </div>

      {/* 👤 Perfil usuario */}
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <User className="h-5 w-5 opacity-80" />
        <span className="max-w-[120px] truncate text-sm font-medium sm:max-w-none">
          Neil (A4CO)
        </span>
      </div>
    </header>
  );
}
