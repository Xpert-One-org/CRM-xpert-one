import type { DBRevenuType, ReasonMissionDeletion } from '@/types/typesDb';

export const genres = [
  {
    label: 'Madame',
    value: 'mrs',
  },
  {
    label: 'Monsieur',
    value: 'mr',
  },
  {
    label: 'Non genré',
    value: 'ng',
  },
];

export const signupSelect = [
  { label: 'Une ENTREPRISE qui dépose une mission ', value: 'company' },
  { label: 'Un XPERT qui recherche une mission', value: 'xpert' },
  {
    label: 'Un ÉTUDIANT qui recherche un stage ou un apprentissage',
    value: 'student_apprentice',
  },
];

export const roleSelect = [
  {
    label: 'Administateur',
    value: 'admin',
  },
  {
    label: 'Entreprise',
    value: 'company',
  },
  {
    label: 'Xpert',
    value: 'xpert',
  },
];

export const how = [
  {
    label: 'Appel',
    value: 'call',
  },

  {
    label: 'Bouche à oreille',
    value: 'mouth',
  },
  {
    label: 'Mail',
    value: 'mail',
  },
  {
    label: 'Web',
    value: 'web',
  },
  {
    label: 'Un Xpert',
    value: 'xpert',
  },
];

export const postTypesSelect = [
  {
    label: 'Chantier',
    value: 'chantier',
  },
  {
    label: 'Etude',
    value: 'etude',
  },
  {
    label: 'Exploitation',
    value: 'exploitation',
  },
  {
    label: 'Projets',
    value: 'projets',
  },
];

export const areaSelect = [
  {
    label: 'Europe',
    value: 'europe',
  },
  {
    label: 'France',
    value: 'france',
  },
  {
    label: 'International',
    value: 'international',
  },
];

export const franceSelect = [
  { label: 'France Métropolitaine', value: 'metropolitan_france' },
  { label: 'France Drom/Com', value: 'drom_com' },
  { label: 'Régions', value: 'regions' },
];

export const dureeSelect = [
  {
    label: '1 à 2 ans',
    value: '1-2',
  },
  {
    label: '3 à 5 ans',
    value: '3-5',
  },
  {
    label: '6 à 10 ans',
    value: '6-10',
  },
  {
    label: '10 ans +',
    value: '10+',
  },
];

export const booleanSelect = [
  {
    label: 'Non',
    value: 'false',
  },
  {
    label: 'Oui',
    value: 'true',
  },
];

export const howManyPeopleLedSelect = [
  {
    label: '0-3 personnes',
    value: '0-3',
  },

  {
    label: '4-6 personnes',
    value: '4-6',
  },
  {
    label: '7-10 personnes',
    value: '7-10',
  },
  {
    label: '10+ personnes',
    value: '10+',
  },
];

export const energySelect = [
  {
    label: 'Chauffage urbain',
    value: 'urban_heating',
  },
  {
    label: 'Chaufferie Bois',
    value: 'wood_boiler',
  },
  {
    label: 'Nucléaire',
    value: 'nuclear',
  },
  {
    label: 'Thermique',
    value: 'thermal',
  },
];

export const energyRenewableSelect = [
  {
    label: 'Biométhane',
    value: 'biomethane',
  },
  {
    label: 'Eolien',
    value: 'wind',
  },
  {
    label: 'Geothermie',
    value: 'geothermal',
  },
  {
    label: 'Solaire',
    value: 'solar',
  },
];

export const wasteTreatmentSelect = [
  {
    label: 'Biomasse',
    value: 'biomass',
  },
  {
    label: 'CSR',
    value: 'csr',
  },
  {
    label: 'Dangereux',
    value: 'dangerous',
  },
  {
    label: 'Ménagers',
    value: 'household',
  },
];

export const languageLevelSelect = [
  {
    label: 'Bilingue',
    value: 'bilingual',
  },
  {
    label: 'Courant',
    value: 'fluent',
  },
  {
    label: 'Débutant',
    value: 'beginner',
  },
  {
    label: 'Intermédiaire',
    value: 'intermediate',
  },
];

