// apps/dashboard-web/src/components/v0/adapted/OffersCarouselV0.tsx
// Versión adaptada del OffersCarousel de v0.dev para ofertas del mercado local
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Asumiendo shadcn/ui instalado
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'; // Asumiendo shadcn/ui instalado
import React from 'react';
import { useSalesOpportunities } from '../../../hooks/useSalesOpportunities';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: string;
}

interface OffersCarouselV0Props {
  offers?: Offer[];
}

const defaultOffers: Offer[] = [
  { id: '1', title: 'Oferta 1', description: 'Descripción de la oferta 1', price: '10€' },
  { id: '2', title: 'Oferta 2', description: 'Descripción de la oferta 2', price: '15€' },
  { id: '3', title: 'Oferta 3', description: 'Descripción de la oferta 3', price: '20€' },
];

const OffersCarouselV0: React.FC<OffersCarouselV0Props> = ({ offers = defaultOffers }) => {
  const { opportunities, loading } = useSalesOpportunities();

  // El componente raw usa datos hardcodeados y tiene un callback onOfferExplosion
  // que no necesitamos para esta adaptación. Por ahora mostramos la versión original
  // pero con un wrapper que indica que está adaptado para oportunidades locales

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Cargando ofertas locales...</span>
      </div>
    );
  }

  return (
    <div className="offers-carousel space-y-4">
      <div className="rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-4 text-white">
        <h2 className="mb-2 text-xl font-bold">🛍️ Ofertas Destacadas - Mercado Local de Jaén</h2>
        <p className="text-sm opacity-90">Descubre las mejores ofertas de productores locales</p>
        <div className="mt-2 text-xs">
          📊 {opportunities?.length || 0} oportunidades disponibles
        </div>
      </div>

      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {offers.map(offer => (
              <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-gray-600">{offer.description}</p>
                    <p className="text-xl font-semibold text-green-600">{offer.price}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <h3 className="mb-2 text-sm font-semibold">Próximamente:</h3>
          <ul className="space-y-1 text-xs">
            <li>• Ofertas reales de Jaén</li>
            <li>• Productos de temporada</li>
            <li>• Descuentos por volumen</li>
            <li>• Productores certificados</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OffersCarouselV0;
