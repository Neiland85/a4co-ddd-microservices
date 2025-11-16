/**
 * QuickActions Component - Quick access buttons to main features
 * Features: Animated grid, icon buttons with hover effects
 */

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useAnime } from '@/hooks/useAnime';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: string;
  href: string;
  color: string;
  gradient: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Sorteos',
    icon: '🎟️',
    href: ROUTES.RAFFLES,
    color: 'purple',
    gradient: 'from-purple-600 to-purple-800',
  },
  {
    label: 'Foro',
    icon: '💬',
    href: ROUTES.FORUM,
    color: 'pink',
    gradient: 'from-pink-600 to-pink-800',
  },
  {
    label: 'Herramientas',
    icon: '🛠️',
    href: ROUTES.TOOLS,
    color: 'blue',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    label: 'Eventos',
    icon: '🎉',
    href: ROUTES.EVENTS,
    color: 'green',
    gradient: 'from-green-600 to-green-800',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {QUICK_ACTIONS.map((action, index) => (
        <QuickActionCard key={action.label} action={action} index={index} />
      ))}
    </div>
  );
}

interface QuickActionCardProps {
  action: QuickAction;
  index: number;
}

function QuickActionCard({ action, index }: QuickActionCardProps) {
  const { ref } = useAnime<HTMLAnchorElement>({
    config: {
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 600,
      delay: 300 + index * 100,
      easing: 'easeOutQuad',
    },
  });

  return (
    <Link
      ref={ref}
      href={action.href}
      className="group block"
    >
      <Card
        className={cn(
          'h-full transition-all duration-300 hover:scale-105 cursor-pointer',
          'hover:shadow-2xl hover:-translate-y-1'
        )}
      >
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          {/* Icon with gradient background */}
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center',
              'bg-gradient-to-br shadow-lg transition-all duration-300',
              'group-hover:scale-110 group-hover:rotate-6',
              action.gradient
            )}
          >
            <span className="text-3xl">{action.icon}</span>
          </div>

          {/* Label */}
          <span className="font-semibold text-white text-lg group-hover:text-purple-400 transition-colors">
            {action.label}
          </span>

          {/* Hover indicator */}
          <div
            className={cn(
              'h-1 w-0 rounded-full transition-all duration-300',
              'group-hover:w-full',
              `bg-gradient-to-r ${action.gradient}`
            )}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
