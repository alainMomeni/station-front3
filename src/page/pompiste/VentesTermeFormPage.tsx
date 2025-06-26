// src/page/pompiste/VentesTermeFormPage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiUser, FiDollarSign } from 'react-icons/fi';

// Écosystème et UI Kit
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { StatCard } from '../../components/ui/StatCard';

// Types et Données Mock (correctement importés)
import type { VenteTermeFormData } from '../../types/ventes';
import { produitsCarburant, clientsDisponibles } from '../../_mockData/ventes';


const VentesTermeFormPage: React.FC = () => {
    const [formData, setFormData] = useState<VenteTermeFormData>({
        client: '', produit: '', quantite: '', prixUnitaire: '', montantTotal: '',
        dateEcheance: '', notes: '', pompiste: 'Natalya P.',
    });
    const [isSubmitting] = useState(false);
    
    // Logique pour mettre à jour les totaux (inchangée)
    useEffect(() => {
        const selectedProduit = produitsCarburant.find(p => p.id === formData.produit);
        const pu = selectedProduit?.prix || 0;
        const quantite = parseFloat(formData.quantite) || 0;
        const total = quantite * pu;

        setFormData((prev: any) => ({...prev,
            prixUnitaire: selectedProduit ? pu.toString() : '',
            montantTotal: total > 0 ? total.toFixed(0) : '0',
        }));
    }, [formData.produit, formData.quantite]);
    
    const handleChange = () => { /* ... */ };
    const handleSubmit = async () => { /* ... */ };

    return (
        <>
            <form id="form-vente-terme" onSubmit={handleSubmit} className="space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiFileText className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Nouvelle Vente à Terme</h1>
                            <p className="text-gray-600">Enregistrez une vente à crédit pour un client professionnel.</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3">
                         <Link to="/ventes/directes"><Button type="button" variant="secondary">Annuler</Button></Link>
                         <Button type="submit" form="form-vente-terme" loading={isSubmitting}>Enregistrer</Button>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Détails de la Vente à Terme" icon={FiFileText}>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <Select label="Client Professionnel*" name="client" value={formData.client} onChange={handleChange} required
                                    options={[{value:'', label:'-- Sélectionner un client --'}, ...clientsDisponibles.map((c: { id: any; nom: any; }) => ({value: c.id, label:c.nom}))]} />
                                 <Input label="Date d'Échéance*" type="date" name="dateEcheance" value={formData.dateEcheance} onChange={handleChange} required/>
                                 <Select label="Carburant / Produit*" name="produit" value={formData.produit} onChange={handleChange} required
                                    options={[{value:'', label:'-- Sélectionner --'}, ...produitsCarburant.map(p => ({value: p.id, label:p.nom}))]} />
                                 <Input label="Quantité*" type="number" name="quantite" value={formData.quantite} onChange={handleChange} placeholder="ex: 100" min="0.01" step="0.01" required />
                                 <Input label="Prix Unitaire (XAF)" name="prixUnitaire" value={formData.prixUnitaire} readOnly disabled/>
                                 <Input label="Pompiste Initiateur" name="pompiste" value={formData.pompiste} leftIcon={<FiUser/>} readOnly disabled/>
                            </div>
                        </Card>
                         <Card title="Notes Additionnelles" icon={FiDollarSign /* Ou une autre icone */}>
                             <div className="p-6">
                                <Textarea label="Notes (Optionnel)" name="notes" value={formData.notes || ''} onChange={handleChange} rows={4} placeholder="Référence Bon de Commande client, instructions spéciales..." />
                             </div>
                        </Card>
                    </div>

                     <div className="lg:col-span-1">
                         <StatCard 
                            variant="success" 
                            icon={FiDollarSign}
                            title="Montant Total"
                            value={(parseFloat(formData.montantTotal) || 0).toLocaleString()}
                            unit="XAF"
                            className="h-full sticky top-24" // Effet "sticky" pour qu'elle reste visible au scroll
                         />
                    </div>
                </div>
            </form>
        </>
    );
};

export default VentesTermeFormPage;