/**
 * Admin - Artisans List & Moderation
 */
'use client';

import { useState, useEffect } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { adminApi } from '@/lib/api/client';
import {
  Search,
  CheckCircle,
  XCircle,
  Star,
  StarOff,
  Eye,
  MapPin,
} from 'lucide-react';
import { debounce } from '@/lib/utils';

interface Artisan {
  id: string;
  name: string;
  specialty: string;
  province: string;
  status: 'pending' | 'approved' | 'blocked';
  isFeatured: boolean;
  profileViews: number;
  productsCount: number;
  joinedAt: string;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'blocked';

export default function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArtisans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedProvince, statusFilter]);

  const loadArtisans = async () => {
    try {
      setIsLoading(true);
      const filters: Record<string, string> = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedProvince) filters.province = selectedProvince;
      if (statusFilter !== 'all') filters.status = statusFilter;

      const data = await adminApi.listArtisans(filters);
      setArtisans(data);
    } catch (error) {
      console.error('Error loading artisans:', error);
      // Mock data for demo
      setArtisans([
        {
          id: '1',
          name: 'María González',
          specialty: 'Cerámica',
          province: 'Sevilla',
          status: 'approved',
          isFeatured: true,
          profileViews: 1234,
          productsCount: 15,
          joinedAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'Juan Martínez',
          specialty: 'Orfebrería',
          province: 'Granada',
          status: 'pending',
          isFeatured: false,
          profileViews: 45,
          productsCount: 3,
          joinedAt: '2024-11-01',
        },
        {
          id: '3',
          name: 'Ana López',
          specialty: 'Textil',
          province: 'Córdoba',
          status: 'approved',
          isFeatured: false,
          profileViews: 567,
          productsCount: 8,
          joinedAt: '2024-03-20',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (artisanId: string) => {
    try {
      await adminApi.approveArtisan(artisanId);
      setArtisans((prev) =>
        prev.map((a) => (a.id === artisanId ? { ...a, status: 'approved' as const } : a))
      );
    } catch (error) {
      console.error('Error approving artisan:', error);
      alert('Error al aprobar artesano');
    }
  };

  const handleBlock = async (artisanId: string) => {
    const reason = prompt('Motivo del bloqueo:');
    if (!reason) return;

    try {
      await adminApi.blockArtisan(artisanId, reason);
      setArtisans((prev) =>
        prev.map((a) => (a.id === artisanId ? { ...a, status: 'blocked' as const } : a))
      );
    } catch (error) {
      console.error('Error blocking artisan:', error);
      alert('Error al bloquear artesano');
    }
  };

  const handleToggleFeatured = async (artisanId: string, featured: boolean) => {
    try {
      await adminApi.featureArtisan(artisanId, !featured);
      setArtisans((prev) =>
        prev.map((a) => (a.id === artisanId ? { ...a, isFeatured: !featured } : a))
      );
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Error al cambiar destacado');
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  const getStatusBadge = (status: Artisan['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
    };

    const labels = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      blocked: 'Bloqueado',
    };

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
          <p className="text-gray-600">Cargando artesanos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Artesanos</h1>
        <p className="mt-1 text-gray-600">Moderar y aprobar perfiles de artesanos</p>
      </div>

      {/* Filters */}
      <AnimatedCard>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                placeholder="Nombre o especialidad..."
              />
            </div>
          </div>

          {/* Province Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Provincia
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="">Todas las provincias</option>
              <option value="Almería">Almería</option>
              <option value="Cádiz">Cádiz</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Granada">Granada</option>
              <option value="Huelva">Huelva</option>
              <option value="Jaén">Jaén</option>
              <option value="Málaga">Málaga</option>
              <option value="Sevilla">Sevilla</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>
      </AnimatedCard>

      {/* Artisans List */}
      <div className="space-y-4">
        {artisans.length === 0 ? (
          <AnimatedCard>
            <div className="py-12 text-center">
              <p className="text-gray-500">No se encontraron artesanos</p>
            </div>
          </AnimatedCard>
        ) : (
          artisans.map((artisan) => (
            <AnimatedCard key={artisan.id} className="hover:shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {artisan.name}
                    </h3>
                    {getStatusBadge(artisan.status)}
                    {artisan.isFeatured && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                        <Star className="h-3 w-3 fill-purple-800" />
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium text-purple-600">
                      {artisan.specialty}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {artisan.province}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {artisan.profileViews} visitas
                    </span>
                    <span>{artisan.productsCount} productos</span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Registrado: {new Date(artisan.joinedAt).toLocaleDateString('es-ES')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {artisan.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(artisan.id)}
                      className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprobar
                    </button>
                  )}

                  {artisan.status !== 'blocked' && (
                    <button
                      onClick={() => handleBlock(artisan.id)}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      <XCircle className="h-4 w-4" />
                      Bloquear
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleFeatured(artisan.id, artisan.isFeatured)}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${
                      artisan.isFeatured
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {artisan.isFeatured ? (
                      <>
                        <StarOff className="h-4 w-4" />
                        Quitar Destacado
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" />
                        Destacar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))
        )}
      </div>
    </div>
  );
}
