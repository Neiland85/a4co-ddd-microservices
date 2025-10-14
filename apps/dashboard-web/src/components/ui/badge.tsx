import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
<<<<<<< HEAD
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
=======
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
<<<<<<< HEAD
  },
=======
  }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
<<<<<<< HEAD
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
=======
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
}

export { Badge, badgeVariants };
