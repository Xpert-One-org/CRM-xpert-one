import React from 'react';
import { Box } from '@/components/ui/box';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Collaborator } from '@/types/collaborator';
import type { DBCollaboratorRole } from '@/types/typesDb';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import EditCollaboratorDialog from './EditCollaboratorDialog';

type Props = {
  collaborator: Collaborator;
  statusOptions: { label: string; value: string }[];
  yesNoOptions: { label: string; value: string }[];
  allCollaborators: Collaborator[];
};

export default function CollaboratorsRow({
  collaborator,
  statusOptions,
  yesNoOptions,
  allCollaborators,
}: Props) {
  const { updateCollaborator } = useAdminCollaborators();

  const handleRoleChange = async (value: DBCollaboratorRole) => {
    await updateCollaborator(collaborator.id, { role: value });
  };

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr_1.5fr_1fr] gap-3">
      <Box className="p-0">
        <Select value={collaborator.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="h-full justify-center gap-2 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>
      <Box className="px-4">{collaborator.firstname}</Box>
      <Box className="px-4">{collaborator.lastname}</Box>
      <Box className="px-4">{collaborator.mobile}</Box>
      <Box className="bg-primary px-4 text-white">{collaborator.email}</Box>
      <Box className="p-0">
        <Select defaultValue={'OUI'}>
          <SelectTrigger className="h-full justify-center gap-2 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yesNoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>
      <Box className="p-0">
        <Select defaultValue={collaborator.role}>
          <SelectTrigger className="h-full justify-center gap-2 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun remplaçant</SelectItem>
            {allCollaborators
              .filter((c) => c.email !== collaborator.email)
              .map((c) => (
                <SelectItem key={c.email} value={c.email}>
                  {c.firstname} {c.lastname}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </Box>
      <Box className="bg-primary px-4 text-white">
        <EditCollaboratorDialog collaborator={collaborator} />
      </Box>
    </div>
  );
}
