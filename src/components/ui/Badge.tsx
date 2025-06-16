import React from 'react';
import { badgeStyles, cn } from '../../config/design';

export interface BadgeProps {
  variant?: keyof typeof badgeStyles.variants;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className
}) => {
  const classes = cn(
    badgeStyles.base,
    badgeStyles.variants[variant],
    className
  );

  return (
    <span className={classes}>
      {icon && <span className="mr-1.5 h-3 w-3">{icon}</span>}
      {children}
    </span>
  );
};
