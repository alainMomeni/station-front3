// src/pages/pompiste/ProfilPage.tsx (ou le chemin correct)
import React, { useState, useEffect } from 'react';
import { FiEdit3, FiSave, FiCamera } from 'react-icons/fi';
import Spinner from '../../components/Spinner'; // Assurez-vous d'avoir ce composant
import { useAuthContext } from '../../contexts/AuthContext'; // 1. IMPORTER LE CONTEXTE

// Interface pour définir la structure de l'état du profil
interface ProfileState {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  avatarUrl: string;
}

const ProfilPage: React.FC = () => {
  // 2. RECUPERER L'UTILISATEUR DEPUIS LE CONTEXTE
  const { user: contextUser } = useAuthContext();

  // État local pour le profil affiché et les modifications temporaires
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [tempProfile, setTempProfile] = useState<ProfileState | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 3. SYNCHRONISER L'ETAT LOCAL AVEC LE CONTEXTE
  useEffect(() => {
    // Ne s'exécute que si contextUser n'est pas null
    if (contextUser) {
      // Sépare le nom complet en prénom et nom.
      const nameParts = contextUser.name.split(' ');
      const prenom = nameParts.shift() || ''; // Le premier élément est le prénom
      const nom = nameParts.join(' ');     // Le reste est le nom

      const initialProfile: ProfileState = {
        nom,
        prenom,
        email: contextUser.email,
        role: contextUser.roleLabel,
        telephone: '0123456789', // Info non présente dans le contexte, on garde une valeur par défaut
        avatarUrl: `https://ui-avatars.com/api/?name=${contextUser.name.replace(' ', '+')}&background=8B5CF6&color=fff&size=128`, // Génère un avatar à partir du nom
      };
      
      setProfile(initialProfile);
      setTempProfile(initialProfile);
    }
  }, [contextUser]); // Se redéclenche si l'utilisateur du contexte change

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tempProfile) {
        setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    }
  };

  const handleSaveChanges = async () => {
    if (!tempProfile) return;
    setIsLoading(true);

    // TODO: Dans une vraie application, appeler ici une fonction updateUser(tempProfile)
    // qui mettrait à jour le contexte et la base de données.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProfile(tempProfile);
    setIsEditing(false);
    setIsLoading(false);
    alert('Profil mis à jour !');
  };
  
  // 4. AFFICHER UN ETAT DE CHARGEMENT
  if (!profile || !tempProfile) {
    return (
        <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
        </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-8">
        Mon Profil
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={`${profile.nom}'s avatar`}
              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-purple-200"
            />
            {isEditing && (
                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700 cursor-pointer shadow-md"
                  title="Changer l'avatar"
                >
                    <FiCamera className="h-4 w-4" />
                    <input type="file" id="avatarUpload" className="hidden" accept="image/*" />
                </label>
            )}
          </div>
          <div className="flex-1 w-full">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold text-purple-700">{profile.prenom} {profile.nom}</h2>
                <p className="text-sm text-gray-500 mb-4">{profile.role}</p>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Email :</strong> {profile.email}</p>
                  <p><strong>Téléphone :</strong> {profile.telephone || 'Non spécifié'}</p>
                </div>
                <button
                  onClick={() => { setTempProfile(profile); setIsEditing(true); }}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-md hover:bg-purple-200"
                >
                  <FiEdit3 className="mr-2 h-4 w-4" /> Modifier le profil
                </button>
              </>
            ) : (
              <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); handleSaveChanges();}}>
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input type="text" name="prenom" id="prenom" value={tempProfile.prenom} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                 <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="nom" id="nom" value={tempProfile.nom} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" id="email" value={tempProfile.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input type="tel" name="telephone" id="telephone" value={tempProfile.telephone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 min-w-[120px]"
                  >
                    {isLoading ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2 h-4 w-4" /> Enregistrer</>}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilPage;