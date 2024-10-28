import { getCompanyRoles } from '@functions/select/company-role';
import { getCountries } from '@functions/select/countries';
import { getDiplomas } from '@functions/select/diploma';
import { getExpertises } from '@functions/select/expertises';
import { getHabilitations } from '@functions/select/habilitations';
import { getInfrastructures } from '@functions/select/ionfrastructures';
import { getJobTitles } from '@functions/select/job-titles';
import { getLanguages } from '@functions/select/languages';
import { getPosts } from '@functions/select/posts';
import { getRegions } from '@functions/select/regions';
import { getSectors } from '@functions/select/sectors';
import { getSpecialties } from '@functions/select/specialties';
import { getSubjects } from '@functions/select/subjects';

import { create } from 'zustand';

type Select = {
  value: string | null;
  label: string | null;
};

type SelectStore = {
  specialities: Select[];
  expertises: Select[];
  habilitations: Select[];
  diplomas: Select[];
  languages: Select[];
  sectors: Select[];
  jobTitles: Select[];
  countries: Select[];
  regions: Select[];
  companyRoles: Select[];
  posts: Select[];
  subjects: Select[];
  infrastructures: Select[];
  fetchSpecialties: () => Promise<void>;
  fetchExpertises: () => Promise<void>;
  fetchHabilitations: () => Promise<void>;
  fetchDiplomas: () => Promise<void>;
  fetchLanguages: () => Promise<void>;
  fetchSectors: () => Promise<void>;
  fetchJobTitles: () => Promise<void>;
  fetchCountries: () => Promise<void>;
  fetchRegions: () => Promise<void>;
  fetchCompanyRoles: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchInfrastructures: () => Promise<void>;
  fetchSubjects: () => Promise<void>;
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
  fetchSpecialties: async () => {
    if (get().specialities.length) {
      return;
    }
    const { data, error } = await getSpecialties();
    if (error) {
      console.error('Error fetching specialties:', error);
      return;
    }
    if (data) {
      set({ specialities: data });
    }
  },
  fetchExpertises: async () => {
    if (get().expertises.length) {
      return;
    }
    const { data, error } = await getExpertises();
    if (error) {
      console.error('Error fetching expertise:', error);
      return;
    }
    if (data) {
      set({ expertises: data });
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
    }
  },
  fetchDiplomas: async () => {
    if (get().diplomas.length) {
      return;
    }
    const { data, error } = await getDiplomas();
    if (error) {
      console.error('Error fetching diplomas:', error);
      return;
    }
    if (data) {
      set({ diplomas: data });
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
      set({ languages: data });
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
    }
  },
}));
