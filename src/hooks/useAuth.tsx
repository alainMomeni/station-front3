// src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

// FIX: Ajout du mot-clé 'export' pour que ce type soit importable
export type RoleType = 'pompiste' | 'caissier' | 'chef_de_piste' | 'gerant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  roleLabel: string;
  initial: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Identifiants prédéfinis pour chaque rôle
const CREDENTIALS = {
  // Pompiste
  'pompiste@station.cm': { 
    password: 'pompiste123', 
    user: { 
      id: '1', 
      email: 'pompiste@station.cm', 
      name: 'Natalya Pompiste', 
      role: 'pompiste' as RoleType, 
      roleLabel: 'Pompiste',
      initial: 'N'
    } 
  },
  
  // Caissier
  'caissier@station.cm': { 
    password: 'caissier123', 
    user: { 
      id: '2', 
      email: 'caissier@station.cm', 
      name: 'Jean Caissier', 
      role: 'caissier' as RoleType, 
      roleLabel: 'Caissier',
      initial: 'J'
    } 
  },
  
  // Chef de Piste
  'chef@station.cm': { 
    password: 'chef123', 
    user: { 
      id: '3', 
      email: 'chef@station.cm', 
      name: 'Amina Chef', 
      role: 'chef_de_piste' as RoleType, 
      roleLabel: 'Chef de Piste',
      initial: 'A'
    } 
  },
  
  // Gérant
  'gerant@station.cm': { 
    password: 'gerant123', 
    user: { 
      id: '4', 
      email: 'gerant@station.cm', 
      name: 'Moussa Gérant', 
      role: 'gerant' as RoleType, 
      roleLabel: 'Gérant',
      initial: 'M'
    } 
  }
};

// Dashboard routes pour chaque rôle
const ROLE_DASHBOARDS = {
  pompiste: '/dashboard',
  caissier: '/dashboard-caissier',
  chef_de_piste: '/dashboard-chef-de-piste',
  gerant: '/gerant/dashboard'
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string; redirectTo?: string } => {
    const credential = CREDENTIALS[email as keyof typeof CREDENTIALS];
    
    if (!credential) {
      return { success: false, error: 'Email non reconnu' };
    }
    
    if (credential.password !== password) {
      return { success: false, error: 'Mot de passe incorrect' };
    }
    
    // Connexion réussie
    const user = credential.user;
    setAuthState({ user, isAuthenticated: true });
    
    // Sauvegarder dans localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    return { 
      success: true, 
      redirectTo: ROLE_DASHBOARDS[user.role] 
    };
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  };

  const getDashboardRoute = (role: RoleType): string => {
    return ROLE_DASHBOARDS[role];
  };

  return {
    ...authState,
    login,
    logout,
    getDashboardRoute
  };
};

// Context pour partager l'état d'authentification
const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext doit être utilisé dans un AuthProvider');
  }
  return context;
};