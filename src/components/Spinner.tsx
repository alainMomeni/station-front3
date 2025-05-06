import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // Optional size prop
  color?: string; // Optional color prop, defaults to theme purple
  className?: string; // Allow passing additional classes
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-purple-600',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true" // It's decorative
      role="status" // For accessibility
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
      <span className="sr-only">Chargement...</span>
    </svg>
  );
};

export default Spinner;