"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { FileText, TrendingUp, BarChart3, Settings, HelpCircle, Home, Receipt } from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Facturas", href: "/invoices", icon: Receipt },
  { name: "Subvenciones", href: "/subsidies", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Configuración", href: "/settings", icon: Settings },
  { name: "Soporte", href: "/support", icon: HelpCircle },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            TributariApp
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}