// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react'; // Add Eye and EyeOff imports
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation simple
      if (!email.trim() || !password.trim()) {
        setError('Veuillez remplir tous les champs');
        setIsLoading(false);
        return;
      }

      // Tentative de connexion
      const result = login(email.trim(), password);
      
      if (result.success && result.redirectTo) {
        console.log('Connexion réussie, redirection vers:', result.redirectTo);
        navigate(result.redirectTo, { replace: true });
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Une erreur est survenue');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour remplir automatiquement les identifiants (pour les tests)
  const fillCredentials = (role: 'pompiste' | 'caissier' | 'chef_de_piste' | 'gerant') => {
    const credentials = {
      pompiste: { email: 'pompiste@station.cm', password: 'pompiste123' },
      caissier: { email: 'caissier@station.cm', password: 'caissier123' },
      chef_de_piste: { email: 'chef@station.cm', password: 'chef123' },
      gerant: { email: 'gerant@station.cm', password: 'gerant123' }
    };
    
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError('');
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center w-full min-h-screen p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-6xl w-full shadow-2xl flex flex-col lg:flex-row h-auto lg:max-h-[95vh]">
        
        {/* Left Section - Form */}
        <div className="lg:w-1/2 w-full p-8 sm:p-10 lg:p-12 flex items-center justify-center overflow-y-auto">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <svg width="37" height="37" viewBox="0 0 37 37" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-gray-800">
                  <path d="M18.5 34.888c-1.033 0-2.08-.23-2.898-.71L7.123 29.291C3.67 26.963 3.454 26.609 3.454 22.955V14.044c0-3.654.2-4.009 3.592-6.306l8.541-4.934c1.618-.94 4.162-.94 5.78 0l8.51 4.902c3.454 2.328 3.67 2.682 3.67 6.336v8.896c0 3.654-.2 4.009-3.592 6.306l-8.54 4.933c-.832.478-1.88.71-2.912.71Zm0-30.464c-.647 0-1.279.124-1.726.387L8.295 9.712C5.782 11.408 5.782 11.408 5.782 14.044v8.896c0 2.636 0 2.636 2.575 4.378l8.418 4.857c.91.524 2.56.524 3.47 0l8.479-4.902c2.497-1.695 2.497-1.695 2.497-4.331v-8.896c0-2.636 0-2.636-2.575-4.378L20.227 4.81c-.448-.262-1.08-.387-1.727-.387Z" />
                  <path d="M18.5 24.281c-3.191 0-5.781-2.59-5.781-5.781s2.59-5.781 5.781-5.781 5.781 2.59 5.781 5.781-2.59 5.781-5.781 5.781Zm0-9.25a3.469 3.469 0 0 0-3.469 3.469 3.469 3.469 0 0 0 3.469 3.469 3.469 3.469 0 0 0 3.469-3.469 3.469 3.469 0 0 0-3.469-3.469Z" />
                </svg>
                <h1 className="text-3xl font-bold ml-2 text-gray-800">Station LOGO</h1>
              </div>
              <p className="text-gray-600">Nous sommes heureux de vous revoir sur la plateforme</p>
            </div>

            {/* Boutons de test (à retirer en production) */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-3 font-medium">Identifiants de test :</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => fillCredentials('pompiste')}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition"
                  type="button"
                >
                  Pompiste
                </button>
                <button 
                  onClick={() => fillCredentials('caissier')}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition"
                  type="button"
                >
                  Caissier
                </button>
                <button 
                  onClick={() => fillCredentials('chef_de_piste')}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 transition"
                  type="button"
                >
                  Chef de Piste
                </button>
                <button 
                  onClick={() => fillCredentials('gerant')}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition"
                  type="button"
                >
                  Gérant
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none focus:ring-purple-500 focus:border-transparent transition border-gray-300"
                  placeholder="exemple@station.cm"
                  disabled={isLoading}
                />
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none focus:ring-purple-500 focus:border-transparent transition border-gray-300"
                    placeholder="Votre mot de passe"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                <button 
                  type="button"
                  onClick={(e) => e.preventDefault()} 
                  className="text-sm text-purple-600 hover:text-purple-800"
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Right Section - Background Image */}
        <div className="lg:w-1/2 w-full overflow-hidden hidden lg:block">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Bienvenue à la Station</h2>
              <p className="text-lg opacity-90">Gestion moderne et efficace</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}