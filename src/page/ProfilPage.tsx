import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiEdit3, FiSave, FiCamera } from 'react-icons/fi';
import Spinner from '../components/Spinner';

const ProfilPage: React.FC = () => {
  const [user, setUser] = useState({
    nom: 'Natalya',
    prenom: 'Pompiste',
    email: 'natalya.pompiste@station.com',
    role: 'Pompiste',
    telephone: '0123456789',
    avatarUrl: 'https://via.placeholder.com/120',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    console.log("Saving profile:", tempUser);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(tempUser);
    setIsEditing(false);
    setIsLoading(false);
    alert('Profil mis à jour !');
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-8">
        Mon Profil
      </h1>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={`${user.nom}'s avatar`}
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
                <h2 className="text-2xl font-bold text-purple-700">{user.nom} {user.prenom}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.role}</p>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Email :</strong> {user.email}</p>
                  <p><strong>Téléphone :</strong> {user.telephone || 'Non spécifié'}</p>
                </div>
                <button
                  onClick={() => { setTempUser(user); setIsEditing(true); }}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FiEdit3 className="mr-2 h-4 w-4" /> Modifier le profil
                </button>
              </>
            ) : (
              <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); handleSaveChanges();}}>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="nom" id="nom" value={tempUser.nom} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                 <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input type="text" name="prenom" id="prenom" value={tempUser.prenom} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" id="email" value={tempUser.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input type="tel" name="telephone" id="telephone" value={tempUser.telephone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
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
    </DashboardLayout>
  );
};

export default ProfilPage;