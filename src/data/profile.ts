import type {
  ProfileData,
  ProfileDataEducation,
  ProfileDataExperience,
  ProfileDataExpertise,
  ProfileDataMission,
  ProfileDataStatus,
} from '@/types/types';

export const profileData: ProfileData = {
  civility: { label: 'Civilité', name: 'civility', required: 'true' },
  birthdate: {
    label: 'Date de naissance',
    name: 'birthdate',
    required: 'true',
  },
  lastname: { label: 'Nom', name: 'lastname', required: 'true' },
  firstname: { label: 'Prénom', name: 'firstname', required: 'true' },
  mobile: { label: 'Tél portable', name: 'mobile', required: 'true' },
  fix: { label: 'Tél fixe', name: 'fix', required: 'false' },
  email: { label: 'Adresse mail', name: 'email', required: 'true' },
  street_number: {
    label: 'N° de rue',
    name: 'street_number',
    required: 'true',
  },
  address: { label: 'Adresse postale', name: 'address', required: 'true' },
  city: { label: 'Ville', name: 'city', required: 'true' },
  postal_code: { label: 'Code postal', name: 'postal_code', required: 'true' },
  country: { label: 'Pays', name: 'country', required: 'true' },
  linkedin: { label: 'Profil LinkedIn', name: 'linkedin', required: 'false' },
  how_did_you_hear_about_us: {
    label: 'Comment avez-vous connu Xpert One',
    name: 'how_did_you_hear_about_us',
    required: 'true',
  },
  how_did_you_hear_about_us_other: {
    label: 'Précisez',
    name: 'how_did_you_hear_about_us_other',
    required: 'depends',
  },
  referent_id: {
    label: 'Je suis parrainé par :',
    name: 'referent_id',
    required: 'false',
  },
  cv_name: { label: 'Télécharger mon CV', name: 'cv_name', required: 'true' },
};

