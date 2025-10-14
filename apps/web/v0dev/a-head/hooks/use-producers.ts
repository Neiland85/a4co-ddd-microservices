'use client';

import { useState, useMemo } from 'react';
import type { Producer, ProducerFilters, ProducerStats } from '../types/producer-types';

// Mock data for producers
const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'Panadería El Ochío',
    category: 'panaderia',
    location: 'Úbeda, Jaén',
    lat: 38.0138,
    lng: -3.3706,
    rating: 4.8,
    reviewCount: 127,
    distance: 0.5,
    isOpen: true,
    specialties: ['Ochío tradicional', 'Pan de pueblo', 'Roscos'],
    description: 'Panadería tradicional con más de 50 años de historia',
    phone: '+34 953 123 456',
    email: 'info@panaderia-ochio.com',
    hours: '7:00 - 14:00',
  },
  {
    id: '2',
    name: 'Quesería Sierra Mágina',
    category: 'queseria',
    location: 'Cambil, Jaén',
    lat: 37.6892,
    lng: -3.5234,
    rating: 4.6,
    reviewCount: 89,
    distance: 1.2,
    isOpen: true,
    specialties: ['Queso de cabra', 'Queso semicurado', 'Queso fresco'],
    description: 'Quesos artesanales de la Sierra de Mágina',
    phone: '+34 953 234 567',
    email: 'info@queseria-magina.com',
    hours: '9:00 - 18:00',
  },
  {
    id: '3',
    name: 'Aceites Picual',
    category: 'aceite',
    location: 'Baeza, Jaén',
    lat: 37.9926,
    lng: -3.4697,
    rating: 4.9,
    reviewCount: 156,
    distance: 2.1,
    isOpen: false,
    specialties: ['Aceite virgen extra', 'Aceite ecológico', 'Aceite premium'],
    description: 'Aceite de oliva virgen extra de la variedad Picual',
    phone: '+34 953 345 678',
    email: 'ventas@aceites-picual.com',
    hours: '8:00 - 15:00',
  },
  {
    id: '4',
    name: 'Miel de Cazorla',
    category: 'miel',
    location: 'Cazorla, Jaén',
    lat: 37.9108,
    lng: -2.9644,
    rating: 4.7,
    reviewCount: 73,
    distance: 3.5,
    isOpen: true,
    specialties: ['Miel de azahar', 'Miel de romero', 'Miel multifloral'],
    description: 'Miel natural del Parque Natural de Cazorla',
    phone: '+34 953 456 789',
    email: 'info@miel-cazorla.com',
    hours: '10:00 - 19:00',
  },
  {
    id: '5',
    name: 'Conservas La Loma',
    category: 'conservas',
    location: 'Úbeda, Jaén',
    lat: 38.0089,
    lng: -3.3612,
    rating: 4.4,
    reviewCount: 92,
    distance: 0.8,
    isOpen: true,
    specialties: ['Aceitunas aliñadas', 'Encurtidos', 'Conservas vegetales'],
    description: 'Conservas tradicionales de la comarca de La Loma',
    phone: '+34 953 567 890',
    email: 'pedidos@conservas-laloma.com',
    hours: '9:00 - 17:00',
  },
];

export function useProducers() {
  const [filters, setFilters] = useState<ProducerFilters>({
    search: '',
    category: 'all',
    maxDistance: 10,
    minRating: 0,
    onlyOpen: false,
  });

  const filteredProducers = useMemo(() => {
    return mockProducers.filter(producer => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          producer.name.toLowerCase().includes(searchLower) ||
          producer.location.toLowerCase().includes(searchLower) ||
          producer.specialties.some(specialty => specialty.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'all' && producer.category !== filters.category) {
        return false;
      }

      // Distance filter
      if (producer.distance > filters.maxDistance) {
        return false;
      }

      // Rating filter
      if (producer.rating < filters.minRating) {
        return false;
      }

      // Open status filter
      if (filters.onlyOpen && !producer.isOpen) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const stats: ProducerStats = useMemo(() => {
    const total = filteredProducers.length;
    const categories = new Set(filteredProducers.map(p => p.category)).size;
    const averageRating =
      total > 0 ? filteredProducers.reduce((sum, p) => sum + p.rating, 0) / total : 0;
    const openNow = filteredProducers.filter(p => p.isOpen).length;

    return {
      total,
      categories,
      averageRating,
      openNow,
    };
  }, [filteredProducers]);

  const updateFilters = (newFilters: Partial<ProducerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      maxDistance: 10,
      minRating: 0,
      onlyOpen: false,
    });
  };

  return {
    producers: filteredProducers,
    allProducers: mockProducers,
    filters,
    stats,
    updateFilters,
    resetFilters,
  };
}
