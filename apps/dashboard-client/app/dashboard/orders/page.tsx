'use client';

import React from 'react';

function Card({
  children,
  className = '',
  ...props
}: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-md shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Gestiona los pedidos de la plataforma
        </p>
      </div>

      <Card className="p-6">
        <div className="text-center text-slate-500 dark:text-slate-400 py-12">
          <p className="text-lg font-medium mb-2">No hay pedidos registrados</p>
          <p className="text-sm">Los pedidos aparecerán aquí cuando se realicen</p>
        </div>
      </Card>
    </div>
  );
}
