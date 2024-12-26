import { create } from 'zustand';
import type { Collaborator } from '@/types/collaborator';
import type { CreateCollaboratorDTO } from '@/types/collaborator';
import {
  createCollaborator,
  getCollaborators,
  updateCollaborator,
  deleteCollaborator,
} from '../../app/(crm)/admin/collaborateurs/collaborator.action';

type AdminCollaboratorsStore = {
  collaborators: Collaborator[];
  loading: boolean;

  fetchCollaborators: () => Promise<void>;
  addCollaborator: (
    collaborator: CreateCollaboratorDTO
  ) => Promise<{ error: { message: string; code: string } | null }>;
  updateCollaborator: (
    id: string,
    collaborator: Partial<Omit<Collaborator, 'id'>>
  ) => Promise<{ error: { message: string; code: string } | null }>;
  deleteCollaborator: (
    id: string
  ) => Promise<{ error: { message: string; code: string } | null }>;
};

export const useAdminCollaborators = create<AdminCollaboratorsStore>(
  (set, get) => ({
    collaborators: [],
    loading: true,

    fetchCollaborators: async () => {
      if (get().collaborators.length) {
        return;
      }
      set({ loading: true });
      const { collaborators } = await getCollaborators();

      set({
        collaborators,
        loading: false,
      });
    },

    addCollaborator: async (collaboratorData: CreateCollaboratorDTO) => {
      const { collaborator, error } = await createCollaborator({
        collaborator: collaboratorData,
      });

      if (error || !collaborator) {
        return {
          error: {
            message: error?.message || 'Failed to create collaborator',
            code: error?.code || 'unknown',
          },
        };
      }

      set({ collaborators: [...get().collaborators, collaborator] });
      return { error: null };
    },

    updateCollaborator: async (id, collaboratorData) => {
      const { collaborator, error } = await updateCollaborator({
        id,
        collaborator: collaboratorData,
      });

      if (error || !collaborator) {
        return {
          error: {
            message: error?.message || 'Failed to update collaborator',
            code: error?.code || 'unknown',
          },
        };
      }

      set({
        collaborators: get().collaborators.map((c) =>
          c.id === id ? collaborator : c
        ),
      });

      return { error: null };
    },

    deleteCollaborator: async (id) => {
      const { errorMessage } = await deleteCollaborator(id);

      if (errorMessage) {
        return { error: { message: errorMessage, code: errorMessage } };
      }

      set({
        collaborators: get().collaborators.filter((c) => c.id !== id),
      });

      return { error: null };
    },
  })
);
