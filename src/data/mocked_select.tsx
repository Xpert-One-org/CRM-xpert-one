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
  {
    label: 'Autre',
    value: 'other',
  },
];

export const posts = [
  {
    label: 'Adjoint Directeur',
    value: 'adjoint_directeur',
  },
  {
    label: 'Automaticien',
    value: 'automaticien',
  },
  {
    label: "Chargé d'affaires",
    value: 'charge_d_affaires',
  },
  {
    label: 'Chef de chantier',
    value: 'chef_de_chantier',
  },
  {
    label: 'Chef de quart',
    value: 'chef_de_quart',
  },
  {
    label: 'Chimiste',
    value: 'chimiste',
  },
  {
    label: 'Commisionning Manager',
    value: 'commisionning_manager',
  },
  {
    label: 'Conducteur de travaux',
    value: 'conducteur_de_travaux',
  },
  {
    label: 'Dessinateur/projeteur',
    value: 'dessinateur_projeteur',
  },
  {
    label: 'Directeur de projet',
    value: 'directeur_de_projet',
  },
  {
    label: 'Directeur de site',
    value: 'directeur_de_site',
  },
  {
    label: 'Directeur HSE',
    value: 'directeur_hse',
  },
  {
    label: 'Electricien',
    value: 'electricien',
  },
  {
    label: "Ingénieur d'étude",
    value: 'ingenieur_etude',
  },
  {
    label: 'Ingénieur HSE',
    value: 'ingenieur_hse',
  },
  {
    label: 'Ingénieur Process',
    value: 'ingenieur_process',
  },
  {
    label: 'Instrumentiste',
    value: 'instrumentiste',
  },
  {
    label: 'Mécanicien',
    value: 'mecanicien',
  },
  {
    label: 'Metteur en route',
    value: 'metteur_en_route',
  },
  {
    label: 'Planer',
    value: 'planer',
  },
  {
    label: 'Pontier',
    value: 'pontier',
  },
  {
    label: 'Responsable achat',
    value: 'responsable_achat',
  },
  {
    label: 'Responsable de site',
    value: 'responsable_de_site',
  },
  {
    label: 'Responsable Maintenance',
    value: 'responsable_maintenance',
  },
  {
    label: 'Responsable Qualité',
    value: 'responsable_qualite',
  },
  {
    label: 'Responsable supply chain',
    value: 'responsable_supply_chain',
  },
  {
    label: "Conducteur d'installations Rondier Pontier",
    value: "Conducteur d'installations Rondier Pontier",
  },
  {
    label: 'Adjoint au Chef Quart',
    value: 'Adjoint au Chef Quart',
  },
  {
    label: 'Consultant RPA & IA',
    value: 'Consultant RPA & IA',
  },
  {
    label: 'Directeur général',
    value: 'Directeur général',
  },
  {
    label: 'Consultant formateur',
    value: 'Consultant formateur',
  },
  {
    label: 'Consultante Biodiversité',
    value: 'Consultante Biodiversité',
  },

  {
    label: 'Responsable electrique',
    value: 'Responsable electrique',
  },
  {
    label: 'electrical Supervisor',
    value: 'electrical Supervisor',
  },
  {
    label: 'Responsable Maintenance RTUs',
    value: 'Responsable Maintenance RTUs',
  },
  {
    label: 'Ingénieur en hydraulique',
    value: 'Ingénieur en hydraulique',
  },
  {
    label: 'Ingénieur Projet solaire Photovoltaïque',
    value: 'Ingénieur Projet solaire Photovoltaïque',
  },
  {
    label: 'Superviseur chaudière et turboalternateur',
    value: 'Superviseur chaudière et turboalternateur',
  },
  {
    label: 'Assistante opératrice',
    value: 'Assistante opératrice',
  },
  {
    label: 'Autre',
    value: 'other',
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
    label: 'Oui',
    value: 'true',
  },
  {
    label: 'Non',
    value: 'false',
  },
];

