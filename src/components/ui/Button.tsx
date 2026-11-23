import React from 'react';
import { cn } from '../../lib/utils.ts';

export type ButtonVariant =
  | 'default'
  | 'accent'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'link'
  | 'destructive';

export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground shadow-sm hover:opacity-95 active:translate-y-px',
  accent:
    'bg-accent text-accent-foreground shadow-sm hover:opacity-95 active:translate-y-px',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-sand/70',
  outline:
    'border border-input bg-transparent text-foreground hover:border-accent/50 hover:bg-copper-soft/60',
  ghost:
    'text-foreground hover:bg-secondary/70',
  subtle:
    'bg-card text-foreground border border-border hover:border-accent/40',
  link:
    'text-accent underline-offset-4 hover:underline p-0 h-auto',
  destructive:
    'bg-destructive text-destructive-foreground hover:opacity-90',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px] [&_svg]:size-3.5',
  default: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
  icon: 'h-10 w-10 p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const combinedClassName = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ className?: string }>,
        {
          className: cn(combinedClassName, (children.props as { className?: string }).className),
        },
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
