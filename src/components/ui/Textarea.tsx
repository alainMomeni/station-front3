// src/components/ui/Textarea.tsx
import React, { forwardRef } from 'react';
import { inputStyles, cn } from '../../config/design';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: keyof typeof inputStyles.variants;
  state?: keyof typeof inputStyles.states;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  state,
  label,
  required,
  error,
  helpText,
  className,
  disabled,
  ...props
}, ref) => {
  const textareaClasses = cn(
    inputStyles.base,
    inputStyles.variants[variant],
    state && inputStyles.states[state],
    error && inputStyles.states.error,
    disabled && inputStyles.states.disabled,
    'resize-none', // Désactiver le redimensionnement manuel par défaut
    className
  );

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className={cn(
          'block text-sm font-medium text-gray-700',
          required && "after:content-['*'] after:text-red-500 after:ml-1"
        )}>
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={textareaClasses}
        disabled={disabled}
        {...props}
      />
      
      {error && (
        <p className="text-xs text-red-600 flex items-center">
          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';