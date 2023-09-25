import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  },
  size: {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  },
};

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
