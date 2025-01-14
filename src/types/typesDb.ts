import type { Database } from './supabase';

export type DBProfile = Database['public']['Tables']['profile']['Row'];
export type DBProfileEducation =
  Database['public']['Tables']['profile_education']['Row'];
export type DBProfileExperience =
  Database['public']['Tables']['profile_experience']['Row'];
export type DBProfileStatus =
  Database['public']['Tables']['profile_status']['Row'];

export type DBProfileProgression = Pick<
  DBProfile,
  | 'profile_progression'
  | 'totale_progression'
  | 'status_progression'
  | 'expertise_progression'
>;

export type DBProfileExpertise =
  Database['public']['Tables']['profile_expertise']['Row'] & {
    experiences: DBProfileExperience[];
    educations: DBProfileEducation[];
  };
export type DBProfileMission =
  Database['public']['Tables']['profile_mission']['Row'];

export type DBUser = DBProfile & {
  status: DBProfileStatus;
  expertise: DBProfileExpertise;
  mission: DBProfileMission;
};

export type DBFournisseur = DBProfile & {
  mission: DBMission[];
  profile_status: DBProfileStatus | null;
};

export type DBMatchedXpert = DBProfileMission & {
  id: string;
  firstname: string;
  lastname: string;
  generated_id: string;
  profile_mission: DBProfileMission;
  profile_experience: DBProfileExperience[];
  profile_expertise: DBProfileExpertise;
  matchingScore: number;
  nonMatchingCriteria: Record<string, string[]>;
};

export type DBXpert = DBProfile & {
  profile_mission: DBProfileMission | null;
  mission: DBMission[];
  profile_status: DBProfileStatus | null;
  profile_expertise: DBProfileExpertise | null;
};

// NOTIFICATION
export type DBNotification = Pick<
  Database['public']['Tables']['notification']['Row'],
  'id'
> & {
  chat: Database['public']['Tables']['chat']['Row'] & {
    message: Database['public']['Tables']['message']['Row'][];
  };
};

// CHAT
export type DBChat = Database['public']['Tables']['chat']['Row'] & {
  messages: Database['public']['Tables']['message']['Row'][];
  mission: {
    mission_number?: Database['public']['Tables']['mission']['Row']['mission_number'];
  } | null;
};

export type DBMessage = Database['public']['Tables']['message']['Row'] & {
  user?: Pick<
    DBProfile,
    | 'role'
    | 'company_name'
    | 'generated_id'
    | 'firstname'
    | 'lastname'
    | 'username'
    | 'avatar_url'
  > | null;
  base_msg?: DBBaseMsg | null;
};

export type DBBaseMsg = Pick<
  DBMessage,
  'id' | 'content' | 'created_at' | 'send_by'
> & {
  profile: Pick<
    DBProfile,
    | 'role'
    | 'company_name'
    | 'generated_id'
    | 'firstname'
    | 'lastname'
    | 'avatar_url'
    | 'username'
  > | null;
};

export type DBForum = Database['public']['Tables']['chat']['Row'] & {
  messages: Database['public']['Tables']['message']['Row'][];
  user: Pick<
    DBProfile,
    'role' | 'company_name' | 'generated_id' | 'firstname' | 'lastname'
  > | null;
};

// BLOG
export type DBArticle = Database['public']['Tables']['article']['Row'];

// SETTINGS
export type DBUserAlerts = Database['public']['Tables']['user_alerts']['Row'];

// MISSIONS
export type DBMission = Database['public']['Tables']['mission']['Row'] & {
  company_name?: string | null;
  supplier?: DBProfile | null;
  xpert?: DBProfile | null;
  generated_id?: string | null;
  mission_application?: Database['public']['Tables']['mission_application']['Row'][];
};

// CUSTOM TYPES
export type ChatType = Database['public']['Enums']['chat_type'];

export type MsgFiles = Database['public']['CompositeTypes']['msg_files'];

export type DBRevenuType = Database['public']['Enums']['revenu_type'];

export type DBMissionState = Database['public']['Enums']['mission_state'];

export type DBXpertDemand =
  Database['public']['Tables']['contact_xpert_demands']['Row'] & {
    user: DBProfile;
    asked_xpert: DBProfile;
  };

export type DBHabilitationDetail =
  Database['public']['CompositeTypes']['habilitation_detail'];

export type DBPosts = Database['public']['Tables']['posts']['Row'];
export type DBCompanyRoles =
  Database['public']['Tables']['company_roles']['Row'];
export type DBSectors = Database['public']['Tables']['sectors']['Row'];
export type DBInfrastructures =
  Database['public']['Tables']['infrastructures']['Row'];
export type DBSpecialties = Database['public']['Tables']['specialties']['Row'];
export type DBExpertise = Database['public']['Tables']['expertises']['Row'];
export type DBHabilitation =
  Database['public']['Tables']['habilitations']['Row'];
export type DBDiploma = Database['public']['Tables']['diplomas']['Row'];
export type DBJuridicStatus =
  Database['public']['Tables']['juridic_status']['Row'];
export type DBSubject = Database['public']['Tables']['subjects']['Row'];
export type DBJobTitles = Database['public']['Tables']['job_titles']['Row'];
export type DBLanguages = Database['public']['Tables']['languages']['Row'];

export type DBUserChat = Pick<
  Database['public']['Tables']['profile']['Row'],
  | 'firstname'
  | 'lastname'
  | 'avatar_url'
  | 'role'
  | 'company_name'
  | 'generated_id'
  | 'username'
>;

export type ColumnStatus = Database['public']['Enums']['selection_column_type'];

export type ReasonMissionDeletion =
  Database['public']['Enums']['reason_mission_deletion'];

export type DBMissionXpertsSelection =
  Database['public']['Tables']['selection_matching']['Row'] & {
    xpert: Pick<DBProfile, 'firstname' | 'lastname' | 'generated_id'>;
    creator: Pick<DBProfile, 'firstname' | 'lastname'>;
  };

export type DBXpertOptimized = Pick<
  DBXpert,
  | 'id'
  | 'lastname'
  | 'firstname'
  | 'country'
  | 'generated_id'
  | 'cv_name'
  | 'created_at'
  | 'admin_opinion'
  | 'affected_referent_id'
> & {
  mission: Pick<DBMission, 'xpert_associated_id'>[];
  profile_mission: Pick<DBProfileMission, 'job_titles' | 'availability'> | null;
  profile_experience: Pick<DBProfileExperience, 'post' | 'post_other'> | null;
};

export type DBReferentType =
  Database['public']['CompositeTypes']['referent_type'];

export type DBXpertLastPost = {
  post: string | null;
  referents: DBReferentType[] | null;
};

export type DBCollaboratorRole = Database['public']['Enums']['profile_roles'];

export type DBCollaborator = {
  id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  role: DBCollaboratorRole;
  collaborator_is_absent: boolean | null;
  collaborator_replacement_id: string | null;
};
