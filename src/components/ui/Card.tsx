// src/components/ui/Card.tsx (VERSION CORRIGÉE ET ROBUSTE)
import React from 'react';

export interface CardProps {
  // Le titre et l'icône sont maintenant optionnels
  title?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  icon: Icon, // Icon peut être undefined
  children, 
  className = "", 
  headerContent 
}) => (
  <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
    {/* Le header ne s'affiche que si un titre est fourni */}
    {title && (
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            {/* L'icône ne s'affiche que si elle est fournie ET qu'un titre existe */}
            {Icon && <Icon className="mr-3 text-xl" />}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {headerContent && (
            <div>{headerContent}</div>
          )}
        </div>
      </div>
    )}
    
    {/* Le contenu est toujours affiché */}
    {children}
  </div>
);