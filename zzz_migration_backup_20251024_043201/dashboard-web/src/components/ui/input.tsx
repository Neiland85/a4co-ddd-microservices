import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
<<<<<<< HEAD:apps/dashboard-web/src/components/ui/input.tsx
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
=======
          'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6:apps/web/v0dev/b-business-registration/components/ui/input.tsx
        )}
        ref={ref}
        {...props}
      />
    );
<<<<<<< HEAD:apps/dashboard-web/src/components/ui/input.tsx
  },
=======
  }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6:apps/web/v0dev/b-business-registration/components/ui/input.tsx
);
Input.displayName = 'Input';

export { Input };
