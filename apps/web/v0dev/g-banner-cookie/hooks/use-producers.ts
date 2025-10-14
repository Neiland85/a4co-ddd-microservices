'use client';

import { useState, useEffect } from 'react';
import type { Producer, MapFilters } from '../types/producer-types';

// Mock data for demonstration
const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'Panadería El Ochío',
    category: 'panaderia',
    description: 'Panadería tradicional especializada en ochíos y pan artesanal desde 1952',
    address: 'Calle Real 45, Úbeda, Jaén',
    coordinates: { lat: 38.0138, lng: -3.3706 },
    products: ['Ochío tradicional', 'Pan de pueblo', 'Roscos de aceite'],
    rating: 4.8,
    phone: '+34 953 123 456',
    established: 1952,
    specialties: ['Ochío con morcilla', 'Pan candeal', 'Dulces conventuales'],
    certifications: ['Artesano Certificado', 'Producto Local'],
    distance: 2.3,
  },
  {
    id: '2',
    name: 'Quesería Sierra Mágina',
    category: 'queseria',
    description: 'Quesos artesanales de cabra y oveja con denominación de origen',
    address: 'Camino de la Sierra s/n, Cambil, Jaén',
    coordinates: { lat: 37.6892, lng: -3.5234 },
    products: ['Queso de cabra curado', 'Queso fresco', 'Queso con hierbas'],
    rating: 4.9,
    phone: '+34 953 987 654',
    established: 1978,
    specialties: ['Queso semicurado', 'Queso ahumado', 'Requesón'],
    certifications: ['D.O. Protegida', 'Ecológico'],
    distance: 15.7,
  },
  {
    id: '3',
    name: 'Almazara Olivar Dorado',
    category: 'aceite',
    description: 'Aceite de oliva virgen extra de primera presión en frío',
    address: 'Carretera de Baeza km 3, Úbeda, Jaén',
    coordinates: { lat: 38.0089, lng: -3.3456 },
    products: ['AOVE Picual', 'AOVE Arbequina', 'Aceite ecológico'],
    rating: 4.7,
    phone: '+34 953 456 789',
    established: 1965,
    specialties: ['Aceite premium', 'Aceite filtrado', 'Aceite sin filtrar'],
    certifications: ['D.O.P. Sierra de Segura', 'Ecológico'],
    distance: 5.1,
  },
];

export function useProducers(filters: MapFilters) {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProducers = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Apply filters
        let filteredProducers = mockProducers;

        if (filters.categories.length > 0) {
          filteredProducers = filteredProducers.filter(p =>
            filters.categories.includes(p.category)
          );
        }

        if (filters.maxDistance > 0) {
          filteredProducers = filteredProducers.filter(
            p => (p.distance || 0) <= filters.maxDistance
          );
        }

        if (filters.searchQuery) {
          filteredProducers = filteredProducers.filter(
            p =>
              p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );
        }

        if (filters.minRating > 0) {
          filteredProducers = filteredProducers.filter(p => p.rating >= filters.minRating);
        }

        setProducers(filteredProducers);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducers();
  }, [filters]);

  return { producers, isLoading, error };
}
