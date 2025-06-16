// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import type { RoleType } from '../contexts/AuthContext'; // Import depuis le nouveau fichier

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: RoleType[]; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // 1. L'utilisateur n'est pas authentifié OU l'objet user n'existe pas.
  // C'est la garde la plus importante. Si `logout()` est appelé,
  // `isAuthenticated` deviendra `false`, et cette condition sera vraie.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. L'utilisateur est authentifié, mais n'a pas le bon rôle.
  // TypeScript sait maintenant que `user` n'est pas `null`.
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Rediriger vers une page "Non autorisé" ou le dashboard par défaut du rôle de l'utilisateur.
    // Pour cet exemple, une simple redirection vers "non autorisé" peut être plus claire.
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Tout est en ordre.
  return <>{children}</>;
};