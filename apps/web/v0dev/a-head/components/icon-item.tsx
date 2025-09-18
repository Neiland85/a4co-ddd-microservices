'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IconConfig } from '@/types/icon-grid-types';
import * as LucideIcons from 'lucide-react';

interface IconItemProps {
  config: IconConfig;
  onClick?: (config: IconConfig) => void;
}

export function IconItem({ config, onClick }: IconItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.HelpCircle;

  const handleClick = () => {
    if (config.onClick) {
      config.onClick();
    }
    if (onClick) {
      onClick(config);
    }
  };

  const getSizeClasses = () => {
    switch (config.size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getCardSize = () => {
    switch (config.size) {
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  return (
    <Card
      className={`
        cursor-pointer transition-all duration-300 hover:shadow-lg
        ${config.isActive ? 'shadow-md ring-2 ring-blue-500' : ''}
        ${isHovered ? 'scale-105 shadow-xl' : ''}
      `}
      style={{ backgroundColor: config.bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardContent
        className={`flex flex-col items-center justify-center space-y-2 ${getCardSize()}`}
      >
        <div className="relative">
          <IconComponent
            className={`${getSizeClasses()} transition-all duration-300`}
            style={{ color: config.color }}
          />
          {config.isActive && (
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="space-y-1 text-center">
          <h3 className="max-w-full truncate text-sm font-medium text-gray-900">{config.name}</h3>
          <p className="line-clamp-2 text-xs text-gray-600">{config.description}</p>
          <Badge
            variant="secondary"
            className="text-xs"
            style={{
              backgroundColor: `${config.color}20`,
              color: config.color,
              borderColor: `${config.color}40`,
            }}
          >
            {config.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
