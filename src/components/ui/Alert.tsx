import React from 'react';
import { alertStyles, cn } from '../../config/design';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

export interface AlertProps {
  variant?: keyof typeof alertStyles.variants;
  title?: string;
  children: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
  dismissible,
  onDismiss
}) => {
  const Icon = iconMap[variant];
  
  const classes = cn(
    alertStyles.base,
    alertStyles.variants[variant],
    className
  );

  return (
    <div className={classes}>
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        {title && (
          <h3 className="font-semibold mb-1">{title}</h3>
        )}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-3 flex-shrink-0 text-current opacity-70 hover:opacity-100"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};