import {
  getCompanyRoles,
  insertCompanyRole,
} from '@functions/select/company-role';
import { getCountries } from '@functions/select/countries';
import { getDiplomas, insertDiploma } from '@functions/select/diploma';
import { getExpertises, insertExpertise } from '@functions/select/expertises';
import {
  getHabilitations,
  insertHabilitation,
} from '@functions/select/habilitations';
import {
  getInfrastructures,
  insertInfrastructure,
} from '@functions/select/infrastructures';
import { getJobTitles, insertJobTitle } from '@functions/select/job-titles';
import { getLanguages, insertLanguage } from '@functions/select/languages';
import { getPosts, insertPost } from '@functions/select/posts';
import { getRegions } from '@functions/select/regions';
import { getSectors, insertSector } from '@functions/select/sectors';
import { getSpecialties, insertSpecialty } from '@functions/select/specialties';
import { getSubjects, insertSubject } from '@functions/select/subjects';

import type {
  DBCompanyRoles,
  DBDiploma,
  DBExpertise,
  DBHabilitation,
  DBInfrastructures,
  DBPosts,
  DBSectors,
  DBSpecialties,
  DBSubject,
  DBJobTitles,
  DBLanguages,
  DBJuridicStatus,
} from '@/types/typesDb';

import { create } from 'zustand';
import {
  getJuridicStatus,
  insertJuridicStatus,
} from '@functions/select/juridic-status';

type Select = {
  value: string | null;
  label: string | null;
};

type SelectWithFlag = Select & {
  flag: string | null;
};

type SelectStore = {
  specialities: Select[];
  expertises: Select[];
  habilitations: Select[];
  diplomas: Select[];
  languages: Select[];
  sectors: Select[];
  jobTitles: Select[];
  countries: SelectWithFlag[];
  regions: Select[];
  companyRoles: Select[];
  posts: Select[];
  subjects: Select[];
  infrastructures: Select[];
  juridicStatus: Select[];

  loadingCompanyRoles: boolean;
  loadingDiplomas: boolean;
  loadingExpertises: boolean;
  loadingHabilitations: boolean;
  loadingInfrastructures: boolean;
  loadingJuridicStatus: boolean;
  loadingPosts: boolean;
  loadingSectors: boolean;
  loadingSpecialties: boolean;
  loadingSubjects: boolean;
  loadingJobTitles: boolean;
  loadingLanguages: boolean;
  loadingCountries: boolean;
  loadingRegions: boolean;

  fetchSpecialties: () => Promise<void>;
  fetchExpertises: () => Promise<void>;
  fetchHabilitations: () => Promise<void>;
  fetchLanguages: () => Promise<void>;
  fetchSectors: () => Promise<void>;
  fetchJobTitles: () => Promise<void>;
  fetchCountries: () => Promise<void>;
  fetchRegions: () => Promise<void>;
  fetchCompanyRoles: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchInfrastructures: () => Promise<void>;
  fetchSubjects: () => Promise<void>;
  fetchJuridicStatus: () => Promise<void>;

  addCompanyRole: (role: DBCompanyRoles) => Promise<void>;
  addDiploma: (diploma: DBDiploma) => Promise<void>;
  addExpertise: (expertise: DBExpertise) => Promise<void>;
  addHabilitation: (habilitation: DBHabilitation) => Promise<void>;
  addInfrastructure: (infrastructure: DBInfrastructures) => Promise<void>;
  addJuridicStatus: (status: DBJuridicStatus) => Promise<void>;
  addPost: (post: DBPosts) => Promise<void>;
  addSector: (sector: DBSectors) => Promise<void>;
  addSpecialty: (specialty: DBSpecialties) => Promise<void>;
  addSubject: (subject: DBSubject) => Promise<void>;
  addJobTitle: (jobTitle: DBJobTitles) => Promise<void>;
  addLanguage: (language: DBLanguages) => Promise<void>;
};

