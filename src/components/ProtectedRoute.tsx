// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import type { RoleType } from '../hooks/useAuth'; // <-- Bonne pratique : Importer le type

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: RoleType[]; // <-- Bonne pratique : Utiliser le type RoleType
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles 
}) => {
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // FIX: On vérifie à la fois le statut d'authentification ET la présence de l'objet utilisateur.
  // C'est la garde la plus sûre.
  if (!isAuthenticated || !user) {
    // Si l'un ou l'autre est faux, on redirige vers le login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // À ce stade, TypeScript sait que `user` n'est PAS null.
  // On peut donc accéder à `user.role` en toute sécurité, sans '?'.
  if (roles && !roles.includes(user.role)) {
    // Rediriger vers le tableau de bord approprié en fonction du rôle
    const redirectMap: Record<RoleType, string> = { // <-- Type plus strict pour redirectMap
      pompiste: '/dashboard',
      caissier: '/dashboard-caissier',
      chef_de_piste: '/dashboard-chef-de-piste',
      gerant: '/gerant/dashboard'
    };
    
    // Pas besoin de 'as', l'accès est maintenant entièrement typé et sécurisé.
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  // L'utilisateur est authentifié, l'objet user existe, et il a le bon rôle.
  return <>{children}</>;
};