export const profileDataCompany: ProfileData = {
  company_name: {
    label: 'Nom de votre société',
    name: 'company_name',
    required: 'true',
  },
  company_role: {
    label: 'Votre fonction',
    name: 'company_role',
    required: 'true',
  },
  company_role_other: {
    label: 'Précisez votre fonction',
    name: 'company_role_other',
    required: 'depends',
  },
  service_dependance: {
    label: 'De quel service dépendez vous',
    name: 'service_dependance',
    required: 'true',
  },
  sector: {
    label: "Votre secteur d'activité",
    name: 'sector',
    required: 'true',
  },
  sector_renewable_energy: {
    label: "Quel type d'énergie renouvelable ?",
    name: 'sector_renewable_energy',
    required: 'depends',
  },
  sector_waste_treatment: {
    label: 'Quel type de traitement de déchets ?',
    name: 'sector_waste_treatment',
    required: 'depends',
  },
  sector_energy: {
    label: "Quel type d'énergie ?",
    name: 'sector_energy',
    required: 'depends',
  },
  sector_infrastructure: {
    label: "Quel type d'infrastructure",
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
  area: {
    label: 'Zone de couverture géographique',
    name: 'area',
    required: 'true',
  },
  siret: { label: 'Votre numéro de SIRET', name: 'siret', required: 'true' },
  civility: { label: 'Civilité', name: 'civility', required: 'true' },
  lastname: { label: 'Nom', name: 'lastname', required: 'true' },
  firstname: { label: 'Prénom', name: 'firstname', required: 'true' },
  mobile: { label: 'Tél portable', name: 'mobile', required: 'true' },
  fix: { label: 'Tél fixe', name: 'fix', required: 'false' },
  email: { label: 'Adresse mail', name: 'email', required: 'true' },
  street_number: {
    label: 'N° de rue',
    name: 'street_number',
    required: 'true',
  },
  address: { label: 'Adresse postale', name: 'address', required: 'true' },
  city: { label: 'Ville', name: 'city', required: 'true' },
  postal_code: { label: 'Code postal', name: 'postal_code', required: 'true' },
  country: { label: 'Pays', name: 'country', required: 'true' },
  how_did_you_hear_about_us: {
    label: 'Comment avez-vous connu Xpert One',
    name: 'how_did_you_hear_about_us',
    required: 'true',
  },
  how_did_you_hear_about_us_other: {
    label: 'Précisez comment vous avez connu Xpert One',
    name: 'how_did_you_hear_about_us_other',
    required: 'depends',
  },
  sector_other: {
    label: "Précisez votre secteur d'activité",
    name: 'sector_other',
    required: 'depends',
  },
  france_detail: {
    label: 'Précisez votre zone géographique',
    name: 'france_detail',
    required: 'depends',
  },
  regions: { label: 'Régions', name: 'regions', required: 'depends' },
};

export const profileDataStatus: ProfileDataStatus = {
  iam: { label: 'Je suis', name: 'iam', required: 'true' },
  status: { label: 'Mon statut', name: 'status', required: 'depends' },
  company_name: {
    label: 'Nom de votre entreprise',
    name: 'company_name',
    required: 'depends',
  },
  siret: { label: 'N° SIRET', name: 'siret', required: 'depends' },
  juridic_status: {
    label: 'Mon statut juridique',
    name: 'juridic_status',
    required: 'depends',
  },
  kbis_name: { label: 'KBIS - 3 mois', name: 'kbis_name', required: 'false' },
  has_portage: {
    label: 'Avez-vous une entreprise de portage ?',
    name: 'has_portage',
    required: 'depends',
  },
  portage_name: {
    label: "Nom de l'entreprise de portage",
    name: 'portage_name',
    required: 'depends',
  },
  juridic_status_other: {
    label: 'Précisez votre statut juridique',
    name: 'juridic_status_other',
    required: 'depends',
  },
  civil_responsability_name: {
    label: 'Responsabilité civile',
    name: 'civil_responsability_name',
    required: 'false',
  },
  // rib_name: { label: "Mon RIB", name: "rib_name", required: "false" },
  urssaf_name: {
    label: 'Attestation URSSAF',
    name: 'urssaf_name',
    required: 'false',
  },
};

export const profileDataExpertise: ProfileDataExpertise = {
  seniority: { label: 'Séniorité', name: 'seniority', required: 'true' },
  specialties: {
    label: 'Quelles sont vos spécialités ?',
    name: 'specialties',
    required: 'true',
  },
  expertises: {
    label: 'Quelles sont vos expertises ?',
    name: 'expertises',
    required: 'true',
  },
  expertises_other: {
    label: 'Précisez vos expertises',
    name: 'expertises_other',
    required: 'depends',
  },
  specialties_other: {
    label: 'Précisez vos spécialités',
    name: 'specialties_other',
    required: 'depends',
  },
  habilitations: {
    label: 'Quelles sont vos habilitations ?',
    name: 'habilitations',
    required: 'false',
  },
  // cv_name: { label: "Télécharger mon CV", name: "cv_name", required: "true" },
  experiences: { label: 'Expériences', name: 'experiences', required: 'true' },
  maternal_language: {
    label: 'Langue maternelle',
    name: 'maternal_language',
    required: 'true',
  },
  diploma: {
    label: 'Précisez votre diplôme',
    name: 'diploma',
    required: 'depends',
  },
  degree: { label: "Niveau d'étude", name: 'degree', required: 'depends' },
  educations: { label: 'Formations', name: 'educations', required: 'depends' },
  habilitations_details: {
    label: 'Ajoutez les informations de vos habilitations',
    name: 'habilitations_details',
    required: 'false',
  },
  habilitations_other: {
    label: 'Précisez votre habilitation',
    name: 'habilitations_other',
    required: 'false',
  },
  other_language: {
    label: 'Autres langues',
    name: 'other_language',
    required: 'false',
  },
  other_language_detail: {
    label: 'Précisez votre autre langue',
    name: 'other_language_detail',
    required: 'false',
  },
  others: {
    label: 'Élements supplémentaires à nous communiquer',
    name: 'others',
    required: 'false',
  },
  degree_other: {
    label: "Précisez votre niveau d'étude",
    name: 'degree_other',
    required: 'depends',
  },
  maternal_language_other: {
    label: 'Précisez votre langue maternelle',
    name: 'maternal_language_other',
    required: 'depends',
  },
};

export const profileDataExperience: ProfileDataExperience = {
  company: {
    label: 'Dans quelle entreprise',
    name: 'company',
    required: 'true',
  },
  duree: { label: 'Durée exercée', name: 'duree', required: 'true' },
  has_led_team: {
    label: 'Avez-vous dirigé une équipe',
    name: 'has_led_team',
    required: 'true',
  },
  post: { label: 'Poste', name: 'post', required: 'true' },
  sector: {
    label: "Dans quel secteur d'activité",
    name: 'sector',
    required: 'true',
  },
  is_last: { label: 'Dernière expérience', name: 'is_last', required: 'true' },
  post_type: { label: 'Type de poste', name: 'post_type', required: 'true' },
  post_other: {
    label: 'Précisez votre poste',
    name: 'post_other',
    required: 'depends',
  },
  sector_energy: {
    label: "Quel type d'énergie ?",
    name: 'sector_energy',
    required: 'depends',
  },
  sector_infrastructure: {
    label: "Quel type d'infrastructure",
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
  sector_other: {
    label: 'Précisez votre secteur',
    name: 'sector_other',
    required: 'depends',
  },
  how_many_people_led: {
    label: 'Combien de personnes avez vous dirigé ?',
    name: 'how_many_people_led',
    required: 'depends',
  },
  sector_renewable_energy: {
    label: "Quel type d'énergie renouvelable ?",
    name: 'sector_renewable_energy',
    required: 'depends',
  },
  sector_waste_treatment: {
    label: 'Quel type de traitement de déchets ?',
    name: 'sector_waste_treatment',
    required: 'depends',
  },
  comments: { label: 'Commentaires', name: 'comments', required: 'false' },
};

export const profileDataEducation: ProfileDataEducation = {
  department: {
    label: 'Département géographique',
    name: 'department',
    required: 'true',
  },
  education_diploma: {
    label: 'Diplôme obtenu',
    name: 'education_diploma',
    required: 'true',
  },
  school: { label: "Nom de l'école", name: 'school', required: 'true' },
  detail_diploma: {
    label: 'Précisez votre diplôme',
    name: 'detail_diploma',
    required: 'depends',
  },
  education_others: {
    label: 'Éléments supplémentaires à nous communiquer',
    name: 'education_others',
    required: 'false',
  },
};

export const profileDataMission: ProfileDataMission = {
  sector: {
    label: "Vos secteurs d'activité",
    name: 'sector',
    required: 'true',
  },
  job_titles: {
    label: 'Vos intitulés de postes',
    name: 'job_titles',
    required: 'true',
  },
  job_titles_other: {
    label: 'Précisez vos intitulés de postes',
    name: 'job_titles_other',
    required: 'depends',
  },
  posts_type: {
    label: 'Vos types de postes',
    name: 'posts_type',
    required: 'true',
  },
  specialties: {
    label: 'Dans quelles spécialités',
    name: 'specialties',
    required: 'true',
  },
  expertises: {
    label: 'Dans quelles expertises',
    name: 'expertises',
    required: 'true',
  },
  area: {
    label: 'Ma zone géographique de recherche',
    name: 'area',
    required: 'true',
  },
  availability: {
    label: 'Date de disponiblité',
    name: 'availability',
    required: 'true',
  },
  profile_id: { label: 'Profile ID', name: 'profile_id', required: 'false' },
  revenu_type: {
    label: 'Type de revenu souhaité',
    name: 'revenu_type',
    required: 'depends',
  },
  workstation_needed: {
    label: "Avez vous besoin d'un amenagement de poste particulier ?",
    name: 'workstation_needed',
    required: 'true',
  },
  sector_other: {
    label: "Préciser votre secteur d'activité",
    name: 'sector_other',
    required: 'depends',
  },
  specialties_others: {
    label: 'Précisez vos spécialités',
    name: 'specialties_others',
    required: 'depends',
  },
  student_contract: {
    label: 'Type de contrat étudiant',
    name: 'student_contract',
    required: 'depends',
  },
  workstation_description: {
    label: "Description de l'aménagement de poste souhaité",
    name: 'workstation_description',
    required: 'depends',
  },
  expertises_others: {
    label: 'Précisez vos expertises',
    name: 'expertises_others',
    required: 'depends',
  },
  france_detail: {
    label: 'Précisez votre zone géographique',
    name: 'france_detail',
    required: 'depends',
  },
  regions: { label: 'Régions', name: 'regions', required: 'depends' },
  desired_tjm: {
    label: 'TJM souhaité',
    name: 'desired_tjm',
    required: 'depends',
  },
  desired_monthly_brut: {
    label: 'Salaire mensuel brut souhaité',
    name: 'desired_monthly_brut',
    required: 'depends',
  },
  others: {
    label: 'Éléments à nous communiquer',
    name: 'others',
    required: 'false',
  },
};
