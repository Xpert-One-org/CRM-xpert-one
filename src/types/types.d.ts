import type { Database } from './supabase';
import type {
  DBMission,
  DBProfileEducation,
  DBProfileExperience,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBUser,
} from './typesDb';
import type { DBProfile } from './typesDb';

type User = DBUser;

type Mission = {
  sector: string[] | null;
  posts_type: string[] | null;
  specialties: string[] | null;
  expertises: string[] | null;
  others: string | null;
  availability: string | null;
  area: string | null;
  postal_code: string | null;
  country: string | null;
  continent: string | null;
  desired_tjm: string | null;
  desired_monthly_brut: string | null;
  workstation_needed: boolean;
  workstation_description: string | null;
};

type Reaction = {
  emoji: string;
  user_id: string[];
  count: number;
};

type State =
  | 'to_validate'
  | 'open'
  | 'open_all'
  | 'in_progress'
  | 'deleted'
  | 'finished';

type Role = 'xpert' | 'company';

type Select = {
  label: string;
  value: string;
};

type Status = {
  iam: string | null;
  status: string | null;
  rib: _File | null;
  company_name: string | null;
  juridic_status: string;
  siret: string | null;
  kbis: _File | null;
  civil_responsability: _File | null;
  urssaf: _File | null;
  has_portage: boolean | null;
  portage_name: string | null;
};

type Expertise = {
  seniority: number;
  specialties: string[] | null;
  expertises: string[] | null;
  habilitations: string[] | null;
  diploma: string | null;
  degree: string | null;
  other: string | null;
  maternal_language: string | null;
  other_language: Language[];
  cv: _File | null;
  educations: Education[];
  experiences: Experience[];
};

type Education = {
  diploma: string | null;
  detail_diploma: string | null;
  school: string | null;
  department: string | null;
  others: string | null;
};

type Language = {
  language: string | null;
  level: string | null;
};

type Experience = {
  is_last: boolean;
  post: string | null;
  company: string | null;
  duree: string | null;
  has_led_team: boolean | null;
  how_many_people_led: string | null;
  sector: string | null;
  post_type: string | null;
  comments: string | null;
};

type Required = 'true' | 'false' | 'depends';

type ProfileData = Partial<{
  [key in keyof DBUser]: {
    label: string;
    name?: keyof DBUser;
    required?: Required;
  };
}>;

type ProfileDataStatus = Partial<{
  [key in keyof DBProfileStatus]: {
    label: string;
    name?: keyof DBProfileStatus;
    required?: Required;
  };
}>;

type ProfileDataExpertise = Partial<{
  [key in keyof DBProfileExpertise]: {
    label: string;
    name?: keyof DBProfileExpertise;
    required?: Required;
  };
}>;

type ProfileDataExperience = Partial<{
  [key in keyof DBProfileExperience]: {
    label: string;
    name?: keyof DBProfileExperience;
    required?: Required;
  };
}>;

type ProfileDataEducation = Partial<{
  [key in keyof DBProfileEducation]: {
    label: string;
    name?: keyof DBProfileEducation;
    required?: Required;
  };
}>;

type ProfileDataMission = Partial<{
  [key in keyof DBProfileMission]: {
    label: string;
    name?: keyof DBProfileMission;
    required?: Required;
  };
}>;

type ProfileDataUnion =
  | ProfileData
  | ProfileDataStatus
  | ProfileDataExpertise
  | ProfileDataExperience
  | ProfileDataEducation
  | ProfileDataMission;

type UserType =
  | DBUser
  | DBProfileStatus
  | DBProfileExpertise
  | DBProfileExperience
  | DBProfileEducation
  | DBProfileMission
  | DBMission;

type CreationMission = Partial<{
  [key in keyof DBMission]: {
    label: string;
    name?: keyof DBMission;
    required?: Required;
  };
}>;

type Country = {
  label: string;
  value: string;
};

type Region = {
  label: string;
  value: string;
  zone: string;
};

type _File = {
  name: string;
  url: string;
};

// Types de base depuis la définition de la table
export type TaskStatus = Database['public']['Enums']['task_status'];
export type TaskSubjectType = Database['public']['Enums']['task_subject_type'];

// Type de base pour une tâche
export type Task = Database['public']['Tables']['tasks']['Row'];

// Type pour l'insertion d'une nouvelle tâche
export type InsertTask = Database['public']['Tables']['tasks']['Insert'];

// Type pour la mise à jour d'une tâche
export type UpdateTask = Database['public']['Tables']['tasks']['Update'];

// Type étendu avec les relations
export type TaskWithRelations = Task & {
  created_by_profile: Pick<
    DBProfile,
    'id' | 'firstname' | 'lastname' | 'generated_id'
  >;
  assigned_to_profile: Pick<
    DBProfile,
    'id' | 'firstname' | 'lastname' | 'generated_id'
  >;
  xpert?: Pick<
    DBProfile,
    'id' | 'firstname' | 'lastname' | 'generated_id'
  > | null;
  supplier?: Pick<
    DBProfile,
    'id' | 'firstname' | 'lastname' | 'generated_id'
  > | null;
  mission?: Pick<
    DBMission,
    'id' | 'job_title' | 'mission_number' | 'state'
  > | null;
};

export type FilterXpert = {
  jobTitles: string;
  availability: string;
  cv: string;
  countries: string[];
  sortDate: string;
  firstname: string;
  lastname: string;
  generated_id: string;
  adminOpinion: AdminOpinionValue;
};

export type FilterTasks = {
  createdBy?: string;
  assignedTo?: string;
  status?: TaskStatus;
  subjectType?: SubjectType;
};

export type AdminOpinionValue = 'positive' | 'neutral' | 'negative' | '';
export type TaskHistoryAction =
  Database['public']['Enums']['task_history_action'];
