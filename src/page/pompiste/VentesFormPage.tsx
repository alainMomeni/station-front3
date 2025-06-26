
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMapPin, FiDollarSign } from 'react-icons/fi';

// Écosystème et UI Kit
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatCard } from '../../components/ui/StatCard';

// Types et Données Mock (inchangés)
import type { VenteDirectePompisteFormData } from '../../types/ventes';
import { produitsCarburant } from '../../_mockData/ventes';


const VentesFormPage: React.FC = () => {
    const [formData, setFormData] = useState<VenteDirectePompisteFormData>({
        produit: '', quantite: '', prixUnitaire: '', montantTotal: '',
        modePaiement: 'especes', pompe: '', client: '', remise: '', pompiste: 'Natalya P.',
    });
    const [isSubmitting] = useState(false);
    
    // Logique pour mettre à jour les totaux (inchangée, mais on pourrait la mettre dans un useMemo)
    useEffect(() => {
        const selectedProduit = produitsCarburant.find((p: { id: any; }) => p.id === formData.produit);
        const pu = selectedProduit?.prix || 0;
        const quantite = parseFloat(formData.quantite) || 0;
        const remise = parseFloat(formData.remise || '0') || 0;
        const totalNet = (quantite * pu) - remise;

        setFormData((prev: any) => ({ ...prev,
            prixUnitaire: selectedProduit ? pu.toString() : '',
            montantTotal: totalNet >= 0 ? totalNet.toFixed(0) : '0',
        }));
    }, [formData.produit, formData.quantite, formData.remise]);

    const handleChange = () => { /*...*/ };
    const handleSubmit = async () => { /*...*/ };

    const modePaiementOptions = [
        {value: 'especes', label: 'Espèces'}, {value: 'carte', label: 'Carte Bancaire'}, {value: 'mobile_money', label: 'Mobile Money'}
    ];

    return (
        <>
            <form id="form-nouvelle-vente" onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiShoppingCart className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Nouvelle Vente Directe</h1>
                            <p className="text-gray-600">Enregistrez une nouvelle transaction de carburant ou de boutique.</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3">
                         <Link to="/ventes/directes"><Button type="button" variant="secondary">Annuler</Button></Link>
                         <Button type="submit" form="form-nouvelle-vente" loading={isSubmitting}>Enregistrer Vente</Button>
                     </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne Gauche: Détails Vente */}
                    <div className="lg:col-span-2 space-y-6">
                         <Card title="Détails de la Vente" icon={FiShoppingCart}>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select label="Carburant / Produit*" name="produit" value={formData.produit} onChange={handleChange} options={[{value:'', label:'-- Sélectionner --'}, ...produitsCarburant.map((p: { id: any; nom: any; }) => ({value: p.id, label:p.nom}))]} required/>
                                <Input label="Quantité*" type="number" name="quantite" value={formData.quantite} onChange={handleChange} placeholder="ex: 20" min="0.01" step="0.01" required/>
                                <Input label="Prix Unitaire (XAF)" name="prixUnitaire" value={formData.prixUnitaire} readOnly disabled/>
                                <Input label="Remise (XAF)" type="number" name="remise" value={formData.remise || ''} onChange={handleChange} placeholder="0"/>
                                <Select label="Mode de Paiement*" name="modePaiement" value={formData.modePaiement} onChange={handleChange} options={modePaiementOptions} required/>
                                <Input label="Client (Optionnel)" name="client" value={formData.client || ''} onChange={handleChange} placeholder="Nom ou référence du client"/>
                            </div>
                         </Card>
                         <Card title="Informations Opérationnelles" icon={FiMapPin}>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                               <Input label="N° Pompe*" name="pompe" value={formData.pompe} onChange={handleChange} placeholder="Ex: P01" required/>
                               <Input label="Pompiste" name="pompiste" value={formData.pompiste} leftIcon={<FiUser/>} readOnly disabled/>
                            </div>
                        </Card>
                    </div>

                    {/* Colonne Droite: Total */}
                    <div className="lg:col-span-1">
                         <StatCard 
                            variant="success" 
                            icon={FiDollarSign}
                            title="Total à Payer"
                            value={(parseFloat(formData.montantTotal) || 0).toLocaleString()}
                            unit="XAF"
                            className="h-full"
                         />
                    </div>
                </div>
            </form>
        </>
    );
};

export default VentesFormPage;