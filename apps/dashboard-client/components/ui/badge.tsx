/**
 * Badge Component - Status badges and tags
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
        secondary:
          'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
        success:
          'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20',
        warning:
          'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
        destructive:
          'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
        neon:
          'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/20',
        outline:
          'border-zinc-600 text-zinc-400 hover:bg-zinc-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
