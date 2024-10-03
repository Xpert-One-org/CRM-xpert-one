import { Database } from './supabase';
import type {
  DBProfileExperience,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBUser,
  DBProfileEducation,
  DBMission,
} from './typesDb';
import { DBProfile } from './typesDb';

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

type State = 'in_review' | 'open' | 'in_progress' | 'completed' | 'canceled';

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
