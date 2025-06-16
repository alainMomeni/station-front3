// src/components/ui/StatCard.tsx
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../config/design';

const statCardStyles = cva(
  'p-5 rounded-2xl shadow-lg border-l-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-1',
  {
    variants: {
      variant: {
        primary: 'bg-white border-purple-500',
        success: 'bg-white border-green-500',
        warning: 'bg-yellow-50 border-yellow-500',
        error: 'bg-red-50 border-red-500',
        neutral: 'bg-white border-gray-400',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ElementType;
  title: string;
  value: string;
  unit?: string;
  footer?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  className,
  variant,
  icon: Icon,
  title,
  value,
  unit,
  footer,
  ...props
}) => {
  const colorMap = {
    primary: 'text-purple-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    neutral: 'text-gray-600'
  };
  
  const iconColor = colorMap[(variant || 'primary') as keyof typeof colorMap];
  const titleColor = 'text-gray-600';
  const valueColor = 'text-gray-900';
  
  return (
    <div className={cn(statCardStyles({ variant }), className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${titleColor} truncate`}>{title}</p>
          <div className="mt-1 flex items-baseline">
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            {unit && <p className={`ml-2 text-sm font-medium ${titleColor}`}>{unit}</p>}
          </div>
        </div>
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
        </div>
      </div>
      {footer && (
        <div className="mt-4 border-t border-gray-200/60 pt-2">
            {footer}
        </div>
      )}
    </div>
  );
};

export default StatCard;