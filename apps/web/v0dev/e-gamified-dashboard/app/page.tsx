'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Gamepad2, Rocket, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlamencoPlayer from '@/components/FlamencoPlayer';

export default function HomePage() {
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hypnotic Black and White Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Main Hypnotic Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            {/* Concentric Hypnotic Rings */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  width: `${(i + 1) * 60}px`,
                  height: `${(i + 1) * 60}px`,
                  left: `${-(i + 1) * 30}px`,
                  top: `${-(i + 1) * 30}px`,
                  borderColor: i % 2 === 0 ? 'white' : 'black',
                  backgroundColor: i % 2 === 0 ? 'transparent' : 'white',
                }}
                animate={{
                  opacity: [0.1, 0.8, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />
            ))}

            {/* Central Hypnotic Spiral */}
            <motion.div
              className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-white"
              animate={{
                scale: [1, 2, 1],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        {/* Secondary Hypnotic Circles */}
        {[
          { x: '20%', y: '30%', size: 300 },
          { x: '80%', y: '70%', size: 400 },
          { x: '10%', y: '80%', size: 250 },
          { x: '90%', y: '20%', size: 350 },
        ].map((circle, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: circle.x, top: circle.y }}
            animate={{ rotate: index % 2 === 0 ? -360 : 360 }}
            transition={{
              duration: 12 + index * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${(i + 1) * (circle.size / 8)}px`,
                  height: `${(i + 1) * (circle.size / 8)}px`,
                  left: `${-(i + 1) * (circle.size / 16)}px`,
                  top: `${-(i + 1) * (circle.size / 16)}px`,
                  borderColor: i % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.5)',
                  borderWidth: '1px',
                }}
                animate={{
                  opacity: [0.1, 0.6, 0.1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: index * 0.5 + i * 0.1,
                }}
              />
            ))}
          </motion.div>
        ))}

        {/* Morphing Background Shapes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 400 - 200, 0],
              y: [0, Math.random() * 400 - 200, 0],
              scale: [0.5, 2, 0.5],
              opacity: [0.05, 0.4, 0.05],
              rotate: [0, 360],
              borderRadius: ['0%', '50%', '0%'],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          >
            {i % 4 === 0 ? (
              <div className="h-20 w-20 bg-white/10" />
            ) : i % 4 === 1 ? (
              <div className="h-16 w-16 rounded-full bg-black/20" />
            ) : i % 4 === 2 ? (
              <div className="h-24 w-12 rotate-45 transform bg-white/15" />
            ) : (
              <div className="h-12 w-24 rounded-full bg-black/10" />
            )}
          </motion.div>
        ))}

        {/* Pulsating Overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.05) 100%)',
              'radial-gradient(circle at 30% 70%, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.4) 100%)',
              'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,0.08) 100%)',
              'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.2) 100%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />

        {/* Floating Dots */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: i % 2 === 0 ? 'white' : 'black',
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content with Enhanced Backdrop */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-center"
        >
          {/* Enhanced Content Background */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 bg-gradient-to-br from-black/40 via-white/10 to-black/40 shadow-2xl backdrop-blur-md" />

          <div className="relative z-10 p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl"
            >
              <Gamepad2 className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="mb-6 text-6xl font-bold text-white drop-shadow-2xl">
              ¡Andalucía Es
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                {' '}
                Cultura!
              </span>
            </h1>

            <p className="mb-8 text-xl font-medium leading-relaxed text-white/95 drop-shadow-lg">
              Descubre a tus artesanos, apoya tus tiendas locales favoritas, asiste a los mejores
              festivales, puntúa tus experiencias y gana entradas a eventos culturales, participa y
              sé parte de la cultura más auténtica y rica en artesanía del país.
            </p>

            <div className="mb-12 flex justify-center space-x-8">
              {[
                { icon: <Star className="h-8 w-8" />, text: 'Ofertas Explosivas' },
                { icon: <Rocket className="h-8 w-8" />, text: 'Mapas Interactivos' },
                { icon: <Zap className="h-8 w-8" />, text: 'Actividades Gamificadas' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    className="mb-2 text-yellow-300"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <p className="text-sm font-medium text-white/90 drop-shadow">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRegisterClick}
                size="lg"
                className="rounded-full border-4 border-white/30 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-8 py-4 text-xl font-bold text-white shadow-2xl backdrop-blur-sm hover:from-yellow-600 hover:via-orange-600 hover:to-red-600"
              >
                ¡Comenzar Aventura!
                <Rocket className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Cita de Paco de Lucía */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="fixed bottom-4 right-4 max-w-xs text-right"
          >
            <div className="rounded-2xl border border-white/20 bg-black/30 p-4 shadow-xl backdrop-blur-md">
              <p className="text-xs italic leading-relaxed text-white/80">
                "Yo no soy un guitarrista flamenco, soy un guitarrista que ama el flamenco." – Paco
                de Lucía
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Reproductor de Música Flamenca */}
      <FlamencoPlayer />
    </div>
  );
}
