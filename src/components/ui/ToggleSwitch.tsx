// src/components/ui/ToggleSwitch.tsx
import React from 'react';
import { cn } from '../../config/design';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
  disabled = false,
}) => {
  const bgClasses = checked ? 'bg-purple-600' : 'bg-gray-300';
  const sizeClasses = size === 'sm' ? {
    container: 'w-9 h-5',
    circle: 'h-4 w-4',
    translate: 'translate-x-4',
  } : {
    container: 'w-11 h-6',
    circle: 'h-5 w-5',
    translate: 'translate-x-5',
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={cn('block rounded-full transition-colors duration-200 ease-in-out', sizeClasses.container, bgClasses, disabled && 'opacity-50 cursor-not-allowed')} />
        <div
          className={cn(
            'dot absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out',
            sizeClasses.circle,
            checked && sizeClasses.translate
          )}
        />
      </div>
      {label && <span className={cn('ml-3 text-sm font-medium text-gray-700', disabled && 'text-gray-400')}>{label}</span>}
    </label>
  );
};