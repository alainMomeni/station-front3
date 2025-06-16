// src/page/gerant/GerantSuiviLivraisonsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { FiTruck } from 'react-icons/fi';
import type { BonCommandeData, LigneBonCommande, InfoLivraison } from '../../types/achats';

// Import de nos composants UI au lieu d'éléments HTML bruts
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Card } from '../../components/ui/Card'; // Changed to named import
import LivraisonList from '../../components/suivi-livraisons/LivraisonList';
import ReceptionForm from '../../components/suivi-livraisons/ReceptionForm';
import { Select, Input, Alert } from '../../components/ui';
import { generateDummyBonsDeCommande } from '../../_mockData/livraisons';

const GerantSuiviLivraisonsPage: React.FC = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState<BonCommandeData[]>([]);
  const [selectedBC, setSelectedBC] = useState<BonCommandeData | null>(null);
  const [infoLivraison, setInfoLivraison] = useState<InfoLivraison>({ numeroBL: '', dateReception: format(new Date(), 'yyyy-MM-dd'), notes: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<'attente' | 'partiel' | 'livre' | 'tous'>('attente');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setBonsDeCommande(generateDummyBonsDeCommande());
      setIsLoading(false);
    }, 700);
  }, []);
  
  useEffect(() => { setCurrentPage(1); }, [filtreStatut, itemsPerPage, searchTerm]);

  // Fix the filteredBC useMemo hook
  const filteredBC = useMemo(() => {
    // Guard against empty or undefined array
    if (!Array.isArray(bonsDeCommande) || !bonsDeCommande.length) return [];
    
    // Filter out any null/undefined items first
    let filtered = bonsDeCommande.filter(bc => bc && bc.statut); 
    
    const statusMap = { 
      'attente': 'soumis', 
      'partiel': 'partiellement_livre', 
      'livre': 'livre' 
    } as const;

    if (filtreStatut !== 'tous') {
      filtered = filtered.filter(bc => bc.statut === statusMap[filtreStatut]);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(bc => 
        bc.numeroBC?.toLowerCase().includes(searchLower) || 
        bc.fournisseurNom?.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()
    );
  }, [bonsDeCommande, filtreStatut, searchTerm]);

  const totalItems = filteredBC.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Add null check for currentItems
  const currentItems = useMemo(() => {
    if (!Array.isArray(filteredBC)) return [];
    return filteredBC.slice(startIndex, Math.min(startIndex + itemsPerPage, filteredBC.length));
  }, [filteredBC, startIndex, itemsPerPage]);

  const handleSelectBC = (bc: BonCommandeData) => {
    setSelectedBC(bc);
    // Logique simplifiée pour les infos de livraison existantes ou nouvelles
    setInfoLivraison({ numeroBL: bc.numeroBLFournisseur || '', dateReception: bc.dateReceptionEffective || format(new Date(), 'yyyy-MM-dd'), notes: bc.notesLivraisonGlobale || '' });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleLigneReceptionChange = (ligneId: string, field: keyof LigneBonCommande, value: string) => {
    setSelectedBC(prev => prev && { ...prev, lignes: prev.lignes.map(l => l.id === ligneId ? { ...l, [field]: value } : l) });
  };
  
  const handleInfoLivraisonChange = (field: keyof InfoLivraison, value: string) => {
    setInfoLivraison(prev => ({ ...prev, [field]: value }));
  };

  const handleValiderLivraison = async (validationType: 'partielle' | 'complete') => {
    if (!selectedBC) return;
    if (!infoLivraison.numeroBL?.trim() || !infoLivraison.dateReception) { setMessage({type:'error', text: "Le N° de Bon de Livraison et la Date de Réception sont requis."}); return; }

    setIsProcessing(true); setMessage(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const statutFinal = validationType === 'complete' ? 'livre' as const : 'partiellement_livre' as const;
    const updatedBC = { ...selectedBC, statut: statutFinal, numeroBLFournisseur: infoLivraison.numeroBL, dateReceptionEffective: infoLivraison.dateReception, notesLivraisonGlobale: infoLivraison.notes };
    setBonsDeCommande(prev => prev.map(bc => bc.id === selectedBC.id ? updatedBC : bc));
    setSelectedBC(null); 
    setMessage({type: 'success', text: `Livraison pour le BC ${selectedBC.numeroBC} validée avec succès. Les stocks ont été mis à jour.`}); 
    setIsProcessing(false);
  };
  
  if (selectedBC) {
    return (
        <DashboardLayout>
            <ReceptionForm bonDeCommande={selectedBC} infoLivraison={infoLivraison} onValider={handleValiderLivraison} onUpdateLigne={handleLigneReceptionChange} onUpdateInfo={handleInfoLivraisonChange} onAnnuler={() => setSelectedBC(null)} isProcessing={isProcessing} />
        </DashboardLayout>
    );
  }

  const titreCarte = `Bons de Commande - ${{'attente': 'En Attente', 'partiel': 'Partiellement Reçus', 'livre': 'Terminés', 'tous': 'Tous'}[filtreStatut]}`;

  const filtreStatutOptions = [
      { value: 'attente', label: `Attendues (${bonsDeCommande.filter(bc => bc.statut === 'soumis').length})` },
      { value: 'partiel', label: `Partiellement Reçues (${bonsDeCommande.filter(bc => bc.statut === 'partiellement_livre').length})` },
      { value: 'livre', label: `Terminées (${bonsDeCommande.filter(bc => bc.statut === 'livre').length})` },
      { value: 'tous', label: `Toutes (${bonsDeCommande.length})` },
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg mr-4">
            <FiTruck className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Suivi des Livraisons</h1>
            <p className="text-sm text-gray-600">Validez les réceptions et mettez à jour les stocks.</p>
          </div>
        </div>
        
        <Card title="Filtres et Recherche" icon={Search}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <Select label="Filtrer par statut" value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as any)} options={filtreStatutOptions} />
            <Input label="Rechercher" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="N° BC ou Fournisseur..." leftIcon={<Search className="h-4 w-4 text-gray-400"/>} />
          </div>
        </Card>
        
        {message && (
          <Alert variant={message.type} title={message.type === 'success' ? 'Succès' : 'Erreur'} dismissible onDismiss={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}
        
        {isLoading ? ( 
          <div className="p-12 flex justify-center"><Spinner /></div>
        ) : currentItems?.length > 0 ? (
          <Card title={titreCarte} icon={FiTruck}>
            <LivraisonList 
              bonsDeCommande={currentItems} 
              onSelectBC={handleSelectBC}
              paginationProps={{
                currentPage,
                totalPages,
                totalItems,
                itemsPerPage,
                onPageChange: setCurrentPage,
                onItemsPerPageChange: setItemsPerPage
              }}
            />
          </Card>
        ) : (
          <Card title="Aucun résultat" icon={FiTruck}>
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg font-medium mb-2">Aucune livraison ne correspond à vos filtres</p>
              <p className="text-gray-500 text-sm">Veuillez modifier vos critères de recherche ou attendre de nouvelles commandes.</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GerantSuiviLivraisonsPage;