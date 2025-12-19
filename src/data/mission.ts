import type { CreationMission } from '@/types/types';

export const creationMissionData: CreationMission = {
  profile_searched: {
    label: 'Profil recherché',
    name: 'profile_searched',
    required: 'true',
  },
  job_title: {
    label: 'Intitulé de poste',
    name: 'job_title',
    required: 'true',
  },
  job_title_other: {
    label: "Précisez l'intitulé de la mission",
    name: 'job_title_other',
    required: 'depends',
  },
  post_type: { label: 'Type de poste', name: 'post_type', required: 'false' },
  sector: { label: "Secteur d'activité", name: 'sector', required: 'false' },
  sector_other: {
    label: "Précisez le secteur d'activité",
    name: 'sector_other',
    required: 'depends',
  },
  sector_energy: {
    label: "Secteur d'énergie",
    name: 'sector_energy',
    required: 'depends',
  },
  sector_renewable_energy: {
    label: "Secteur d'énergie renouvelable",
    name: 'sector_renewable_energy',
    required: 'depends',
  },
  sector_infrastructure: {
    label: "Secteur d'infrastructure",
    name: 'sector_infrastructure',
    required: 'depends',
  },
  sector_infrastructure_other: {
    label: 'Précisez votre infrastructure',
    name: 'sector_infrastructure_other',
    required: 'depends',
  },
  sector_renewable_energy_other: {
    label: 'Précisez votre énergie renouvelable',
    name: 'sector_renewable_energy_other',
    required: 'depends',
  },
  sector_waste_treatment: {
    label: 'Secteur de traitement des déchets',
    name: 'sector_waste_treatment',
    required: 'depends',
  },
  specialties: { label: 'Spécialités', name: 'specialties', required: 'false' },
  specialties_other: {
    label: 'Précisez la spécialité',
    name: 'specialties_other',
    required: 'depends',
  },
  expertises: { label: 'Expertises', name: 'expertises', required: 'false' },
  expertises_other: {
    label: "Précisez l'expertise",
    name: 'expertises_other',
    required: 'depends',
  },
  diplomas: { label: 'Diplômes', name: 'diplomas', required: 'false' },
  diplomas_other: {
    label: 'Précisez le diplôme',
    name: 'diplomas_other',
    required: 'depends',
  },
  languages: { label: 'Langues', name: 'languages', required: 'false' },
  languages_other: {
    label: 'Précisez la langue',
    name: 'languages_other',
    required: 'depends',
  },
  tjm: { label: 'TJM cible MAX', name: 'tjm', required: 'false' },
  open_to_disabled: {
    label: 'Ouvert aux travailleurs en situation de handicap',
    name: 'open_to_disabled',
    required: 'false',
  },
  start_date: {
    label: 'Date de début de mission prévisionnelle',
    name: 'start_date',
    required: 'false',
  },
  end_date: {
    label: 'Date de fin de mission prévisionnelle',
    name: 'end_date',
    required: 'false',
  },
  deadline_application: {
    label: 'Date limite de remise des candidatures',
    name: 'deadline_application',
    required: 'false',
  },
  street_number: {
    label: 'N° de rue',
    name: 'street_number',
    required: 'false',
  },
  address: { label: 'Adresse postale', name: 'address', required: 'false' },
  city: { label: 'Ville', name: 'city', required: 'false' },
  postal_code: { label: 'Code postal', name: 'postal_code', required: 'false' },
  country: { label: 'Pays', name: 'country', required: 'false' },
  needed: {
    label: 'Descriptif du besoin (détaillez votre besoin en quelques lignes)',
    name: 'needed',
    required: 'false',
  },
  description: {
    label: 'Descriptif du poste (Brief complet de votre recherche)',
    name: 'description',
    required: 'false',
  },
  advantages_company: {
    label: "Les + de l'entreprise",
    name: 'advantages_company',
    required: 'false',
  },
  referent_name: {
    label: 'Nom du référent de mission',
    name: 'referent_name',
    required: 'false',
  },
  referent_mail: {
    label: 'Mail du référent de mission',
    name: 'referent_mail',
    required: 'false',
  },
  referent_mobile: {
    label: 'Téléphone mobile du référent de mission',
    name: 'referent_mobile',
    required: 'false',
  },
  referent_fix: {
    label: 'Téléphone fixe du référent de mission',
    name: 'referent_fix',
    required: 'false',
  },
  created_by: {
    label: "N° d'identification du fournisseur",
    name: 'created_by',
    required: 'true',
  },
};
