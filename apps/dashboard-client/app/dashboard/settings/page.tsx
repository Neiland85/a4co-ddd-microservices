import type { ReactNode } from 'react';

function Card({ className = '', children }: { className?: string; children?: ReactNode }) {
  return <div className={`bg-white dark:bg-slate-900 rounded-md shadow-sm ${className}`}>{children}</div>;
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Ajustes y configuración de la plataforma
        </p>
      </div>

      <Card className="p-6">
        <div className="text-slate-500 dark:text-slate-400">
          <p className="text-lg font-medium mb-4">Configuración General</p>
          <p className="text-sm">Las opciones de configuración estarán disponibles próximamente</p>
        </div>
      </Card>
    </div>
  );
}
