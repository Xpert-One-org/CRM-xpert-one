import { z } from 'zod';
import type { DBCollaboratorRole } from './typesDb';

export const collaboratorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  mobile: z.string().min(1),
  role: z.enum(['admin', 'project_manager', 'intern', 'hr', 'adv']),
});

export type CreateCollaboratorDTO = z.infer<typeof collaboratorSchema>;
export type Collaborator = {
  id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  role: DBCollaboratorRole;
  collaborator_is_absent: boolean | null;
  collaborator_replacement_id: string | null;
};
