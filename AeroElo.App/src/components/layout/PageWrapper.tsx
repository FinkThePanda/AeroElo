import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          )}
          {subtitle && (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
