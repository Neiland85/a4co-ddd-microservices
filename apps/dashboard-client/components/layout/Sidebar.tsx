'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, Factory, FileBarChart2, Leaf, Settings } from 'lucide-react';
import { Home, Settings, Users, Package, ShoppingCart, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@dashboard/lib/auth-context';
import { Button } from '../ui/button';

export function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
          <h1 className="text-lg font-semibold tracking-wide select-none">A4CO Admin</h1>
        </div>

        {/* 🔹 Navegación principal */}
        <nav className="mt-4 flex flex-col space-y-1 px-3">
          <SidebarLink href="/dashboard" icon={Home} label="Dashboard" />
          <SidebarLink href="/dashboard/users" icon={Users} label="Usuarios" />
          <SidebarLink href="/dashboard/products" icon={Package} label="Productos" />
          <SidebarLink href="/dashboard/orders" icon={ShoppingCart} label="Pedidos" />
          <SidebarLink href="/dashboard/settings" icon={Settings} label="Configuración" />
        </nav>
      </div>

      {/* 🔹 Footer con logout */}
      <div>
        <nav className="px-3 pb-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </Button>
        </nav>
        <footer className="border-t border-slate-800 p-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} A4CO DevOps
        </footer>
      </div>
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
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-2 rounded-md p-2 transition-colors',
        isActive
          ? 'bg-slate-800 text-white font-medium'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white',
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
