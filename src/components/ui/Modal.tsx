import React, { useEffect } from 'react';
import { modalStyles, cn } from '../../config/design';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={modalStyles.overlay}>
      <div
        className={cn(modalStyles.container, sizeClasses[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={modalStyles.header}>
            <h2 className={modalStyles.title}>{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              leftIcon={<X className="h-4 w-4" />}
            />
          </div>
        )}
        
        <div className={modalStyles.content}>
          {children}
        </div>
        
        {footer && (
          <div className={modalStyles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};