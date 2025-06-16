// src/contexts/AuthContext.tsx
import  { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type RoleType = 'pompiste' | 'caissier' | 'chef_de_piste' | 'gerant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  roleLabel: string;
  initial: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string; redirectTo?: string };
  logout: () => void;
}

const CREDENTIALS = {
  'pompiste@station.cm': { password: 'pompiste123', user: { id: '1', email: 'pompiste@station.cm', name: 'Natalya Pompiste', role: 'pompiste' as RoleType, roleLabel: 'Pompiste', initial: 'N' }},
  'caissier@station.cm': { password: 'caissier123', user: { id: '2', email: 'caissier@station.cm', name: 'Jean Caissier', role: 'caissier' as RoleType, roleLabel: 'Caissier', initial: 'J' }},
  'chef@station.cm': { password: 'chef123', user: { id: '3', email: 'chef@station.cm', name: 'Amina Chef', role: 'chef_de_piste' as RoleType, roleLabel: 'Chef de Piste', initial: 'A' }},
  'gerant@station.cm': { password: 'gerant123', user: { id: '4', email: 'gerant@station.cm', name: 'Moussa Gérant', role: 'gerant' as RoleType, roleLabel: 'Gérant', initial: 'M' }},
};

const ROLE_DASHBOARDS = {
  pompiste: '/dashboard',
  caissier: '/dashboard-caissier',
  chef_de_piste: '/dashboard-chef-de-piste',
  gerant: '/gerant/dashboard'
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userFromFile = JSON.parse(savedUser);
        setUser(userFromFile);
      } catch (error) {
        console.error("Erreur de parsing de l'utilisateur du localStorage", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string; redirectTo?: string } => {
    const credential = CREDENTIALS[email as keyof typeof CREDENTIALS];
    if (credential && credential.password === password) {
      const loggedInUser = credential.user;
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return { success: true, redirectTo: ROLE_DASHBOARDS[loggedInUser.role] };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook custom pour consommer le contexte (c'est celui qu'il faut utiliser !)
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};