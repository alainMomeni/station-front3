// src/page/gerant/GerantRelevesEntreprisesPage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiFileText, FiCalendar, FiPrinter, FiDownload, FiMail, FiPlayCircle, FiFilter } from 'react-icons/fi';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types et Données Mock (inchangés)
import type { ReleveCompteClient, LigneReleveClient } from '../../types/clients';
import { dummyClientsProData, fetchRelevePourClientEtPeriode } from '../../_mockData/releves';

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Table, type Column } from '../../components/ui/Table';
import { StatCard } from '../../components/ui/StatCard';


// --- Colonnes pour la Table ---
const getReleveColumns = (): Column<LigneReleveClient>[] => [
    { key: 'date', title: 'Date', dataIndex: 'date' },
    { key: 'desc', title: 'Description / Réf.', render: (_, l) => (
        <div>
            <span>{l.description}</span>
            {l.reference && <span className="block text-xs text-gray-400">Réf: {l.reference}</span>}
        </div>
    )},
    { key: 'debit', title: 'Débit (Achats)', align: 'right', render: (_, l) => l.debit !== undefined ? <span className="text-red-600">{l.debit.toLocaleString()} XAF</span> : '-' },
    { key: 'credit', title: 'Crédit (Paiements)', align: 'right', render: (_, l) => l.credit !== undefined ? <span className="text-green-600">{l.credit.toLocaleString()} XAF</span> : '-' },
    { key: 'solde', title: 'Solde Progressif', align: 'right', render: (_, l) => <span className="font-semibold">{l.soldeProgressif.toLocaleString()} XAF</span> },
];

// --- Page Principale ---
const GerantRelevesEntreprisesPage: React.FC = () => {
    // États
    const [selectedClientId, setSelectedClientId] = useState<string>(dummyClientsProData[0]?.id || '');
    const [dateDebut, setDateDebut] = useState(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
    const [dateFin, setDateFin] = useState(format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
    
    const [releveGenere, setReleveGenere] = useState<ReleveCompteClient | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handlers
    const handleGenererReleve = async () => {
        if (!selectedClientId || !dateDebut || !dateFin) { setError("Veuillez sélectionner un client et une période."); return; }
        setIsGenerating(true); setError(null); setReleveGenere(null);
        try {
            const resultat = await fetchRelevePourClientEtPeriode(selectedClientId, dateDebut, dateFin);
            setReleveGenere(resultat);
        } catch (err) { setError("Erreur lors de la génération du relevé."); }
        setIsGenerating(false);
    };
    
    // ... autres handlers pour impression, pdf, email

    const tableColumns = getReleveColumns();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiFileText className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Relevés de Compte Entreprise</h1>
                        <p className="text-gray-600">Générez et consultez les relevés de compte pour vos clients professionnels.</p>
                    </div>
                </div>

                {error && <Alert variant="error" title="Erreur de configuration" dismissible onDismiss={() => setError(null)}>{error}</Alert>}
                
                <Card icon={FiFilter} title="Critères du Relevé">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <Select label="Client Entreprise" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} options={dummyClientsProData.map(c => ({ value: c.id, label: c.nomEntreprise || '' }))} />
                        <Input type="date" label="Date de début" value={dateDebut} onChange={e => setDateDebut(e.target.value)} rightIcon={<FiCalendar />} />
                        <Input type="date" label="Date de fin" value={dateFin} onChange={e => setDateFin(e.target.value)} rightIcon={<FiCalendar />} />
                        <Button onClick={handleGenererReleve} loading={isGenerating} leftIcon={<FiPlayCircle />}>Générer Relevé</Button>
                    </div>
                </Card>
                
                {isGenerating ? (
                    <Card><div className="flex flex-col items-center justify-center p-20"><Spinner size="lg" /><p className="mt-4">Génération en cours...</p></div></Card>
                ) : releveGenere ? (
                    <div className="space-y-6 animate-fadeIn">
                        <Card title={`Relevé pour ${releveGenere.clientNom}`} icon={FiFileText} headerContent={
                             <div className="flex space-x-2">
                                <Button variant="secondary" size="sm" onClick={() => alert("Impression...")} leftIcon={<FiPrinter />}>Imprimer</Button>
                                <Button variant="secondary" size="sm" onClick={() => alert("Téléchargement PDF...")} leftIcon={<FiDownload />}>PDF</Button>
                                <Button variant="secondary" size="sm" onClick={() => alert(`Envoi à ${releveGenere.clientEmail}`)} leftIcon={<FiMail />}>Email</Button>
                             </div>
                        }>
                             <div className="p-6 space-y-6">
                                <p className="text-sm text-gray-500 italic">Période du {format(parseISO(releveGenere.periodeDebut), 'dd MMMM yyyy', {locale:fr})} au {format(parseISO(releveGenere.periodeFin), 'dd MMMM yyyy', {locale:fr})}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <StatCard variant="neutral" icon={FiCalendar} title="Solde Initial" value={releveGenere.soldeInitialPeriode.toLocaleString()} unit="XAF"/>
                                    <StatCard variant="primary" icon={FiCalendar} title="Solde Final" value={releveGenere.soldeFinalPeriode.toLocaleString()} unit="XAF"/>
                                </div>

                                 <Table<LigneReleveClient>
                                    columns={tableColumns}
                                    data={releveGenere.lignes}
                                    emptyText="Aucune transaction ou paiement pour cette période."
                                />

                                {releveGenere.notesBasDePage && (
                                    <Alert variant="info" title="Notes">{releveGenere.notesBasDePage}</Alert>
                                )}
                            </div>
                        </Card>
                    </div>
                ) : (
                    <Card><div className="text-center p-12 text-gray-500"><p>Sélectionnez un client et une période pour générer un relevé.</p></div></Card>
                )}

            </div>
        </DashboardLayout>
    );
};

export default GerantRelevesEntreprisesPage;