export const useSelect = create<SelectStore>((set, get) => ({
  specialities: [],
  expertises: [],
  habilitations: [],
  diplomas: [],
  languages: [],
  sectors: [],
  subjects: [],
  jobTitles: [],
  regions: [],
  countries: [],
  companyRoles: [],
  posts: [],
  infrastructures: [],
  juridicStatus: [],

  loadingCompanyRoles: true,
  loadingDiplomas: true,
  loadingExpertises: true,
  loadingHabilitations: true,
  loadingInfrastructures: true,
  loadingJuridicStatus: true,
  loadingPosts: true,
  loadingSectors: true,
  loadingSpecialties: true,
  loadingSubjects: true,
  loadingJobTitles: true,
  loadingLanguages: true,
  loadingCountries: true,
  loadingRegions: true,

  fetchSpecialties: async () => {
    if (get().specialities.length) {
      return;
    }
    set({ loadingSpecialties: true });
    const { data, error } = await getSpecialties();
    if (error) {
      console.error('Error fetching specialties:', error);
      set({ loadingSpecialties: false });
      return;
    }
    if (data) {
      set({
        specialities: data,
        loadingSpecialties: false,
      });
    }
  },
  fetchExpertises: async () => {
    if (get().expertises.length) {
      return;
    }
    set({ loadingExpertises: true });
    const { data, error } = await getExpertises();
    if (error) {
      console.error('Error fetching expertise:', error);
      set({ loadingExpertises: false });
      return;
    }
    if (data) {
      set({ expertises: data });
      set({ loadingExpertises: false });
    }
  },
  fetchHabilitations: async () => {
    if (get().habilitations.length) {
      return;
    }
    const { data, error } = await getHabilitations();
    if (error) {
      console.error('Error fetching habilitations:', error);
      return;
    }
    if (data) {
      set({ habilitations: data });
      set({ loadingHabilitations: false });
    }
  },

  fetchLanguages: async () => {
    if (get().languages.length) {
      return;
    }
    const { data, error } = await getLanguages();
    if (error) {
      console.error('Error fetching languages:', error);
      return;
    }
    if (data) {
      // const filterLanguageNotNull = data
      //   .filter((lang) => lang.label !== null)
      //   .map((lang) => ({ label: lang.label ?? '', value: lang.value ?? '' }));
      set({ languages: data });
      set({ loadingLanguages: false });
    }
  },
  fetchSectors: async () => {
    if (get().sectors.length) {
      return;
    }
    const { data, error } = await getSectors();
    if (error) {
      console.error('Error fetching sectors:', error);
      return;
    }
    if (data) {
      set({ sectors: data });
      set({ loadingSectors: false });
    }
  },
  fetchJobTitles: async () => {
    if (get().jobTitles.length) {
      return;
    }
    const { data, error } = await getJobTitles();
    if (error) {
      console.error('Error fetching job titles:', error);
      return;
    }
    if (data) {
      set({ jobTitles: data });
      set({ loadingJobTitles: false });
    }
  },
  fetchCountries: async () => {
    if (get().countries.length) {
      return;
    }
    const { data, error } = await getCountries();
    if (error) {
      console.error('Error fetching countries:', error);
      return;
    }
    if (data) {
      set({ countries: data });
      set({ loadingCountries: false });
    }
  },

  fetchRegions: async () => {
    if (get().regions.length) {
      return;
    }
    const { data, error } = await getRegions();
    if (error) {
      console.error('Error fetching regions:', error);
      return;
    }
    if (data) {
      set({ regions: data });
      set({ loadingRegions: false });
    }
  },

  fetchCompanyRoles: async () => {
    if (get().companyRoles.length) {
      return;
    }
    const { data, error } = await getCompanyRoles();
    if (error) {
      console.error('Error fetching company roles:', error);
      return;
    }
    if (data) {
      set({ companyRoles: data });
      set({ loadingCompanyRoles: false });
    }
  },

  fetchPosts: async () => {
    if (get().posts.length) {
      return;
    }
    const { data, error } = await getPosts();
    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }
    if (data) {
      set({ posts: data });
      set({ loadingPosts: false });
    }
  },
  fetchSubjects: async () => {
    if (get().subjects.length) {
      return;
    }
    const { data, error } = await getSubjects();
    if (error) {
      console.error('Error fetching subjects:', error);
      return;
    }
    if (data) {
      set({ subjects: data });
      set({ loadingSubjects: false });
    }
  },
  fetchInfrastructures: async () => {
    if (get().infrastructures.length) {
      return;
    }
    const { data, error } = await getInfrastructures();
    if (error) {
      console.error('Error fetching infrastructures:', error);
      return;
    }
    if (data) {
      set({ infrastructures: data });
      set({ loadingInfrastructures: false });
    }
  },

  fetchJuridicStatus: async () => {
    if (get().juridicStatus.length) {
      return;
    }
    const { data, error } = await getJuridicStatus();
    if (error) {
      console.error('Error fetching juridic status:', error);
      return;
    }
    if (data) {
      set({ juridicStatus: data });
      set({ loadingJuridicStatus: false });
    }
  },

  addCompanyRole: async (role: DBCompanyRoles) => {
    const { data, error } = await insertCompanyRole(role);

    if (error) {
      throw new Error(error.message);
    }

    const currentRoles = get().companyRoles || [];

    const updatedRoles = [...currentRoles, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ companyRoles: updatedRoles });
  },

  addDiploma: async (diploma: DBDiploma) => {
    const { data, error } = await insertDiploma(diploma);

    if (error) {
      throw new Error(error.message);
    }

    const currentDiplomas = get().diplomas || [];

    const updatedDiplomas = [...currentDiplomas, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ diplomas: updatedDiplomas });
  },

  addExpertise: async (expertise: DBExpertise) => {
    const { data, error } = await insertExpertise(expertise);

    if (error) {
      throw new Error(error.message);
    }

    const currentExpertises = get().expertises || [];

    const updatedExpertises = [...currentExpertises, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ expertises: updatedExpertises });
  },

  addHabilitation: async (habilitation: DBHabilitation) => {
    const { data, error } = await insertHabilitation(habilitation);

    if (error) {
      throw new Error(error.message);
    }

    const currentHabilitations = get().habilitations || [];

    const updatedHabilitations = [...currentHabilitations, data].sort(
      (a, b) => {
        const labelA = a.label ?? '';
        const labelB = b.label ?? '';
        return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
      }
    );

    set({ habilitations: updatedHabilitations });
  },

  addInfrastructure: async (infrastructure: DBInfrastructures) => {
    const { data, error } = await insertInfrastructure(infrastructure);

    if (error) {
      throw new Error(error.message);
    }

    const currentInfrastructures = get().infrastructures || [];

    const updatedInfrastructures = [...currentInfrastructures, data].sort(
      (a, b) => {
        const labelA = a.label ?? '';
        const labelB = b.label ?? '';
        return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
      }
    );

    set({ infrastructures: updatedInfrastructures });
  },

  addJuridicStatus: async (status: DBJuridicStatus) => {
    const { data, error } = await insertJuridicStatus(status);

    if (error) {
      throw new Error(error.message);
    }

    const currentJuridicStatus = get().juridicStatus || [];

    const updatedJuridicStatus = [...currentJuridicStatus, data].sort(
      (a, b) => {
        const labelA = a.label ?? '';
        const labelB = b.label ?? '';
        return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
      }
    );

    set({ juridicStatus: updatedJuridicStatus });
  },

  addPost: async (post: DBPosts) => {
    const { data, error } = await insertPost(post);

    if (error) {
      throw new Error(error.message);
    }

    const currentPosts = get().posts || [];

    const updatedPosts = [...currentPosts, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ posts: updatedPosts });
  },

  addSector: async (sector: DBSectors) => {
    const { data, error } = await insertSector(sector);

    if (error) {
      throw new Error(error.message);
    }

    const currentSectors = get().sectors || [];

    const updatedSectors = [...currentSectors, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ sectors: updatedSectors });
  },

  addSpecialty: async (specialty: DBSpecialties) => {
    const { data, error } = await insertSpecialty(specialty);

    if (error) {
      throw new Error(error.message);
    }

    const currentSpecialties = get().specialities || [];

    const updatedSpecialties = [...currentSpecialties, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ specialities: updatedSpecialties });
  },

  addSubject: async (subject: DBSubject) => {
    const { data, error } = await insertSubject(subject);

    if (error) {
      throw new Error(error.message);
    }

    const currentSubjects = get().subjects || [];

    const updatedSubjects = [...currentSubjects, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ subjects: updatedSubjects });
  },

  addJobTitle: async (jobTitle: DBJobTitles) => {
    const { data, error } = await insertJobTitle(jobTitle);

    if (error) {
      throw new Error(error.message);
    }

    const currentJobTitles = get().jobTitles || [];

    const updatedJobTitles = [...currentJobTitles, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ jobTitles: updatedJobTitles });
  },

  addLanguage: async (language: DBLanguages) => {
    const { data, error } = await insertLanguage(language);

    if (error) {
      throw new Error(error.message);
    }

    const currentLanguages = get().languages || [];

    const updatedLanguages = [...currentLanguages, data].sort((a, b) => {
      const labelA = a.label ?? '';
      const labelB = b.label ?? '';
      return labelA === 'Autre' ? 1 : labelA.localeCompare(labelB);
    });

    set({ languages: updatedLanguages });
  },
}));
