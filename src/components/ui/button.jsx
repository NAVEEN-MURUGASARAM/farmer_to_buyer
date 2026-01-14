// src/components/ui/button.jsx
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-green-600 hover:bg-green-700 text-white',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-900',
};

const buttonSizes = {
  sm: 'h-9 px-3 text-sm',
  default: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant] || buttonVariants.default,
        buttonSizes[size] || buttonSizes.default,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}


