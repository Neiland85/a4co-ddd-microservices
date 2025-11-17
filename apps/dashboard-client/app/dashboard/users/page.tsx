'use client';

import { useState, type ChangeEvent, type ReactNode } from 'react';
// Fallback local Card component when shared UI module is unavailable.
// Replace with the shared Card component import when '@dashboard/components/ui/card' exists.
const Card = ({ className = '', children }: { className?: string; children?: ReactNode }) => {
  return <div className={`rounded-md bg-white dark:bg-slate-800 shadow-sm ${className}`}>{children}</div>;
};
import { Button } from '@dashboard/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@dashboard/components/ui/table';
import { Plus, Search, MoreVertical } from 'lucide-react';
// Using native <input> element instead of missing @dashboard/components/ui/input

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - esto se reemplazará con datos reales del API
  const users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@a4co.com',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Gestiona los usuarios de la plataforma
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="pl-10 bg-transparent border-none focus:outline-none w-full"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            aria-label="Buscar usuarios"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                  No hay usuarios para mostrar
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
