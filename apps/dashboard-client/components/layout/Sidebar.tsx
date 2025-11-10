'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Factory, FileBarChart2, Leaf, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-100">
      {/* 🔹 Logo + título */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 p-6">
          <Image
            src="/logo.webp"
            width={40}
            height={40}
            alt="A4CO Logo"
            className="rounded-md object-contain"
            priority
          />
          <h1 className="text-lg font-semibold tracking-wide select-none">A4CO PYME</h1>
        </div>

        {/* 🔹 Navegación principal */}
        <nav className="mt-4 flex flex-col space-y-1 px-3">
          <SidebarLink href="/dashboard" icon={Home} label="Inicio" />
          <SidebarLink href="/clients" icon={Factory} label="Clientes" />
          <SidebarLink href="/emissions" icon={Leaf} label="Emisiones" />
          <SidebarLink href="/reports" icon={FileBarChart2} label="Informes" />
          <SidebarLink href="/settings" icon={Settings} label="Configuración" />
        </nav>
      </div>

      {/* 🔹 Footer */}
      <footer className="border-t border-slate-800 p-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} A4CO DevOps
      </footer>
    </aside>
  );
}

// 🧩 Componente reutilizable
function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
