import { forwardRef } from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ── Button ───────────────────────────────────────────────────────────────────

const BUTTON_BASE = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
  'text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
].join(' ');

const BUTTON_VARIANTS = {
  default:     'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  outline:     'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  secondary:   'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
  ghost:       'hover:bg-accent hover:text-accent-foreground',
  link:        'text-primary underline-offset-4 hover:underline',
};

const BUTTON_SIZES = {
  default: 'h-9 px-4 py-2',
  sm:      'h-8 rounded-md px-3 text-xs',
  lg:      'h-10 rounded-md px-8',
  icon:    'h-9 w-9',
};

export const Button = forwardRef(function Button(
  { className, variant = 'default', size = 'default', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...props}
    />
  );
});

// ── Input ────────────────────────────────────────────────────────────────────

const INPUT_BASE = [
  'flex h-9 w-full rounded-md border border-input bg-transparent',
  'px-3 py-1 text-base shadow-sm transition-colors',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
].join(' ');

export const Input = forwardRef(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(INPUT_BASE, className)}
      {...props}
    />
  );
});

// ── Badge ────────────────────────────────────────────────────────────────────

const BADGE_BASE = [
  'inline-flex items-center rounded-md border px-2.5 py-0.5',
  'text-xs font-semibold transition-colors',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
].join(' ');

const BADGE_VARIANTS = {
  default:     'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
  secondary:   'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  outline:     'text-foreground',
};

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(BADGE_BASE, BADGE_VARIANTS[variant], className)}
      {...props}
    />
  );
}

// ── Separator ────────────────────────────────────────────────────────────────

export function Separator({ className, orientation = 'horizontal', ...props }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    />
  );
}
