// src/page/gerant/GerantBonsCommandePage.tsx
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { format, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { FiPlusCircle, FiTrash2, FiSave, FiPackage, FiUser, FiShoppingCart, FiFileText } from 'react-icons/fi';
import type { Fournisseur, ProduitSimple, LigneBonCommande, BonCommandeData } from '../../types/achats';

// Import de l'écosystème
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';

// Import de nos composants UI réutilisables
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Alert } from '../../components/ui/Alert';


// --- Données Mock (inchangées) ---
const dummyFournisseurs: Fournisseur[] = [
  { id: 'F001', nom: 'TotalEnergies Distribution', email: 'commandes@total.com' },
  { id: 'F002', nom: 'Oilibya Petroleum', email: 'sales@oilibya.biz' },
  { id: 'F003', nom: 'Grossiste Lubrifiants Express', email: 'contact@lubexpress.com' },
  { id: 'F004', nom: 'Centrale Achat Boutique', email: 'achats@centraleboutique.net' },
];

const dummyProduits: ProduitSimple[] = [
  { id: 'CARB_SP95', nom: 'Essence SP95', type: 'carburant', uniteMesure: 'L', prixAchatDefault: 680 },
  { id: 'CARB_DIESEL', nom: 'Diesel', type: 'carburant', uniteMesure: 'L', prixAchatDefault: 650 },
  { id: 'LUB_10W40', nom: 'Huile Moteur 10W40 (5L)', type: 'lubrifiant', uniteMesure: 'Bidon', prixAchatDefault: 12500 },
  { id: 'BOUT_EAU', nom: 'Eau Minérale 1.5L', type: 'boutique', uniteMesure: 'Pack de 6', prixAchatDefault: 1200 },
];

const initialBCState = (): BonCommandeData => ({
    fournisseurId: '',
    dateCommande: format(new Date(), 'yyyy-MM-dd'),
    dateLivraisonSouhaitee: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    numeroBC: `BC-${Date.now().toString().slice(-6)}`,
    lignes: [],
    statut: 'brouillon',
    notes: '',
    totalHT: 0
});

// --- SOUS-COMPOSANTS POUR UNE MEILLEURE STRUCTURE ---

// Section Informations Générales
const InfoGeneraleBC: FC<{
    bcData: BonCommandeData;
    fournisseurs: Fournisseur[];
    handleInputChange: (e: React.ChangeEvent<any>) => void;
}> = ({ bcData, fournisseurs, handleInputChange }) => (
    <Card title="Informations Générales" icon={FiUser}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Select
                label="Fournisseur" required
                name="fournisseurId"
                value={bcData.fournisseurId}
                onChange={handleInputChange}
                options={[
                    { value: '', label: '-- Sélectionner --', disabled: true },
                    ...fournisseurs.map(f => ({ value: f.id, label: f.nom }))
                ]}
            />
            <Input label="N° Bon de Commande" name="numeroBC" value={bcData.numeroBC} onChange={handleInputChange} placeholder="Ex: BC-2024-001" />
            <Input label="Date Commande" type="date" name="dateCommande" value={bcData.dateCommande} onChange={handleInputChange} required />
            <Input label="Date Livraison Souhaitée" type="date" name="dateLivraisonSouhaitee" value={bcData.dateLivraisonSouhaitee || ''} onChange={handleInputChange} />
            <div className="md:col-span-2 lg:col-span-3">
                 <Textarea label="Notes Générales" name="notes" value={bcData.notes || ''} onChange={handleInputChange} rows={3} placeholder="Conditions spéciales, contact, etc." />
            </div>
        </div>
    </Card>
);


