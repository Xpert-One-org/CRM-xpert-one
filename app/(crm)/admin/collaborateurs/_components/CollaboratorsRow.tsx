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
import EditCollaboratorDialog from './EditCollaboratorDialog';
import { useAdminCollaborators } from '@/store/adminCollaborators';

type Props = {
  collaborator: Collaborator;
  statusOptions: { label: string; value: string }[];
  yesNoOptions: { label: string; value: string }[];
  onRoleChange: (id: string, role: DBCollaboratorRole) => void;
  onAbsenceChange: (id: string, value: boolean) => void;
  onReplacementChange: (id: string, replacementId: string | null) => void;
};

export default function CollaboratorsRow({
  collaborator,
  statusOptions,
  yesNoOptions,
  onRoleChange,
  onAbsenceChange,
  onReplacementChange,
}: Props) {
  const { collaborators } = useAdminCollaborators();
  const handleRoleChange = (value: DBCollaboratorRole) => {
    onRoleChange(collaborator.id, value);
  };

  const handleAbsenceChange = (value: string) => {
    onAbsenceChange(collaborator.id, value === 'yes' ? true : false);
  };

  const handleReplacementChange = (value: string) => {
    if (value === 'none') {
      onReplacementChange(collaborator.id, 'none');
    } else {
      const replacementId = collaborators.find((c) => c.email === value)?.id;
      onReplacementChange(collaborator.id, replacementId ?? null);
    }
  };

  const getCurrentReplacementValue = () => {
    if (!collaborator.collaborator_replacement_id) {
      return 'none';
    }
    const replacement = collaborators.find(
      (c) => c.id === collaborator.collaborator_replacement_id
    );
    return replacement?.email ?? 'none';
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
        <Select
          value={collaborator.collaborator_is_absent ? 'yes' : 'no'}
          onValueChange={handleAbsenceChange}
        >
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
        <Select
          value={getCurrentReplacementValue()}
          onValueChange={handleReplacementChange}
        >
          <SelectTrigger className="h-full justify-center gap-2 border-0">
            <SelectValue placeholder="Aucun remplaçant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun remplaçant</SelectItem>
            {collaborators.map((c) => (
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
