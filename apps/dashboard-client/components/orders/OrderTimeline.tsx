'use client';

import { CheckCircle, Circle, XCircle } from 'lucide-react';
import type { OrderEvent } from '@dashboard/lib/types';

interface OrderTimelineProps {
  events: OrderEvent[];
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No hay eventos registrados
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <TimelineEvent
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
    </div>
  );
}

function TimelineEvent({ event, isLast }: { event: OrderEvent; isLast: boolean }) {
  const getEventIcon = (type: string) => {
    if (type.includes('created') || type.includes('confirmed') || type.includes('success')) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (type.includes('failed') || type.includes('error') || type.includes('cancelled')) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Circle className="h-5 w-5 text-blue-500" />;
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      'order.created': 'Orden creada',
      'order.confirmed': 'Orden confirmada',
      'payment.processed': 'Pago procesado',
      'inventory.updated': 'Inventario actualizado',
      'order.cancelled': 'Orden cancelada',
      'order.failed': 'Orden fallida',
    };
    return labels[type] || type.replace('.', ' ').replace('_', ' ');
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {getEventIcon(event.type)}
        {!isLast && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2" />}
      </div>

      <div className="flex-1 pb-8">
        <p className="font-medium text-slate-900 dark:text-white">
          {getEventLabel(event.type)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {new Date(event.timestamp).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {event.data && (
          <pre className="mt-2 text-xs text-slate-500 dark:text-slate-500 overflow-x-auto">
            {JSON.stringify(event.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
