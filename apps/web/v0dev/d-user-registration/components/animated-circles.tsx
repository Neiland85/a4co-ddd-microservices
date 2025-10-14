'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedCirclesProps {
  section: 'registration' | 'verification' | 'success';
}

export function AnimatedCircles({ section }: AnimatedCirclesProps) {
  const [circles, setCircles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string }>
  >([]);

  const getColorsForSection = (section: string) => {
    switch (section) {
      case 'registration':
        return ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];
      case 'verification':
        return ['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];
      case 'success':
        return ['#10B981', '#059669', '#34D399', '#6EE7B7'];
      default:
        return ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];
    }
  };

  useEffect(() => {
    const colors = getColorsForSection(section);
    const newCircles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setCircles(newCircles);
  }, [section]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {circles.map(circle => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full opacity-10 blur-xl"
          style={{
            backgroundColor: circle.color,
            width: circle.size,
            height: circle.size,
          }}
          initial={{
            x: `${circle.x}vw`,
            y: `${circle.y}vh`,
          }}
          animate={{
            x: [`${circle.x}vw`, `${(circle.x + 20) % 100}vw`, `${circle.x}vw`],
            y: [`${circle.y}vh`, `${(circle.y + 15) % 100}vh`, `${circle.y}vh`],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
