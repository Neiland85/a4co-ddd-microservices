'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ExplosionEffectProps {
  x: number;
  y: number;
}

export default function ExplosionEffect({ x, y }: ExplosionEffectProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      color: string;
      size: number;
      angle: number;
      distance: number;
    }>
  >([]);

  useEffect(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 20 + 10,
      angle: (Math.PI * 2 * i) / 20,
      distance: Math.random() * 200 + 100,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none fixed z-50" style={{ left: x, top: y }}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: -particle.size / 2,
            top: -particle.size / 2,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Central explosion flash */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          width: 100,
          height: 100,
          left: -50,
          top: -50,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Shockwave rings */}
      {[1, 2, 3].map(ring => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-4 border-yellow-400"
          style={{
            width: 50,
            height: 50,
            left: -25,
            top: -25,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: ring * 4, opacity: 0 }}
          transition={{
            duration: 1,
            delay: ring * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
