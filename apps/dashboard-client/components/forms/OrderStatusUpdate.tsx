'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: number;
  cliente: string;
  producto: string;
  estado: string;
  fecha: string;
}

interface OrderStatusUpdateProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (orderId: number, newStatus: string) => void;
}

const statusOptions = [
  { value: 'Pendiente', label: 'Pendiente', color: 'secondary' },
  { value: 'En Proceso', label: 'En Proceso', color: 'default' },
  { value: 'Enviado', label: 'Enviado', color: 'outline' },
  { value: 'Completado', label: 'Completado', color: 'default' },
  { value: 'Cancelado', label: 'Cancelado', color: 'destructive' },
];

export function OrderStatusUpdate({ order, isOpen, onClose, onUpdate }: OrderStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.estado);

  const handleUpdate = () => {
    onUpdate(order.id, selectedStatus);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Actualizar Estado del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>
              <strong>Pedido:</strong> #{order.id}
            </p>
            <p>
              <strong>Cliente:</strong> {order.cliente}
            </p>
            <p>
              <strong>Producto:</strong> {order.producto}
            </p>
            <p>
              <strong>Fecha:</strong> {order.fecha}
            </p>
            <div className="flex items-center gap-2">
              <strong>Estado actual:</strong>
              <Badge variant={order.estado === 'Pendiente' ? 'secondary' : 'default'}>
                {order.estado}
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nuevo Estado</label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Badge variant={status.color as any}>{status.label}</Badge>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              className="flex-1"
              disabled={selectedStatus === order.estado}
            >
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
