import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border border-gray-200',
  };

  return (
    <div
      className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
}
