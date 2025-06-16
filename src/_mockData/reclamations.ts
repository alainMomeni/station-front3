import { format, subDays } from 'date-fns';
import type { ReclamationClient } from '../types/reclamations';

export const typeReclamationOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'qualite_carburant', label: 'Qualité Carburant' },
    { value: 'erreur_paiement', label: 'Erreur de Paiement' },
    { value: 'service_client', label: 'Service Client' },
    { value: 'equipement', label: 'Équipement Station' },
    { value: 'produit_boutique', label: 'Produit Boutique' },
    { value: 'autre', label: 'Autre' }
];

export const statutReclamationOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'nouvelle', label: 'Nouvelle' },
    { value: 'en_cours', label: 'En Cours' },
    { value: 'en_attente_client', label: 'En Attente Client' },
    { value: 'resolue', label: 'Résolue' },
    { value: 'cloturee', label: 'Clôturée' },
    { value: 'rejetee', label: 'Rejetée' }
];

export const dummyReclamationsData: ReclamationClient[] = [
    {
        id: 'REC-20240115-001',
        dateSoumission: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
        nomClient: 'Transport Express Plus',
        contactClientEmail: 'contact@transportexpress.com',
        contactClientTelephone: '+237 677 123 456',
        typeReclamation: 'qualite_carburant',
        descriptionDetaillee: 'Problème de qualité du carburant livré ce matin',
        priorite: 'haute',
        statut: 'en_cours',
        assigneANom: 'Chef de Piste',
        historiqueActions: [
            {
                id: '1',
                dateAction: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
                auteurNom: 'Système',
                actionEffectuee: 'Réclamation créée',
                nouveauStatut: 'nouvelle'
            },
            {
                id: '2',
                dateAction: format(subDays(new Date(), 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
                auteurNom: 'Chef de Piste',
                actionEffectuee: 'Prise en charge - Échantillons prélevés pour analyse',
                ancienStatut: 'nouvelle',
                nouveauStatut: 'en_cours'
            }
        ]
    },
    {
        id: 'REC-20240110-002',
        dateSoumission: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss'),
        nomClient: 'M. Diallo Ibrahim',
        typeReclamation: 'service_client',
        descriptionDetaillee: 'Temps d\'attente excessif à la pompe',
        priorite: 'moyenne',
        statut: 'resolue',
        assigneANom: 'Responsable Service Client',
        solutionApportee: 'Formation supplémentaire du personnel effectuée',
        dateCloture: format(subDays(new Date(), 8), 'yyyy-MM-dd\'T\'HH:mm:ss'),
        historiqueActions: [
            {
                id: '3',
                dateAction: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss'),
                auteurNom: 'Système',
                actionEffectuee: 'Réclamation créée',
                nouveauStatut: 'nouvelle'
            }
        ]
    }
];