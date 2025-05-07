import  { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import homeBg from '../../assets/home-bg.png'; // Assurez-vous que ce chemin est correct

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Pas d'état 'errors' si on ne fait pas de validation d'interface pour cette version simplifiée

  const navigate = useNavigate(); // Initialiser useNavigate

  const handleNavigateToDashboard = () => {
    // Pas de validation, on navigue directement
    console.log('Navigation vers le dashboard demandée.');
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center w-full min-h-screen p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-6xl w-full shadow-2xl flex flex-col lg:flex-row h-auto lg:max-h-[95vh]"> {/* Ajustement hauteur */}
        
        {/* Left Section - Form */}
        <div className="lg:w-1/2 w-full p-8 sm:p-10 lg:p-12 flex items-center justify-center overflow-y-auto">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                {/* SVG Logo - J'ai mis currentColor pour qu'il prenne la couleur du texte parent si besoin */}
                <svg width="37" height="37" viewBox="0 0 37 37" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-gray-800">
                  <path d="M18.5 34.888c-1.033 0-2.08-.23-2.898-.71L7.123 29.291C3.67 26.963 3.454 26.609 3.454 22.955V14.044c0-3.654.2-4.009 3.592-6.306l8.541-4.934c1.618-.94 4.162-.94 5.78 0l8.51 4.902c3.454 2.328 3.67 2.682 3.67 6.336v8.896c0 3.654-.2 4.009-3.592 6.306l-8.54 4.933c-.832.478-1.88.71-2.912.71Zm0-30.464c-.647 0-1.279.124-1.726.387L8.295 9.712C5.782 11.408 5.782 11.408 5.782 14.044v8.896c0 2.636 0 2.636 2.575 4.378l8.418 4.857c.91.524 2.56.524 3.47 0l8.479-4.902c2.497-1.695 2.497-1.695 2.497-4.331v-8.896c0-2.636 0-2.636-2.575-4.378L20.227 4.81c-.448-.262-1.08-.387-1.727-.387Z" />
                  <path d="M18.5 24.281c-3.191 0-5.781-2.59-5.781-5.781s2.59-5.781 5.781-5.781 5.781 2.59 5.781 5.781-2.59 5.781-5.781 5.781Zm0-9.25a3.469 3.469 0 0 0-3.469 3.469 3.469 3.469 0 0 0 3.469 3.469 3.469 3.469 0 0 0 3.469-3.469 3.469 3.469 0 0 0-3.469-3.469Z" />
                </svg>
                <h1 className="text-3xl font-bold ml-2 text-gray-800">Station LOGO</h1>
              </div>
              <p className="text-gray-600">Nous sommes heureux de vous revoir sur la plateforme</p>
            </div>
            
            {/* Login Form */}
            <div className="space-y-6">
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
                  placeholder="exemple@mail.com"
                />
                {/* Affichage d'erreur retiré pour la simplicité */}
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                 {/* Affichage d'erreur retiré */}
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
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-purple-600 hover:text-purple-800">
                  Mot de passe oublié ?
                </a>
              </div>
              
              {/* Bouton de connexion (Div) */}
              <div 
                onClick={handleNavigateToDashboard}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigateToDashboard()}
                className="w-full py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 transform hover:-translate-y-1 text-center cursor-pointer"
              >
                Se connecter
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Background Image */}
        <div className="lg:w-1/2 w-full overflow-hidden hidden lg:block">
          <img className="w-full h-full object-cover" src={homeBg} alt="Station service avec une voiture et des pompes" />
        </div>
      </div>
    </div>
  );
}