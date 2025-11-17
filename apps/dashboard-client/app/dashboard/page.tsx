import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Panel de control administrativo A4CO
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Usuarios Totales"
          value="0"
          icon={Users}
          trend="+0% desde el último mes"
        />
        <StatsCard title="Productos" value="0" icon={Package} trend="+0% desde el último mes" />
        <StatsCard title="Pedidos" value="0" icon={ShoppingCart} trend="+0% desde el último mes" />
        <StatsCard title="Ventas" value="€0" icon={TrendingUp} trend="+0% desde el último mes" />
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Actividad Reciente</h2>
        <div className="text-slate-500 dark:text-slate-400">
          No hay actividad reciente para mostrar.
        </div>
      </Card>
    </div>
  );
}

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-md border bg-white/50 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: ElementType;
  trend: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trend}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
        </div>
      </div>
    </Card>
  );
}
