/**
 * Button Component - Modern UI button with variants
 * Based on shadcn/ui patterns with A4CO branding
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]',
        secondary:
          'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600',
        outline:
          'border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500',
        ghost:
          'text-zinc-300 hover:bg-zinc-800 hover:text-white',
        destructive:
          'bg-red-600 text-white shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/40',
        neon:
          'bg-zinc-900 border-2 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/30 hover:bg-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/50',
      },
      size: {
        default: 'h-11 px-6 py-2 text-base',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-13 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
