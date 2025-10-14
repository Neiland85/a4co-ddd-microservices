import type { LucideIcon } from 'lucide-react';

export interface IconConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  category?: string;
  onClick?: () => void;
}

export interface IconItemProps {
  readonly config: IconConfig;
  readonly size?: number;
  readonly color?: string;
  readonly strokeWidth?: number;
  readonly variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  readonly className?: string;
}

export interface IconGridProps {
  readonly icons: IconConfig[];
  readonly columns?: {
    readonly mobile?: number;
    readonly tablet?: number;
    readonly desktop?: number;
  };
  readonly size?: number;
  readonly color?: string;
  readonly strokeWidth?: number;
  readonly variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  readonly showLabels?: boolean;
  readonly className?: string;
  readonly onIconClick?: (config: IconConfig) => void;
}

export type IconCategory = 'navigation' | 'commerce' | 'social' | 'ui' | 'media' | 'communication';
