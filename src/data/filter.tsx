import type { AdminOpinionValue } from '@/types/types';

export const sortDateOptions = [
  { label: 'Ancien', value: 'asc' },
  { label: 'Récent', value: 'desc' },
];

export const availabilityOptions = [
  { label: 'Disponible', value: 'available', color: '#92C6B0' },
  { label: 'Non disponible', value: 'unavailable', color: '#D64242' },
  { label: 'En mission', value: 'in_mission', color: '#faa200' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

export const cvOptions = [
  { label: 'OUI', value: 'yes', color: '#92C6B0' },
  { label: 'NON', value: 'no', color: '#D64242' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

export const adminOpinionOptions: {
  label: string;
  value: AdminOpinionValue;
  color: string;
}[] = [
  { label: 'Positif', value: 'positive', color: '#92C6B0' },
  { label: 'Neutre', value: 'neutral', color: '#F5B935' },
  { label: 'Négatif', value: 'negative', color: '#D64242' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

export const iamStatusOptions = [
  { label: 'Freelance', value: 'freelance' },
  { label: 'Société', value: 'company' },
  { label: 'Portage', value: 'portage' },
];
