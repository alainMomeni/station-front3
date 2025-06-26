import React, { useState, useEffect, type FC } from 'react';
import { FiUser, FiEdit3, FiSave, FiCamera } from 'react-icons/fi';
import { useAuthContext } from '../../contexts/AuthContext';
import type { ProfileState } from '../../types/personnel';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import Spinner from '../../components/Spinner';

const ProfileDisplay: FC<{ profile: ProfileState, onEdit: () => void }> = ({ profile, onEdit }) => (
    <>
        <h2 className="text-3xl font-bold text-gray-800">{profile.prenom} {profile.nom}</h2>
        <p className="text-md text-purple-600 font-semibold mb-6">{profile.role}</p>
        <div className="space-y-3 text-gray-700 border-t pt-4">
            <div className="flex"><strong className="w-24 shrink-0">Email:</strong><span>{profile.email}</span></div>
            <div className="flex"><strong className="w-24 shrink-0">Téléphone:</strong><span>{profile.telephone || 'Non spécifié'}</span></div>
        </div>
        <div className="mt-8">
            <Button onClick={onEdit} leftIcon={<FiEdit3/>}>Modifier le Profil</Button>
        </div>
    </>
);

const ProfileForm: FC<{
    tempProfile: ProfileState;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveChanges: () => void;
    onCancel: () => void;
    isLoading: boolean;
}> = ({ tempProfile, onInputChange, onSaveChanges, onCancel, isLoading }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSaveChanges(); }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Prénom" name="prenom" value={tempProfile.prenom} onChange={onInputChange} required/>
            <Input label="Nom" name="nom" value={tempProfile.nom} onChange={onInputChange} required/>
        </div>
        <Input label="Email" type="email" name="email" value={tempProfile.email} onChange={onInputChange} required/>
        <Input label="Téléphone" type="tel" name="telephone" value={tempProfile.telephone} onChange={onInputChange} />
        <div className="flex space-x-3 pt-4">
            <Button type="submit" loading={isLoading}>
                <FiSave className="mr-2"/> Enregistrer
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        </div>
    </form>
);

const ProfilPage: React.FC = () => {
    const { user: contextUser } = useAuthContext();
    const [profile, setProfile] = useState<ProfileState | null>(null);
    const [tempProfile, setTempProfile] = useState<ProfileState | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (contextUser) {
            const nameParts = contextUser.name.split(' ');
            const prenom = nameParts.shift() || '';
            const nom = nameParts.join(' ');

            const initialProfile: ProfileState = {
                nom,
                prenom,
                email: contextUser.email,
                role: contextUser.roleLabel,
                telephone: contextUser.telephone || '', 
                avatarUrl: contextUser.avatarUrl || `https://ui-avatars.com/api/?name=${contextUser.name.replace(' ', '+')}&background=8B5CF6&color=fff&size=128`,
            };
            setProfile(initialProfile);
            setTempProfile(initialProfile);
        }
    }, [contextUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!tempProfile) return;
        setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    };
    
    const handleSaveChanges = async () => {
        if (!tempProfile) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfile(tempProfile);
        setIsEditing(false);
        setIsLoading(false);
        alert('Profil mis à jour avec succès !');
    };

    if (!profile) {
        return <><div className="flex justify-center p-20"><Spinner size="lg" /></div></>;
    }
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiUser className="text-white text-2xl" /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
                        <p className="text-gray-600">Gérez vos informations personnelles et vos paramètres.</p>
                    </div>
                </div>

                <Card>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1 flex flex-col items-center">
                             <img src={profile.avatarUrl} alt="Avatar" className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white mb-4"/>
                             {isEditing && (
                                <label htmlFor="avatar-upload" className="cursor-pointer">
                                     <Button variant="secondary" size="sm" leftIcon={<FiCamera/>}>Changer la photo</Button>
                                     <input id="avatar-upload" type="file" className="sr-only"/>
                                 </label>
                             )}
                        </div>
                        <div className="md:col-span-2 text-center md:text-left">
                             {!isEditing ? (
                                <ProfileDisplay profile={profile} onEdit={() => setIsEditing(true)}/>
                             ) : (
                                <ProfileForm 
                                    tempProfile={tempProfile!} 
                                    onInputChange={handleInputChange}
                                    onSaveChanges={handleSaveChanges} 
                                    onCancel={() => setIsEditing(false)}
                                    isLoading={isLoading}
                                />
                             )}
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ProfilPage;