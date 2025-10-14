'use client';

import type React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  image: string;
  category: string;
  isFavorite: boolean;
}

const offers: Offer[] = [
  {
    id: 1,
    title: 'Pizza Suprema',
    description: 'La mejor pizza de la ciudad con ingredientes premium',
    discount: '50%',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Comida',
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Spa Relajante',
    description: 'Masajes y tratamientos de lujo para tu bienestar',
    discount: '30%',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Bienestar',
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Aventura Extrema',
    description: 'Deportes de aventura y experiencias únicas',
    discount: '40%',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Aventura',
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Cine Premium',
    description: 'Películas en 4D con asientos VIP',
    discount: '25%',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Entretenimiento',
    isFavorite: true,
  },
];

interface OffersCarouselProps {
  onOfferExplosion: (x: number, y: number) => void;
}

export default function OffersCarousel({ onOfferExplosion }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heartbeats, setHeartbeats] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      offers.forEach(offer => {
        if (offer.isFavorite) {
          setHeartbeats(prev => ({
            ...prev,
            [offer.id]: !prev[offer.id],
          }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + offers.length) % offers.length);
  };

  const handleOfferClick = (event: React.MouseEvent, offer: Offer) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    onOfferExplosion(x, y);
  };

  return (
    <div className="rounded-3xl border-4 border-yellow-400 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-6 shadow-2xl">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <h2 className="flex items-center text-3xl font-bold text-white">
          <Heart className="mr-3 h-8 w-8 text-red-400" />
          Ofertas Favoritas
          <Sparkles className="ml-2 h-6 w-6 text-yellow-400" />
        </h2>

        <div className="flex space-x-2">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="border-white/30 bg-white/20 hover:bg-white/30"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="border-white/30 bg-white/20 hover:bg-white/30"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      </motion.div>

      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {offers.slice(currentIndex, currentIndex + 2).map(offer => (
              <motion.div
                key={offer.id}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={e => handleOfferClick(e, offer)}
                className="relative cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-xl"
                animate={
                  offer.isFavorite && heartbeats[offer.id]
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(255, 0, 0, 0.7)',
                          '0 0 0 10px rgba(255, 0, 0, 0)',
                          '0 0 0 0 rgba(255, 0, 0, 0)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                {/* Discount Badge */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-3 py-1 text-lg font-bold text-white"
                >
                  -{offer.discount}
                </motion.div>

                {/* Favorite Heart */}
                {offer.isFavorite && (
                  <motion.div
                    animate={
                      heartbeats[offer.id]
                        ? {
                            scale: [1, 1.3, 1],
                            color: ['#ef4444', '#dc2626', '#ef4444'],
                          }
                        : {}
                    }
                    transition={{ duration: 0.6 }}
                    className="absolute left-2 top-2 z-10"
                  >
                    <Heart className="h-6 w-6 fill-current text-red-500" />
                  </motion.div>
                )}

                <img
                  src={offer.image || '/placeholder.svg'}
                  alt={offer.title}
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{offer.title}</h3>
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                      {offer.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{offer.description}</p>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-between pt-2"
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      ¡Explotar!
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators */}
      <div className="mt-4 flex justify-center space-x-2">
        {offers.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-yellow-400' : 'bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  );
}
