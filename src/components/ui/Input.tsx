import React, { forwardRef } from 'react';
import { inputStyles, cn } from '../../config/design';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof inputStyles.variants;
  state?: keyof typeof inputStyles.states;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  state,
  label,
  required,
  error,
  helpText,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}, ref) => {
  const inputClasses = cn(
    inputStyles.base,
    inputStyles.variants[variant],
    state && inputStyles.states[state],
    error && inputStyles.states.error,
    disabled && inputStyles.states.disabled,
    leftIcon ? 'pl-11' : undefined,
    rightIcon ? 'pr-11' : undefined,
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className={cn(
          'block text-sm font-medium text-gray-700',
          required && "after:content-['*'] after:text-red-500 after:ml-1"
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
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

Input.displayName = 'Input';