// Section des Lignes d'Articles
const LignesArticlesBC: FC<{
    lignes: LigneBonCommande[];
    produitsDisponibles: ProduitSimple[];
    handleProduitSelectChange: (id: string, prodId: string) => void;
    handleLigneChange: (id: string, field: keyof LigneBonCommande, value: string) => void;
    ajouterLigne: () => void;
    supprimerLigne: (id: string) => void;
}> = ({ lignes, produitsDisponibles, handleProduitSelectChange, handleLigneChange, ajouterLigne, supprimerLigne }) => (
    <Card title="Articles Commandés" icon={FiPackage} headerContent={<span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{lignes.length} article{lignes.length > 1 ? 's' : ''}</span>}>
        <div className="p-6">
            {lignes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <FiPackage className="mx-auto text-gray-400 text-5xl mb-4" />
                    <h3 className="text-gray-600 text-lg font-medium mb-2">Aucun article</h3>
                    <p className="text-gray-500">Cliquez sur le bouton ci-dessous pour commencer.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {lignes.map(ligne => (
                        <div key={ligne.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-start">
                                <div className="col-span-12 sm:col-span-4">
                                    <Select variant="compact" label="Produit" required value={ligne.produitId} onChange={(e) => handleProduitSelectChange(ligne.id, e.target.value)} options={[ { value: '', label: 'Choisir...', disabled: true }, ...produitsDisponibles.map(p => ({ value: p.id, label: p.nom })) ]}/>
                                </div>
                                <div className="col-span-6 sm:col-span-2">
                                    <Input variant="compact" label="Quantité" required type="number" value={ligne.quantite} onChange={e => handleLigneChange(ligne.id, 'quantite', e.target.value)} min="0.01" step="0.01" />
                                </div>
                                <div className="col-span-6 sm:col-span-2">
                                    <Input variant="compact" label="Unité" value={ligne.unite} readOnly disabled/>
                                </div>
                                <div className="col-span-6 sm:col-span-2">
                                    <Input variant="compact" label="P.U. HT" required type="number" value={ligne.prixUnitaireHT} onChange={e => handleLigneChange(ligne.id, 'prixUnitaireHT', e.target.value)} min="0" step="0.01" />
                                </div>
                                <div className="col-span-6 sm:col-span-1">
                                     <Input variant="compact" label="Montant" value={`${(ligne.montantLigneHT || 0).toLocaleString()}`} readOnly disabled/>
                                </div>
                                <div className="col-span-12 sm:col-span-1 flex items-end justify-end sm:justify-center h-full">
                                    <Button variant="ghost" size="sm" onClick={() => supprimerLigne(ligne.id)} title="Supprimer">
                                        <FiTrash2 className="h-4 w-4 text-red-500"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6 text-center">
                <Button variant="secondary" onClick={ajouterLigne} leftIcon={<FiPlusCircle/>}>Ajouter un Article</Button>
            </div>
        </div>
    </Card>
);

// Section de récapitulatif
const RecapitulatifBC: FC<{
    totalHT: number;
    isSubmitting: boolean;
}> = ({ totalHT, isSubmitting }) => (
    <Card title="Récapitulatif & Actions" icon={FiFileText}>
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600 mb-2">Total de la commande (HT):</p>
                  <div className="bg-purple-100 p-4 rounded-xl">
                    <p className="text-3xl font-bold text-purple-700">
                      {totalHT.toLocaleString('fr-FR')} <span className="text-lg">XAF</span>
                    </p>
                  </div>
                </div>
            <Button type="submit" size="lg" variant="primary" loading={isSubmitting} leftIcon={<FiSave/>}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer le Bon de Commande"}
            </Button>
        </div>
    </Card>
);


// --- Composant Principal de la Page ---
const GerantBonsCommandePage: React.FC = () => {
    const [bcData, setBcData] = useState<BonCommandeData>(initialBCState());
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [produitsDisponibles, setProduitsDisponibles] = useState<ProduitSimple[]>([]);

    useEffect(() => {
        setFournisseurs(dummyFournisseurs);
        setProduitsDisponibles(dummyProduits);
        setIsLoading(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setBcData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSubmitStatus(null);
    };

    const handleLigneChange = (id: string, field: keyof LigneBonCommande, value: string) => {
        setBcData(prev => ({ ...prev,
            lignes: prev.lignes.map(l => {
                if (l.id !== id) return l;
                const updated = { ...l, [field]: value };
                if (field === 'quantite' || field === 'prixUnitaireHT') {
                    const qte = parseFloat(updated.quantite) || 0;
                    const pu = parseFloat(updated.prixUnitaireHT) || 0;
                    updated.montantLigneHT = parseFloat((qte * pu).toFixed(2));
                }
                return updated;
            })
        }));
        setSubmitStatus(null);
    };

    const handleProduitSelectChange = (ligneId: string, produitId: string) => {
        const p = produitsDisponibles.find(p => p.id === produitId);
        if (p) {
            setBcData(prev => ({ ...prev,
                lignes: prev.lignes.map(l => l.id !== ligneId ? l : { ...l,
                        produitId: p.id,
                        produitNom: p.nom,
                        unite: p.uniteMesure,
                        prixUnitaireHT: p.prixAchatDefault?.toString() || '0',
                        montantLigneHT: (parseFloat(l.quantite || '0') * (p.prixAchatDefault || 0))
                })
            }));
        }
    };
    
    const ajouterLigne = () => {
        setBcData(prev => ({ ...prev, lignes: [...prev.lignes, { id: uuidv4(), produitId: '', produitNom: '', quantite: '1', unite: '', prixUnitaireHT: '', montantLigneHT: 0 }]}));
        setSubmitStatus(null);
    };

    const supprimerLigne = (id: string) => {
        setBcData(prev => ({ ...prev, lignes: prev.lignes.filter(l => l.id !== id) }));
        setSubmitStatus(null);
    };

    const totalHTCommande = useMemo(() => bcData.lignes.reduce((sum, l) => sum + (l.montantLigneHT || 0), 0), [bcData.lignes]);

    const validateForm = () => {
        if (!bcData.fournisseurId) return "Veuillez sélectionner un fournisseur.";
        if (bcData.lignes.length === 0) return "Veuillez ajouter au moins un article.";
        for (const ligne of bcData.lignes) {
            if (!ligne.produitId || !ligne.quantite || !ligne.prixUnitaireHT || parseFloat(ligne.quantite) <= 0 || parseFloat(ligne.prixUnitaireHT) < 0) {
                return `Informations incomplètes ou incorrectes pour la ligne "${ligne.produitNom || 'Nouvel article'}".`;
            }
        }
        return null; // Pas d'erreur
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorMessage = validateForm();
        if (errorMessage) {
            setSubmitStatus({ type: 'error', message: errorMessage });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        console.log("Soumission du BC :", { ...bcData, totalHT: totalHTCommande });

        await new Promise(r => setTimeout(r, 1500));
        setIsSubmitting(false);
        setSubmitStatus({ type: 'success', message: `Bon de commande ${bcData.numeroBC} enregistré avec succès!` });
        setBcData(initialBCState());
    };

    if (isLoading) {
        return <DashboardLayout><div className="flex justify-center p-20"><Spinner size="lg" /></div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiShoppingCart className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Nouveau Bon de Commande</h1>
                        <p className="text-gray-600">Créez et envoyez vos commandes aux fournisseurs.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus && <Alert variant={submitStatus.type} title={submitStatus.type === 'success' ? "Succès" : "Erreur"} dismissible onDismiss={() => setSubmitStatus(null)}>{submitStatus.message}</Alert>}
                    
                    <InfoGeneraleBC bcData={bcData} fournisseurs={fournisseurs} handleInputChange={handleInputChange}/>

                    <LignesArticlesBC 
                        lignes={bcData.lignes}
                        produitsDisponibles={produitsDisponibles}
                        handleLigneChange={handleLigneChange}
                        handleProduitSelectChange={handleProduitSelectChange}
                        ajouterLigne={ajouterLigne}
                        supprimerLigne={supprimerLigne}
                    />

                    <RecapitulatifBC totalHT={totalHTCommande} isSubmitting={isSubmitting} />
                </form>
            </div>
        </DashboardLayout>
    );
};

export default GerantBonsCommandePage;