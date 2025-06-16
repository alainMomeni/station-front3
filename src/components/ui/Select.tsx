import React, { forwardRef } from 'react';
import { inputStyles, cn } from '../../config/design';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: keyof typeof inputStyles.variants;
  state?: keyof typeof inputStyles.states;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  variant = 'default',
  state,
  label,
  required,
  error,
  helpText,
  options,
  className,
  disabled,
  ...props
}, ref) => {
  const selectClasses = cn(
    inputStyles.base,
    inputStyles.variants[variant],
    state && inputStyles.states[state],
    error && inputStyles.states.error,
    disabled && inputStyles.states.disabled,
    'pr-10 cursor-pointer',
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
        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
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

Select.displayName = 'Select';