export const departmentSelect = [
  {
    label: 'Ain',
    value: '01',
  },
  {
    label: 'Aisne',
    value: '02',
  },
  {
    label: 'Allier',
    value: '03',
  },
  {
    label: 'Alpes-de-Haute-Provence',
    value: '04',
  },
  {
    label: 'Alpes-Maritimes',
    value: '06',
  },
  {
    label: 'Ardèche',
    value: '07',
  },
  {
    label: 'Ardennes',
    value: '08',
  },
  {
    label: 'Ariège',
    value: '09',
  },
  {
    label: 'Aube',
    value: '10',
  },
  {
    label: 'Aude',
    value: '11',
  },
  {
    label: 'Aveyron',
    value: '12',
  },
  {
    label: 'Bouches-du-Rhône',
    value: '13',
  },
  {
    label: 'Calvados',
    value: '14',
  },
  {
    label: 'Cantal',
    value: '15',
  },
  {
    label: 'Charente',
    value: '16',
  },
  {
    label: 'Charente-Maritime',
    value: '17',
  },
  {
    label: 'Cher',
    value: '18',
  },
  {
    label: 'Corrèze',
    value: '19',
  },
  {
    label: 'Corse-du-Sud',
    value: '2A',
  },
  {
    label: 'Haute-Corse',
    value: '2B',
  },
  {
    label: "Côte-d'Or",
    value: '21',
  },
  {
    label: "Côtes-d'Armor",
    value: '22',
  },
  {
    label: 'Creuse',
    value: '23',
  },
];

export const iamSelect = [
  {
    label: 'Étudiant / Apprenti',
    value: 'student_apprentice',
  },
  {
    label: 'Indépendant / Freelance',
    value: 'inde_freelance',
  },
  {
    label: 'Je ne sais pas encore',
    value: 'unknow',
  },
  {
    label: 'Salarié',
    value: 'employee',
  },
];

export const statusSelectInde = [
  {
    label: 'Auto-entrepreneur',
    value: 'auto-entrepreneur',
  },
  {
    label: 'CDI de mission',
    value: 'cdi_mission',
  },
  {
    label: 'En portage',
    value: 'portage',
  },
  {
    label: 'Entreprise',
    value: 'company',
  },
];

export const statusSelectEmployee = [
  {
    label: 'CDD',
    value: 'cdd',
  },
  {
    label: 'CDI',
    value: 'cdi',
  },
  {
    label: 'CDI de mission',
    value: 'cdi_mission',
  },
];

export const studentContractSelect = [
  {
    label: 'Alternance',
    value: 'alternation',
  },
  {
    label: 'Apprentissage',
    value: 'apprenticeship',
  },
  {
    label: 'Stage',
    value: 'internship',
  },
];

export const autoEvaluationSelect = [
  {
    label: '1 - Très négatif',
    value: '1',
  },
  {
    label: '2 - Négatif',
    value: '2',
  },
  {
    label: '3 - Neutre',
    value: '3',
  },
  {
    label: '4 - Positif',
    value: '4',
  },
  {
    label: '5 - Très positif',
    value: '5',
  },
];

export const profilSearchedSelect = [
  {
    label: 'Étudiant',
    value: 'student',
  },
  {
    label: 'Xpert',
    value: 'xpert',
  },
];

