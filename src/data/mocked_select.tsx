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
  { label: 'Administratif / Support', value: 'administratif_support' },
  {
    label: "Bureau d'études / Ingénierie / Projets",
    value: 'bureau_d_etudes_ingenierie_projets',
  },
  { label: 'Exploitation', value: 'exploitation' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'QHSE', value: 'qhse' },
  {
    label: 'Travaux / Arrêt technique / Commissioning',
    value: 'travaux_arret_technique_commissioning',
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
    label: 'Bâtiment / Facility Management',
    value: 'batiment_facility_management',
  },
  { label: 'Centrale hydroélectrique', value: 'centrale_hydroelectrique' },
  { label: 'Éolien / Photovoltaïque', value: 'eolien_photovoltaique' },
  { label: 'Industrie', value: 'industrie' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Nucléaire', value: 'nucleaire' },
  { label: 'Oil & Gas', value: 'oil_gas' },
  { label: 'SI & Numérique', value: 'si_numerique' },
  { label: "Traitement de l'eau", value: 'traitement_de_l_eau' },
  {
    label: 'Traitement et valorisation des déchets',
    value: 'uiom_biomasse_csr_methanisation',
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

export const companyRoleSelect = [
  {
    label: 'Achat',
    value: 'achat',
  },
  {
    label: 'Administrative',
    value: 'administrative',
  },
  {
    label: 'Commerciale',
    value: 'commerciale',
  },
  {
    label: 'Comptabilité',
    value: 'comptabilite',
  },
  {
    label: 'Direction',
    value: 'direction',
  },
  {
    label: 'Directeur de site',
    value: 'directeur_de_site',
  },
  {
    label: 'Finance',
    value: 'finance',
  },
  {
    label: 'Production',
    value: 'production',
  },
  {
    label: 'RH',
    value: 'rh',
  },
  {
    label: 'Sécurité',
    value: 'securite',
  },
  {
    label: 'Technique',
    value: 'technique',
  },
];

export const jobTitleSelect = [
  { label: 'Acheteur', value: 'acheteur' },
  { label: 'Adjoint chef de quart', value: 'adjoint_chef_de_quart' },
  {
    label: 'Administrateur bases de données (DBA)',
    value: 'administrateur_bases_de_donnees_dba',
  },
  { label: 'Administrateur cloud', value: 'administrateur_cloud' },
  { label: 'Administrateur réseaux', value: 'administrateur_reseaux' },
  { label: 'Administrateur systèmes', value: 'administrateur_systemes' },
  { label: 'Agent de réception', value: 'agent_de_reception' },
  { label: "Agent d'exploitation", value: 'agent_d_exploitation' },
  { label: 'AMOE', value: 'amoe' },
  {
    label: "AMOE / Assistance à Maîtrise d'Œuvre",
    value: 'amoe_assistance_a_maitrise_d_uvre',
  },
  { label: 'Animateur HSE', value: 'animateur_hse' },
  { label: 'Architecte cloud', value: 'architecte_cloud' },
  { label: 'Architecte cybersécurité', value: 'architecte_cybersecurite' },
  { label: 'Architecte Data', value: 'architecte_data' },
  { label: 'Architecte logiciel', value: 'architecte_logiciel' },
  { label: 'Architecte SI', value: 'architecte_si' },
  { label: 'Asset Manager', value: 'asset_manager' },
  { label: 'Asset Performance Manager', value: 'asset_performance_manager' },
  { label: 'Assistant administratif', value: 'assistant_administratif' },
  { label: 'Assistant commercial', value: 'assistant_commercial' },
  { label: 'Assistant communication', value: 'assistant_communication' },
  { label: 'Assistant de direction', value: 'assistant_de_direction' },
  { label: 'Automaticien', value: 'automaticien' },
  { label: 'BIM Manager', value: 'bim_manager' },
  { label: 'Business Analyst', value: 'business_analyst' },
  { label: 'Change Manager', value: 'change_manager' },
  { label: "Chargé d'affaires", value: 'charge_d_affaires' },
  { label: 'Chargé de recrutement', value: 'charge_de_recrutement' },
  { label: 'Chaudronnier / Soudeur', value: 'chaudronnier_soudeur' },
  { label: "Chef d'atelier", value: 'chef_d_atelier' },
  { label: 'Chef de bloc', value: 'chef_de_bloc' },
  { label: 'Chef de chantier', value: 'chef_de_chantier' },
  { label: 'Chef de projet déploiement', value: 'chef_de_projet_deploiement' },
  { label: 'Chef de projets', value: 'chef_de_projets' },
  { label: 'Chef de quart', value: 'chef_de_quart' },
  { label: "Chef d'équipe maintenance", value: 'chef_d_equipe_maintenance' },
  { label: "Chef d'équipe production", value: 'chef_d_equipe_production' },
  { label: 'Chimiste', value: 'chimiste' },
  { label: 'Comptable', value: 'comptable' },
  { label: 'Conducteur de bulldozer', value: 'conducteur_de_bulldozer' },
  { label: 'Conducteur de centrale', value: 'conducteur_de_centrale' },
  { label: 'Conducteur de compacteur', value: 'conducteur_de_compacteur' },
  { label: 'Conducteur de finisseur', value: 'conducteur_de_finisseur' },
  { label: 'Conducteur de ligne', value: 'conducteur_de_ligne' },
  { label: "Conducteur d'engins", value: 'conducteur_d_engins' },
  { label: 'Conducteur de niveleuse', value: 'conducteur_de_niveleuse' },
  { label: 'Conducteur de process', value: 'conducteur_de_process' },
  { label: 'Conducteur de tranche', value: 'conducteur_de_tranche' },
  { label: 'Conducteur de travaux', value: 'conducteur_de_travaux' },
  { label: 'Conducteur de tunnelier', value: 'conducteur_de_tunnelier' },
  {
    label: 'Conseiller en radioprotection (CRP)',
    value: 'conseiller_en_radioprotection_crp',
  },
  { label: 'Consultant BI', value: 'consultant_bi' },
  { label: 'Consultant conformité', value: 'consultant_conformite' },
  { label: 'Consultant CRM', value: 'consultant_crm' },
  { label: 'Consultant cybersécurité', value: 'consultant_cybersecurite' },
  { label: 'Consultant ERP', value: 'consultant_erp' },
  { label: 'Consultant GRC', value: 'consultant_grc' },
  { label: 'Coordinateur de production', value: 'coordinateur_de_production' },
  { label: 'Coordinateur maintenance', value: 'coordinateur_maintenance' },
  { label: 'Coordinateur sécurité', value: 'coordinateur_securite' },
  {
    label: 'Coordinateur sécurité / CSPS',
    value: 'coordinateur_securite_csps',
  },
  { label: 'Data Analyst', value: 'data_analyst' },
  { label: 'Data Engineer', value: 'data_engineer' },
  { label: 'Data Scientist', value: 'data_scientist' },
  { label: 'Dessinateur projeteur', value: 'dessinateur_projeteur' },
  { label: 'Développeur Back-end', value: 'developpeur_back_end' },
  { label: 'Développeur embarqué', value: 'developpeur_embarque' },
  { label: 'Développeur Front-end', value: 'developpeur_front_end' },
  { label: 'Développeur Full Stack', value: 'developpeur_full_stack' },
  { label: 'Développeur logiciel', value: 'developpeur_logiciel' },
  { label: 'Développeur mobile', value: 'developpeur_mobile' },
  { label: 'Directeur achat', value: 'directeur_achat' },
  {
    label: 'Directeur adjoint de maintenance',
    value: 'directeur_adjoint_de_maintenance',
  },
  {
    label: 'Directeur adjoint de production',
    value: 'directeur_adjoint_de_production',
  },
  {
    label: "Directeur adjoint d'exploitation",
    value: 'directeur_adjoint_d_exploitation',
  },
  { label: "Directeur adjoint d'usine", value: 'directeur_adjoint_d_usine' },
  {
    label: 'Directeur adjoint maintenance',
    value: 'directeur_adjoint_maintenance',
  },
  { label: 'Directeur administratif', value: 'directeur_administratif' },
  { label: 'Directeur commercial', value: 'directeur_commercial' },
  { label: "Directeur d'agence", value: 'directeur_d_agence' },
  { label: 'Directeur de centrale(s)', value: 'directeur_de_centrale_s' },
  { label: 'Directeur de maintenance', value: 'directeur_de_maintenance' },
  { label: 'Directeur de production', value: 'directeur_de_production' },
  { label: 'Directeur de projets', value: 'directeur_de_projets' },
  { label: 'Directeur de site(s)', value: 'directeur_de_site_s' },
  { label: "Directeur d'exploitation", value: 'directeur_d_exploitation' },
  {
    label: "Directeur d'exploitation IT",
    value: 'directeur_d_exploitation_it',
  },
  { label: "Directeur d'usine", value: 'directeur_d_usine' },
  { label: 'Directeur financier', value: 'directeur_financier' },
  { label: 'Directeur maintenance', value: 'directeur_maintenance' },
  { label: 'Directeur RH', value: 'directeur_rh' },
  { label: 'Directeur technique', value: 'directeur_technique' },
  { label: 'Directeur travaux', value: 'directeur_travaux' },
  { label: 'Éclusier', value: 'eclusier' },
  { label: 'Électricien', value: 'electricien' },
  { label: 'Électricien CFO/CFA', value: 'electricien_cfo_cfa' },
  { label: 'Électricien industriel', value: 'electricien_industriel' },
  { label: 'Électromécanicien', value: 'electromecanicien' },
  { label: 'Électrotechnicien', value: 'electrotechnicien' },
  { label: 'Facility Manager', value: 'facility_manager' },
  { label: 'Frigoriste', value: 'frigoriste' },
  { label: 'Gestionnaire RH', value: 'gestionnaire_rh' },
  { label: 'Grands composants', value: 'grands_composants' },
  { label: 'Grutier', value: 'grutier' },
  { label: 'Hydraulicien', value: 'hydraulicien' },
  { label: 'Incident Manager', value: 'incident_manager' },
  { label: 'Ingénieur aérodynamique', value: 'ingenieur_aerodynamique' },
  { label: 'Ingénieur automatisme', value: 'ingenieur_automatisme' },
  { label: 'Ingénieur BIM', value: 'ingenieur_bim' },
  { label: 'Ingénieur calcul', value: 'ingenieur_calcul' },
  { label: 'Ingénieur caténaire', value: 'ingenieur_catenaire' },
  { label: 'Ingénieur CFO/CFA', value: 'ingenieur_cfo_cfa' },
  { label: 'Ingénieur cloud', value: 'ingenieur_cloud' },
  { label: 'Ingénieur combustible', value: 'ingenieur_combustible' },
  {
    label: 'Ingénieur contrôle-commande',
    value: 'ingenieur_controle_commande',
  },
  { label: 'Ingénieur CVC', value: 'ingenieur_cvc' },
  { label: 'Ingénieur cybersécurité', value: 'ingenieur_cybersecurite' },
  { label: 'Ingénieur Data', value: 'ingenieur_data' },
  {
    label: 'Ingénieur déchets nucléaires',
    value: 'ingenieur_dechets_nucleaires',
  },
  { label: 'Ingénieur démantèlement', value: 'ingenieur_demantelement' },
  { label: 'Ingénieur déploiement', value: 'ingenieur_deploiement' },
  { label: 'Ingénieur DevOps', value: 'ingenieur_devops' },
  { label: 'Ingénieur EIA', value: 'ingenieur_eia' },
  { label: 'Ingénieur électricité', value: 'ingenieur_electricite' },
  { label: 'Ingénieur électromécanique', value: 'ingenieur_electromecanique' },
  { label: 'Ingénieur électrotechnique', value: 'ingenieur_electrotechnique' },
  { label: 'Ingénieur énergétique', value: 'ingenieur_energetique' },
  { label: 'Ingénieur environnement', value: 'ingenieur_environnement' },
  { label: 'Ingénieur essai', value: 'ingenieur_essai' },
  { label: 'Ingénieur essais', value: 'ingenieur_essais' },
  {
    label: 'Ingénieur excellence opérationnelle',
    value: 'ingenieur_excellence_operationnelle',
  },
  { label: 'Ingénieur ferroviaire', value: 'ingenieur_ferroviaire' },
  { label: 'Ingénieur fiabilité', value: 'ingenieur_fiabilite' },
  { label: 'Ingénieur fluides', value: 'ingenieur_fluides' },
  { label: 'Ingénieur génie civil', value: 'ingenieur_genie_civil' },
  {
    label: 'Ingénieur génie civil / construction',
    value: 'ingenieur_genie_civil_construction',
  },
  { label: 'Ingénieur géotechnique', value: 'ingenieur_geotechnique' },
  { label: 'Ingénieur GTB', value: 'ingenieur_gtb' },
  { label: 'Ingénieur GTC', value: 'ingenieur_gtc' },
  { label: 'Ingénieur HVAC', value: 'ingenieur_hvac' },
  { label: 'Ingénieur hydraulique', value: 'ingenieur_hydraulique' },
  { label: 'Ingénieur IA', value: 'ingenieur_ia' },
  {
    label: 'Ingénieur industrialisation',
    value: 'ingenieur_industrialisation',
  },
  { label: 'Ingénieur intégration', value: 'ingenieur_integration' },
  {
    label: 'Ingénieur Lean Manufacturing',
    value: 'ingenieur_lean_manufacturing',
  },
  { label: 'Ingénieur maintenance', value: 'ingenieur_maintenance' },
  { label: 'Ingénieur matériaux', value: 'ingenieur_materiaux' },
  { label: 'Ingénieur mécanique', value: 'ingenieur_mecanique' },
  { label: 'Ingénieur méthodes', value: 'ingenieur_methodes' },
  { label: 'Ingénieur migration', value: 'ingenieur_migration' },
  {
    label: 'Ingénieur mise en production',
    value: 'ingenieur_mise_en_production',
  },
  { label: 'Ingénieur neutronique', value: 'ingenieur_neutronique' },
  { label: "Ingénieur ouvrages d'art", value: 'ingenieur_ouvrages_d_art' },
  { label: 'Ingénieur performance', value: 'ingenieur_performance' },
  {
    label: 'Ingénieur performance énergétique',
    value: 'ingenieur_performance_energetique',
  },
  { label: 'Ingénieur planning', value: 'ingenieur_planning' },
  { label: 'Ingénieur plateforme', value: 'ingenieur_plateforme' },
  { label: 'Ingénieur process', value: 'ingenieur_process' },
  { label: 'Ingénieur production', value: 'ingenieur_production' },
  { label: 'Ingénieur QA', value: 'ingenieur_qa' },
  { label: 'Ingénieur qualification', value: 'ingenieur_qualification' },
  { label: 'Ingénieur radioprotection', value: 'ingenieur_radioprotection' },
  { label: 'Ingénieur réseaux', value: 'ingenieur_reseaux' },
  { label: 'Ingénieur signalisation', value: 'ingenieur_signalisation' },
  { label: 'Ingénieur stockage énergie', value: 'ingenieur_stockage_energie' },
  { label: 'Ingénieur structure', value: 'ingenieur_structure' },
  { label: 'Ingénieur structures', value: 'ingenieur_structures' },
  { label: 'Ingénieur sûreté', value: 'ingenieur_surete' },
  { label: 'Ingénieur systèmes', value: 'ingenieur_systemes' },
  { label: 'Ingénieur thermique', value: 'ingenieur_thermique' },
  { label: 'Ingénieur tunnel', value: 'ingenieur_tunnel' },
  { label: 'Ingénieur tuyauterie', value: 'ingenieur_tuyauterie' },
  { label: 'Ingénieur voie ferrée', value: 'ingenieur_voie_ferree' },
  { label: 'Ingénieur VRD', value: 'ingenieur_vrd' },
  { label: 'Instrumentiste', value: 'instrumentiste' },
  { label: 'Laborantin', value: 'laborantin' },
  { label: 'Lead commissioning', value: 'lead_commissioning' },
  { label: 'Lead déploiement', value: 'lead_deploiement' },
  { label: 'Magasinier', value: 'magasinier' },
  { label: 'Mécanicien', value: 'mecanicien' },
  { label: 'Metteur au point', value: 'metteur_au_point' },
  { label: 'Metteur en service', value: 'metteur_en_service' },
  { label: 'MOA', value: 'moa' },
  { label: "MOA / Maîtrise d'Ouvrage", value: 'moa_maitrise_d_ouvrage' },
  { label: 'MOE', value: 'moe' },
  { label: "MOE / Maîtrise d'Œuvre", value: 'moe_maitrise_d_uvre' },
  { label: 'OPC', value: 'opc' },
  { label: 'Opérateur de conduite', value: 'operateur_de_conduite' },
  { label: 'Opérateur de production', value: 'operateur_de_production' },
  { label: "Opérateur d'exploitation", value: 'operateur_d_exploitation' },
  { label: 'Opérateur NOC', value: 'operateur_noc' },
  { label: 'Planificateur maintenance', value: 'planificateur_maintenance' },
  { label: 'Pontier', value: 'pontier' },
  { label: 'Préparateur maintenance', value: 'preparateur_maintenance' },
  { label: 'Préventeur HSE', value: 'preventeur_hse' },
  { label: 'Problem Manager', value: 'problem_manager' },
  { label: 'Product Owner', value: 'product_owner' },
  { label: 'Release Manager', value: 'release_manager' },
  { label: 'Responsable achat', value: 'responsable_achat' },
  {
    label: 'Responsable adjoint de conduite',
    value: 'responsable_adjoint_de_conduite',
  },
  {
    label: 'Responsable adjoint de maintenance',
    value: 'responsable_adjoint_de_maintenance',
  },
  {
    label: 'Responsable adjoint de production',
    value: 'responsable_adjoint_de_production',
  },
  {
    label: "Responsable adjoint d'exploitation",
    value: 'responsable_adjoint_d_exploitation',
  },
  {
    label: "Responsable adjoint d'usine",
    value: 'responsable_adjoint_d_usine',
  },
  {
    label: 'Responsable adjoint maintenance',
    value: 'responsable_adjoint_maintenance',
  },
  { label: 'Responsable administratif', value: 'responsable_administratif' },
  { label: 'Responsable cloud', value: 'responsable_cloud' },
  { label: 'Responsable commercial', value: 'responsable_commercial' },
  { label: 'Responsable commissioning', value: 'responsable_commissioning' },
  { label: 'Responsable communication', value: 'responsable_communication' },
  { label: 'Responsable cybersécurité', value: 'responsable_cybersecurite' },
  { label: "Responsable d'affaires", value: 'responsable_d_affaires' },
  { label: "Responsable d'agence", value: 'responsable_d_agence' },
  { label: 'Responsable datacenter', value: 'responsable_datacenter' },
  {
    label: 'Responsable de centre de services',
    value: 'responsable_de_centre_de_services',
  },
  {
    label: "Responsable de centre d'exploitation",
    value: 'responsable_de_centre_d_exploitation',
  },
  { label: 'Responsable de chantier', value: 'responsable_de_chantier' },
  { label: 'Responsable de conduite', value: 'responsable_de_conduite' },
  { label: 'Responsable de maintenance', value: 'responsable_de_maintenance' },
  { label: 'Responsable de parc', value: 'responsable_de_parc' },
  { label: 'Responsable déploiement', value: 'responsable_deploiement' },
  { label: 'Responsable de production', value: 'responsable_de_production' },
  {
    label: 'Responsable de production informatique',
    value: 'responsable_de_production_informatique',
  },
  { label: 'Responsable de projets', value: 'responsable_de_projets' },
  { label: 'Responsable de site', value: 'responsable_de_site' },
  { label: "Responsable d'exploitation", value: 'responsable_d_exploitation' },
  {
    label: "Responsable d'exploitation IT",
    value: 'responsable_d_exploitation_it',
  },
  {
    label: "Responsable d'unité de production",
    value: 'responsable_d_unite_de_production',
  },
  { label: "Responsable d'usine", value: 'responsable_d_usine' },
  {
    label: 'Responsable exploitation IT',
    value: 'responsable_exploitation_it',
  },
  { label: 'Responsable fabrication', value: 'responsable_fabrication' },
  {
    label: 'Responsable Facility Management',
    value: 'responsable_facility_management',
  },
  { label: 'Responsable fiabilité', value: 'responsable_fiabilite' },
  { label: 'Responsable financier', value: 'responsable_financier' },
  { label: 'Responsable gouvernance SI', value: 'responsable_gouvernance_si' },
  { label: 'Responsable HSE / QHSE', value: 'responsable_hse_qhse' },
  {
    label: 'Responsable industrialisation',
    value: 'responsable_industrialisation',
  },
  { label: 'Responsable informatique', value: 'responsable_informatique' },
  { label: 'Responsable infrastructure', value: 'responsable_infrastructure' },
  { label: 'Responsable logistique', value: 'responsable_logistique' },
  { label: 'Responsable maintenance', value: 'responsable_maintenance' },
  { label: 'Responsable MCO', value: 'responsable_mco' },
  { label: 'Responsable méthodes', value: 'responsable_methodes' },
  {
    label: 'Responsable méthodes maintenance',
    value: 'responsable_methodes_maintenance',
  },
  { label: 'Responsable migration', value: 'responsable_migration' },
  { label: 'Responsable NOC', value: 'responsable_noc' },
  { label: 'Responsable paie', value: 'responsable_paie' },
  { label: 'Responsable qualité SI', value: 'responsable_qualite_si' },
  { label: 'Responsable réseaux', value: 'responsable_reseaux' },
  { label: 'Responsable RH', value: 'responsable_rh' },
  { label: 'Responsable support', value: 'responsable_support' },
  { label: 'Responsable systèmes', value: 'responsable_systemes' },
  { label: 'Responsable technique', value: 'responsable_technique' },
  {
    label: 'Responsable technique de site',
    value: 'responsable_technique_de_site',
  },
  { label: 'Responsable travaux', value: 'responsable_travaux' },
  { label: 'Rondier', value: 'rondier' },
  { label: 'Rondier Pontier', value: 'rondier_pontier' },
  { label: 'RSSI', value: 'rssi' },
  { label: 'Scrum Master', value: 'scrum_master' },
  { label: 'Service Delivery Manager', value: 'service_delivery_manager' },
  { label: 'Site Manager', value: 'site_manager' },
  { label: 'Superviseur automatisme', value: 'superviseur_automatisme' },
  { label: 'Superviseur chaudronnerie', value: 'superviseur_chaudronnerie' },
  { label: 'Superviseur CVC', value: 'superviseur_cvc' },
  {
    label: "Superviseur d'arrêt de tranche",
    value: 'superviseur_d_arret_de_tranche',
  },
  { label: 'Superviseur de chantier', value: 'superviseur_de_chantier' },
  { label: 'Superviseur de production', value: 'superviseur_de_production' },
  { label: 'Superviseur électricité', value: 'superviseur_electricite' },
  { label: 'Superviseur électrique', value: 'superviseur_electrique' },
  { label: 'Superviseur génie civil', value: 'superviseur_genie_civil' },
  { label: 'Superviseur GTB/GTC', value: 'superviseur_gtb_gtc' },
  { label: 'Superviseur hydraulique', value: 'superviseur_hydraulique' },
  {
    label: 'Superviseur instrumentation',
    value: 'superviseur_instrumentation',
  },
  { label: 'Superviseur levage', value: 'superviseur_levage' },
  { label: 'Superviseur mécanique', value: 'superviseur_mecanique' },
  { label: 'Superviseur NOC', value: 'superviseur_noc' },
  { label: 'Superviseur process', value: 'superviseur_process' },
  { label: 'Superviseur tuyauterie', value: 'superviseur_tuyauterie' },
  { label: 'Technicien caténaire', value: 'technicien_catenaire' },
  { label: 'Technicien CVC', value: 'technicien_cvc' },
  { label: 'Technicien de conduite', value: 'technicien_de_conduite' },
  {
    label: 'Technicien de maintenance polyvalent',
    value: 'technicien_de_maintenance_polyvalent',
  },
  {
    label: 'Technicien de mise en service',
    value: 'technicien_de_mise_en_service',
  },
  { label: 'Technicien de production', value: 'technicien_de_production' },
  { label: "Technicien d'exploitation", value: 'technicien_d_exploitation' },
  { label: 'Technicien ferroviaire', value: 'technicien_ferroviaire' },
  { label: 'Technicien GTB/GTC', value: 'technicien_gtb_gtc' },
  { label: 'Technicien informatique', value: 'technicien_informatique' },
  { label: 'Technicien itinérant', value: 'technicien_itinerant' },
  { label: 'Technicien levage', value: 'technicien_levage' },
  { label: 'Technicien maintenance', value: 'technicien_maintenance' },
  { label: 'Technicien multitechnique', value: 'technicien_multitechnique' },
  { label: 'Technicien pivot / bascule', value: 'technicien_pivot_bascule' },
  { label: 'Technicien SAV', value: 'technicien_sav' },
  { label: 'Technicien signalisation', value: 'technicien_signalisation' },
  { label: 'Technicien SSI', value: 'technicien_ssi' },
  { label: 'Technicien support', value: 'technicien_support' },
  { label: 'Technicien support N2/N3', value: 'technicien_support_n2_n3' },
  { label: 'Technicien voie ferrée', value: 'technicien_voie_ferree' },
  { label: 'Testeur logiciel', value: 'testeur_logiciel' },
  { label: 'Tuyauteur / Robinetier', value: 'tuyauteur_robinetier' },
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
  { label: 'Achats', value: 'achats' },
  { label: 'AMOEX', value: 'amoex' },
  { label: 'Audit', value: 'audit' },
  {
    label: 'Automatismes/ Contrôle commande',
    value: 'automatismes_controle_commande',
  },
  { label: 'Autre', value: 'others' },
  { label: 'CFO / Photovoltaïque', value: 'cfo_photovoltaique' },
  { label: 'Chimie', value: 'chimie' },
  { label: 'Combustion', value: 'combustion' },
  {
    label: 'Conception et Fabrication des ouvrages métalliques',
    value: 'conception_et_fabrication_des_ouvrages_metalliques',
  },
  { label: 'Conduite installation', value: 'conduite_installation' },
  { label: 'Coordination de projet', value: 'coordination_de_projet' },
  { label: 'CVC', value: 'cvc' },
  {
    label:
      "Design, Gestion d'équipes, étude technique, O&M, Recherche et gestion de financement bailleurs de fond",
    value:
      'design_gestion_d_equipes_etude_technique_o_m_recherche_et_gestion_de_financement_bailleurs_de_fond',
  },
  { label: 'Direction de projets', value: 'direction_de_projets' },
  { label: 'Direction technique', value: 'direction_technique' },
  { label: 'Échafaudage', value: 'echafaudage' },
  { label: 'Efficacité énergétique', value: 'efficacite_energetique' },
  { label: 'Elaboration budget', value: 'elaboration_budget' },
  { label: 'Electricité Bâtiment', value: 'electricite_batiment' },
  { label: 'Electricité CFA', value: 'electricite_cfa' },
  { label: 'Electricité CFO', value: 'electricite_cfo' },
  { label: 'Électrotechnique', value: 'electrotechnique' },
  { label: 'Génie civil', value: 'genie_civil' },
  { label: 'Gestion de projets', value: 'gestion_de_projets' },
  {
    label:
      'hydraulique, vapeur, formation de personnel, commande de matériel et camion via logiciels STAR et  SAP',
    value:
      'hydraulique_vapeur_formation_de_personnel_commande_de_materiel_et_camion_via_logiciels_star_et_sap',
  },
  {
    label: 'Hygiène sécurité Environnement',
    value: 'hygiene_securite_environnement',
  },
  {
    label:
      'Ingénierie mécanique, management des projets; maintenance industrielle',
    value:
      'ingenierie_mecanique_management_des_projets_maintenance_industrielle',
  },
  {
    label:
      'Ingenieur en mecanique, specialisé dans la gestion de projet / développement outillage / procédure de maintenance complexe',
    value:
      'ingenieur_en_mecanique_specialise_dans_la_gestion_de_projet_developpement_outillage_procedure_de_maintenance_complexe',
  },
  {
    label:
      "Juridique. Pratique en droit droit de l'environnement, de l'énergie, des contrats.",
    value:
      'juridique_pratique_en_droit_droit_de_l_environnement_de_l_energie_des_contrats',
  },
  { label: 'Logistique', value: 'logistique' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Mécanique', value: 'mecanique' },
  {
    label: 'Mesure, métrologie, instrumentation',
    value: 'mesure_metrologie_instrumentation',
  },
  {
    label: 'Métreur chiffreur en isolation et ravalement',
    value: 'metreur_chiffreur_en_isolation_et_ravalement',
  },
  { label: 'Mise en service', value: 'mise_en_service' },
  {
    label: 'Négociation; P&L; Management; Process;',
    value: 'negociation_p_l_management_process',
  },
  { label: 'Operations', value: 'operations' },
  { label: "Ouvrage d'art", value: 'ouvrage_d_art' },
  { label: 'Piping', value: 'piping' },
  { label: 'Process', value: 'process' },
  { label: 'Production', value: 'production' },
  { label: 'Qualité', value: 'qualite' },
  {
    label: 'Sites et sols pollués et économie circulaire',
    value: 'sites_et_sols_pollues_et_economie_circulaire',
  },
  { label: 'Suivi environnementale', value: 'suivi_environnementale' },
  { label: 'Sûreté Nucléaire', value: 'surete_nucleaire' },
  {
    label: 'Thermique, thermodynamique, mécanique des fluides',
    value: 'thermique_thermodynamique_mecanique_des_fluides',
  },
  { label: 'Valorisation énergétique', value: 'valorisation_energetique' },
  { label: 'VRD', value: 'vrd' },
];

export const expertiseSelect = [
  { label: 'Analyse chimique', value: 'analyse_chimique' },
  { label: 'Analyse fonctionnelle', value: 'analyse_fonctionnelle' },
  { label: 'Audit énergétique', value: 'audit_energetique' },
  { label: 'Autre', value: 'others' },
  { label: 'Conception', value: 'conception' },
  { label: "Conduite d'installation", value: 'conduite_d_installation' },
  {
    label:
      'conduite et maintenance préventive / curative des chaudières biomasse',
    value:
      'conduite_et_maintenance_preventive_curative_des_chaudieres_biomasse',
  },
  {
    label:
      'Contrats - procédures administratives - résolution des différends - formations règlementaires',
    value:
      'contrats_procedures_administratives_resolution_des_differends_formations_reglementaires',
  },
  { label: 'Dessin', value: 'dessin' },
  {
    label: 'Développement de la supervision',
    value: 'developpement_de_la_supervision',
  },
  { label: 'Dimensionnement projet', value: 'dimensionnement_projet' },
  { label: 'Elaboration budget', value: 'elaboration_budget' },
  { label: "Encadrement d'equipe", value: 'encadrement_d_equipe' },
  { label: 'Etudes Biodiversité', value: 'etudes_biodiversite' },
  {
    label: 'Évaluation des risques, formation, établissement des procédures',
    value: 'evaluation_des_risques_formation_etablissement_des_procedures',
  },
  {
    label:
      'Expert en développement ouillages / procedure de maintenance complexe',
    value:
      'expert_en_developpement_ouillages_procedure_de_maintenance_complexe',
  },
  { label: 'FAT/SAT', value: 'fat_sat' },
  { label: 'Feed, EPC', value: 'feed_epc' },
  { label: 'Fiabilié et EPS', value: 'fiabilie_et_eps' },
  { label: "Gestion Appels d'offres", value: 'gestion_appels_d_offres' },
  {
    label: 'Gestion des Opérations; Conduite du changement.',
    value: 'gestion_des_operations_conduite_du_changement',
  },
  {
    label:
      'Gestion des risques (cyanobactéries, légionelles, bactéries filamenteuses, H2S, nuisance olfactives), pilotage de boue activée, phytoépuration, diagnostic qualité des eaux, analyse écologique de boue activée, registre sanitaire',
    value:
      'gestion_des_risques_cyanobacteries_legionelles_bacteries_filamenteuses_h2s_nuisance_olfactives_pilotage_de_boue_activee_phytoepuration_diagnostic_qualite_des_eaux_analyse_ecologique_de_boue_activee_registre_sanitaire',
  },
  {
    label: 'Gestion relation client final',
    value: 'gestion_relation_client_final',
  },
  {
    label: 'Ingénierie financière, gestion et  coordination de projet',
    value: 'ingenierie_financiere_gestion_et_coordination_de_projet',
  },
  {
    label: 'Installation photovoltaïque de A à Z',
    value: 'installation_photovoltaique_de_a_a_z',
  },
  { label: 'Instrumentation', value: 'instrumentation' },
  { label: 'Maintenance électrique', value: 'maintenance_electrique' },
  {
    label: 'Maintenance électro-technique',
    value: 'maintenance_electro_technique',
  },
  { label: 'Maintenance mécanique', value: 'maintenance_mecanique' },
  {
    label: 'Mesure, métrologie, instrumentation',
    value: 'mesure_metrologie_instrumentation',
  },
  {
    label: 'mise en service des bruleurs industriel (saacke , weishupt)',
    value: 'mise_en_service_des_bruleurs_industriel_saacke_weishupt',
  },
  { label: 'Operations', value: 'operations' },
  {
    label: 'Organisation du chantier OPC',
    value: 'organisation_du_chantier_opc',
  },
  { label: 'Programmation', value: 'programmation' },
  {
    label: 'Rédaction cahier des charges',
    value: 'redaction_cahier_des_charges',
  },
  { label: 'Rédaction des Procédures', value: 'redaction_des_procedures' },
  {
    label: 'SOLIDWORKS, INVENTOR, AUTOCAD, FUSION 360',
    value: 'solidworks_inventor_autocad_fusion_360_2',
  },
  { label: 'Suivi des travaux', value: 'suivi_des_travaux' },
  { label: 'Suivi Montage', value: 'suivi_montage' },
  { label: 'Suivi sous-traitant', value: 'suivi_sous_traitant' },
  { label: 'Test de boucles', value: 'test_de_boucles' },
];

export const habilitationsSelect = [
  { label: 'Autre', value: 'autre' },
  {
    label: 'Conduite machine sous pression',
    value: 'conduit_machine_sous_pression',
  },
  { label: 'Habilitation amiante', value: 'habilitation_amiante' },
  { label: 'Habilitation ATEX', value: 'habilitation_atex' },
  { label: 'Habilitation CACES', value: 'habilitation_caces' },
  { label: 'Habilitation échafaudage', value: 'habilitation_echafaudage' },
  { label: 'Habilitation électrique', value: 'habilitation_electrique' },
  { label: 'Habilitation gaz', value: 'habilitation_gaz' },
  { label: 'Habilitation plomb', value: 'habilitation_plomb' },
  {
    label: 'Habilitation risques chimiques',
    value: 'habilitation_risques_chimiques',
  },
  {
    label: 'Port du harnais & Travail en hauteur',
    value: 'port_du_harnais_travail_en_hauteur',
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
