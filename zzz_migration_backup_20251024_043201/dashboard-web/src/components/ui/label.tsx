'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
<<<<<<< HEAD:apps/dashboard-web/src/components/ui/label.tsx
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
=======
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6:apps/web/v0dev/c-artisan-dashboard/components/ui/label.tsx
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD:apps/dashboard-web/src/components/ui/label.tsx
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
=======
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6:apps/web/v0dev/c-artisan-dashboard/components/ui/label.tsx
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