export const topicSelect = [
  {
    label: 'Mes missions',
    value: 'mission',
  },
  {
    label: 'Mon profil',
    value: 'profil',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

export const topicEchoSelect = [
  {
    label: 'Missions',
    value: 'mission',
  },
  {
    label: 'Profil',
    value: 'profil',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

export const revenusSalarialSelect: { label: string; value: DBRevenuType }[] = [
  {
    label: 'TJM',
    value: 'tjm',
  },
  {
    label: 'Salaire Mensuel BRUT',
    value: 'brut',
  },
];

export const jobTitleSelect = [
  {
    label: 'Assistant Dessinateur',
    value: 'assistant_dessinateur',
    image: '/static/jobs/Assistant Dessinateur.jpeg',
  },
  {
    label: "Chargé d'affaires",
    value: 'charge_d_affaires',
    image: "/static/jobs/Chargé d'affaires.jpeg",
  },
  {
    label: "Chef d'équipes en Montage mécanique",
    value: 'chef_de_quipes_en_montage_mecanique',
    image: "/static/jobs/Chef d'équipes en Montage mécanique.jpeg",
  },
  {
    label: 'Chef de Quart',
    value: 'chef_de_quart',
    image: '/static/jobs/chef_quart.jpeg',
  },
  {
    label: 'Chef(fe) de projets photovoltaïques',
    value: 'chef_de_projets_photovoltaiques',
    image: '/static/jobs/Chef(fe) de projets photovoltaïques.jpeg',
  },
  {
    label: 'Commissioning manager',
    value: 'commissioning_manager',
    image: '/static/jobs/Commissioning manager.jpeg',
  },
  {
    label: 'Dessinateur',
    value: 'dessinateur',
    image: '/static/jobs/Dessinateur.jpeg',
  },
  {
    label: "Directeur d'exploitation",
    value: 'directeur_exploitation',
    image: "/static/jobs/Directeur d'exploitation.jpeg",
  },
  {
    label: 'Directeur de projet',
    value: 'directeur_de_projet',
    image: '/static/jobs/DirecteurProjet.jpeg',
  },
  {
    label: 'Directeur de site/Site manager',
    value: 'directeur_de_site_site_manager',
    image: '/static/jobs/Directeur de site: Site manager.jpeg',
  },
  {
    label: 'Ingénieur analyses fonctionnelles',
    value: 'ingenieur_analyses_fonctionnelles',
    image: '/static/jobs/Ingénieur analyses fonctionnelles.jpeg',
  },
  {
    label: 'Ingénieur automaticien',
    value: 'ingenieur_automaticien',
    image: '/static/jobs/Ingénieur automaticien.jpeg',
  },
  {
    label: 'Ingénieur Calcul Génie Civil',
    value: 'ingenieur_calcul_genie_civil',
    image: '/static/jobs/IngenieurCalculGenie.jpeg',
  },
  {
    label: "Ingénieur d'études solaires PV",
    value: 'ingenieur_etudes_solaires_pv',
    image: "/static/jobs/Ingénieur d'études solaires PV.jpeg",
  },
  {
    label: 'Ingénieur des procédés',
    value: 'ingenieur_des_procedes',
    image: '/static/jobs/Ingénieur des procédés.jpeg',
  },
  {
    label: 'Ingénieur électricien',
    value: 'ingenieur_electricien',
    image: '/static/jobs/Ingénieur électricien.jpeg',
  },
  {
    label: 'Ingénieur étude électriques',
    value: 'ingenieur_etude_electriques',
    image: '/static/jobs/Ingénieur étude électriques.jpeg',
  },
  {
    label: 'Ingénieur génie civil',
    value: 'ingenieur_genie_civil',
    image: '/static/jobs/Ingénieur génie civil.jpeg',
  },
  {
    label: 'Ingénieur structure',
    value: 'ingenieur_structure',
    image: '/static/jobs/Ingénieur structure.jpeg',
  },
  {
    label: 'Instrumentiste',
    value: 'instrumentiste',
    image: '/static/jobs/Instrumentiste.jpeg',
  },
  {
    label: 'Metteur en route UVE: BIOMASSE',
    value: 'metteur_en_route_uve_biomasse',
    image: '/static/jobs/Metteur en route UVE: BIOMASSE.jpeg',
  },
  {
    label: 'Monteurs électromécanicien',
    value: 'monteurs_electromecanicien',
    image: '/static/jobs/Monteurs électromécanicien.jpeg',
  },
  {
    label: 'Monteurs mécaniciens',
    value: 'monteurs_mecaniciens',
    image: '/static/jobs/Monteurs mécaniciens.jpeg',
  },
  {
    label: 'Planner',
    value: 'planner',
    image: '/static/jobs/Planner.jpeg',
  },
  {
    label: 'Responsable exploitation UVE',
    value: 'responsable_exploitation_uve',
    image: '/static/jobs/Responsable exploitation UVE.jpeg',
  },
  {
    label: 'Responsable montage',
    value: 'responsable_montage',
    image: '/static/jobs/Responsable montage.jpeg',
  },
  {
    label: 'Responsable: Superviseur HSE: QHSE',
    value: 'responsable_superviseur_hse_qhse',
    image: '/static/jobs/Responsable: Superviseur HSE: QHSE.jpeg',
  },
  {
    label: 'Site manager (Déchets, eau, énergie)',
    value: 'site_manager_dechets_eau_energie',
    image: '/static/jobs/Site manager (Déchets, eau, énergie).jpeg',
  },
  {
    label: 'Superviseur électricien',
    value: 'superviseur_electricien',
    image: '/static/jobs/Superviseur électricien.jpeg',
  },
  {
    label: 'Superviseur mécanicien',
    value: 'superviseur_mecanicien',
    image: '/static/jobs/Superviseur mécanicien.jpeg',
  },
  {
    label: 'Technicien Eolien Onshore/Offshore',
    value: 'technicien_eolien_onshore_offshore',
    image: '/static/jobs/Technicien Eolien Onshore:Offshore.jpeg',
  },
  {
    label: 'Autre',
    value: 'other',
    imagae: '/static/wind-turbine.jpeg',
  },
];

export const reasonDeleteMissionSelect: {
  label: string;
  value: ReasonMissionDeletion;
}[] = [
  {
    label: 'Statut candidat non trouvé',
    value: 'status_candidate_not_found',
  },
  {
    label: 'Gagné concurence',
    value: 'won_competition',
  },
  {
    label: 'Mission suspendue par un fournisseur',
    value: 'mission_suspended_by_supplier',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];
