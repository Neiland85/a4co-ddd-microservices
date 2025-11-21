'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { OrderStatusUpdate } from '@/components/forms/OrderStatusUpdate';

interface Order {
  id: number;
  cliente: string;
  producto: string;
  estado: string;
  fecha: string;
}

export default function PedidosPage() {
  // Estado para modal
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

  // Datos mock para pedidos
  const [pedidos, setPedidos] = useState<Order[]>([
    {
      id: 1,
      cliente: 'Juan Pérez',
      producto: 'Jarrón de Cerámica',
      estado: 'Pendiente',
      fecha: '2025-11-21',
    },
    {
      id: 2,
      cliente: 'Ana López',
      producto: 'Bolso Tejido',
      estado: 'Completado',
      fecha: '2025-11-20',
    },
  ]);

  // Handler para actualizar estado
  const handleUpdateOrder = (orderId: number, newStatus: string) => {
    setPedidos((prev) =>
      prev.map((pedido) => (pedido.id === orderId ? { ...pedido, estado: newStatus } : pedido)),
    );
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusUpdate(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell>{pedido.cliente}</TableCell>
              <TableCell>{pedido.producto}</TableCell>
              <TableCell>
                <Badge variant={pedido.estado === 'Pendiente' ? 'secondary' : 'default'}>
                  {pedido.estado}
                </Badge>
              </TableCell>
              <TableCell>{pedido.fecha}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleStatusUpdate(pedido)}>
                  Actualizar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para actualizar estado */}
      {selectedOrder && (
        <OrderStatusUpdate
          order={selectedOrder}
          isOpen={showStatusUpdate}
          onClose={() => setShowStatusUpdate(false)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
}