export const sectorSelect = [
  {
    label: 'Energie',
    value: 'energy',
  },
  {
    label: 'Energie renouvelable',
    value: 'renewable_energy',
  },
  {
    label: 'Industries des procédés',
    value: 'process_industries',
  },
  {
    label: 'Infrastructure',
    value: 'infrastructure',
  },
  {
    label: "Traitement de l'eau",
    value: 'water_treatment',
  },
  {
    label: 'Traitement des Déchêts',
    value: 'waste_treatment',
  },
  {
    label: 'Autre',
    value: 'others',
  },
];

export const infrastructureSelect = [
  {
    label: 'Port',
    value: 'port',
  },
  {
    label: 'Tunnel',
    value: 'tunnel',
  },
  {
    label: 'Autre',
    value: 'other',
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
    label: 'Directeur de site',
    value: 'directeur_de_site',
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

export const specialitySelect = [
  {
    label: 'Achats',
    value: 'purchases',
  },
  {
    label: 'AMOEX',
    value: 'amoex',
  },
  {
    label: 'Automatismes/ Contrôle commande',
    value: 'automation_control',
  },
  {
    label: 'CVC',
    value: 'cvc',
  },
  {
    label: 'Chimie',
    value: 'chemistry',
  },
  {
    label: 'Combustion',
    value: 'combustion',
  },
  {
    label: 'Conduite installation',
    value: 'installation_management',
  },
  {
    label: 'Direction de projets',
    value: 'dir',
  },
  {
    label: 'Elaboration budget',
    value: 'budget',
  },
  {
    label: 'Electricité CFA',
    value: 'electricity_cfa',
  },
  {
    label: 'Electricité CFO',
    value: 'electricity_cfo',
  },
  {
    label: 'Génie civil',
    value: 'civil_engineering',
  },
  {
    label: 'Gestion de projets',
    value: 'project_management',
  },
  {
    label: 'Hygiène sécurité Environnement',
    value: 'hse',
  },
  {
    label: 'Logistique',
    value: 'logistics',
  },
  {
    label: 'Maintenance',
    value: 'maintenance',
  },
  {
    label: 'Mécanique',
    value: 'mechanics',
  },
  {
    label: 'Mise en service',
    value: 'commissioning',
  },
  {
    label: "Ouvrage d'art",
    value: 'art_work',
  },
  {
    label: 'Piping',
    value: 'piping',
  },
  {
    label: 'Process',
    value: 'process',
  },
  {
    label: 'Qualité',
    value: 'quality',
  },
  {
    label: 'Suivi environnementale',
    value: 'environmental_monitoring',
  },
  {
    label: 'Valorisation énergétique',
    value: 'energy_recovery',
  },
  {
    label: 'VRD',
    value: 'vrd',
  },
  {
    label: 'Autre',
    value: 'others',
  },
];

export const expertiseSelect = [
  {
    label: 'Analyse chimique',
    value: 'analyse_chimique',
  },
  {
    label: 'Analyse fonctionnelle',
    value: 'analyse_fonctionnelle',
  },
  {
    label: 'Conception',
    value: 'conception',
  },
  {
    label: 'Conduite d installation',
    value: 'conduite_installation',
  },
  {
    label: 'Développement de la supervision',
    value: 'supervision',
  },
  {
    label: 'Dimensionnement projet',
    value: 'dimensionnement_projet',
  },
  {
    label: 'Dessin',
    value: 'dessin',
  },
  {
    label: 'Encadrement d equipe',
    value: 'encadrement_equipe',
  },
  {
    label: 'Elaboration budget',
    value: 'budget',
  },
  {
    label: 'FAT/SAT',
    value: 'fat_sat',
  },
  {
    label: 'Gestion Appels d offres',
    value: 'appels_offres',
  },
  {
    label: 'Gestion relation client final',
    value: 'relation_client',
  },
  {
    label: 'Instrumentation',
    value: 'instrumentation',
  },
  {
    label: 'Maintenance électrique',
    value: 'maintenance_electrique',
  },
  {
    label: 'Maintenance électro-technique',
    value: 'maintenance_electro_technique',
  },
  {
    label: 'Maintenance mécanique',
    value: 'maintenance_mecanique',
  },
  {
    label: 'Organisation du chantier OPC',
    value: 'organisation_chantier',
  },
  {
    label: 'Programmation',
    value: 'programmation',
  },
  {
    label: 'Rédaction cahier des charges',
    value: 'cahier_des_charges',
  },
  {
    label: 'Rédaction des Procédures',
    value: 'procedures',
  },
  {
    label: 'Suivi des travaux',
    value: 'suivi_travaux',
  },
  {
    label: 'Suivi Montage',
    value: 'suivi_montage',
  },
  {
    label: 'Suivi sous-traitant',
    value: 'suivi_sous_traitant',
  },
  {
    label: 'Test de boucles',
    value: 'test_boucles',
  },
  {
    label: 'Autre',
    value: 'others',
  },
  {
    label: "Pas d'expertise",
    value: 'no_expertise',
  },
];

export const habilitationsSelect = [
  {
    label: 'Habilitation amiante',
    value: 'habilitation_amiante',
  },
  {
    label: 'Habilitation ATEX',
    value: 'habilitation_atex',
  },
  {
    label: 'Habilitation CACES',
    value: 'habilitation_caces',
  },
  {
    label: 'Habilitation électrique',
    value: 'habilitation_electrique',
  },
  {
    label: 'Habilitation gaz',
    value: 'habilitation_gaz',
  },
  {
    label: 'Habilitation plomb',
    value: 'habilitation_plomb',
  },
  {
    label: 'Autre',
    value: 'others',
  },
];

export const degreeSelect = [
  {
    label: 'Baccalauréat',
    value: 'baccalaureat',
  },
  {
    label: 'BEP',
    value: 'bep',
  },
  {
    label: 'BTS',
    value: 'bts',
  },
  {
    label: 'BUT',
    value: 'but',
  },
  {
    label: 'CAP',
    value: 'cap',
  },
  {
    label: 'DEUG',
    value: 'deug',
  },
  {
    label: 'DEUST',
    value: 'deust',
  },
  {
    label: 'Diplôme d études approfondies',
    value: 'diplome_etudes_approfondies',
  },
  {
    label: 'Diplôme d études supérieures spécialisées',
    value: 'diplome_etudes_superieures_specialisees',
  },
  {
    label: 'Diplôme d ingénieur',
    value: 'diplome_ingenieur',
  },
  {
    label: 'Doctorat',
    value: 'doctorat',
  },
  {
    label: 'Habilitation à diriger des recherches',
    value: 'habilitation_diriger_recherches',
  },
  {
    label: 'Licence',
    value: 'licence',
  },
  {
    label: 'Licence professionnelle',
    value: 'licence_professionnelle',
  },
  {
    label: 'Maîtrise',
    value: 'maitrise',
  },
  {
    label: 'Master',
    value: 'master',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

export const languageSelect = [
  {
    label: 'Allemand',
    value: 'de',
  },
  {
    label: 'Anglais',
    value: 'en',
  },
  {
    label: 'Arabe',
    value: 'ar',
  },
  {
    label: 'Chinois',
    value: 'zh',
  },
  {
    label: 'Espagnol',
    value: 'es',
  },
  {
    label: 'Français',
    value: 'fr',
  },
  {
    label: 'Italien',
    value: 'it',
  },
  {
    label: 'Russe',
    value: 'ru',
  },
  {
    label: 'Portugais',
    value: 'pt',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

export const missionStates = [
  { label: 'À valider', value: 'to_validate' },
  { label: 'Tout ouvert à valider', value: 'open_all_to_validate' },
  { label: 'Ouvert', value: 'open' },
  { label: 'Tout ouvert', value: 'open_all' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Supprimé', value: 'deleted' },
  { label: 'Terminé', value: 'finished' },
  { label: 'En traitement', value: 'in_process' },
  { label: 'Validé', value: 'validated' },
  { label: 'Refusé', value: 'refused' },
];
