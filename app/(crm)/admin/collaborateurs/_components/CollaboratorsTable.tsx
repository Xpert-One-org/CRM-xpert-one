import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import CreateCollaboratorDialog from './CreateCollaboratorDialog';
import Link from 'next/link';
import CollaboratorsRow from './CollaboratorsRow';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import { toast } from 'sonner';
import type { DBCollaboratorRole } from '@/types/typesDb';

const statusOptions = [
  { label: 'ADMIN', value: 'admin' },
  { label: "Chargé d'affaire", value: 'project_manager' },
  { label: 'Stagiaire', value: 'intern' },
  { label: 'RH', value: 'hr' },
  { label: 'ADV', value: 'adv' },
];

const yesNoOptions = [
  { label: 'Oui', value: 'yes' },
  { label: 'Non', value: 'no' },
];

export default function CollaboratorsTable() {
  const { collaborators, updateCollaboratorStatus } = useAdminCollaborators();
  const [pendingChanges, setPendingChanges] = useState<
    {
      id: string;
      role?: DBCollaboratorRole;
      collaborator_is_absent?: boolean;
      collaborator_replacement_id?: string | null;
    }[]
  >([]);

  const handleRoleChange = (id: string, role: DBCollaboratorRole) => {
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => change.id !== id);
      const existing = prev.find((change) => change.id === id);
      return [...filtered, { ...existing, id, role }];
    });
  };

  const handleAbsenceChange = (id: string, value: boolean) => {
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => change.id !== id);
      const existing = prev.find((change) => change.id === id);
      const newChanges = [
        ...filtered,
        {
          ...existing,
          id,
          collaborator_is_absent: value,
        },
      ];
      return newChanges;
    });
  };

  const handleReplacementChange = (
    id: string,
    replacementId: string | null
  ) => {
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => change.id !== id);
      const existing = prev.find((change) => change.id === id);
      return [
        ...filtered,
        { ...existing, id, collaborator_replacement_id: replacementId },
      ];
    });
  };

  const getPendingRole = (collaboratorId: string | undefined) => {
    const pendingChange = pendingChanges.find(
      (change) => change.id === collaboratorId
    );
    return pendingChange?.role;
  };

  const getPendingAbsence = (collaboratorId: string | undefined) => {
    const pendingChange = pendingChanges.find(
      (change) => change.id === collaboratorId
    );
    return pendingChange?.collaborator_is_absent;
  };

  const getPendingReplacement = (collaboratorId: string | undefined) => {
    const pendingChange = pendingChanges.find(
      (change) => change.id === collaboratorId
    );
    return pendingChange?.collaborator_replacement_id;
  };

  const handleSaveChanges = async () => {
    try {
      const validChanges = pendingChanges.filter((change) => change.id);

      const results = await Promise.all(
        validChanges.map(async (change) => {
          const updates: {
            role?: DBCollaboratorRole;
            collaborator_is_absent?: boolean;
            collaborator_replacement_id?: string | null;
          } = {};

          if (change.role !== undefined) {
            updates.role = change.role;
          }

          if (change.collaborator_is_absent !== undefined) {
            updates.collaborator_is_absent = change.collaborator_is_absent;
          }

          if (change.collaborator_replacement_id !== undefined) {
            updates.collaborator_replacement_id =
              change.collaborator_replacement_id === 'none'
                ? null
                : change.collaborator_replacement_id;
          }

          return updateCollaboratorStatus(change.id, updates);
        })
      );

      const errors = results.filter((result) => result.error);

      if (errors.length > 0) {
        toast.error(
          errors[0].error?.message ||
            'Une erreur est survenue lors de la sauvegarde'
        );
        return;
      }

      setPendingChanges([]);
      toast.success('Les modifications ont été enregistrées avec succès');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde');
    }
  };

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex w-full justify-between gap-2">
        <div className="flex gap-2">
          <CreateCollaboratorDialog />
          <Link href="/admin/gestion-collaborateurs">
            <Button className="bg-primary text-white">
              Gestion des collaborateurs
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr_1.5fr_1fr] gap-3">
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Statut
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Prénom
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Nom
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            N° téléphone
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Adresse mail
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Absence
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Remplaçant XPERT ONE
          </Box>
          <Box className="flex h-12 items-center bg-[#FDF6E9] px-4 font-semibold">
            Actions
          </Box>
        </div>

        <div className="flex flex-col gap-3">
          {collaborators.map((collaborator) => {
            const pendingRole = getPendingRole(collaborator.id);
            const pendingAbsence = getPendingAbsence(collaborator.id);
            return (
              <CollaboratorsRow
                key={collaborator.id}
                collaborator={{
                  ...collaborator,
                  role: pendingRole || collaborator.role,
                  collaborator_is_absent:
                    pendingAbsence !== undefined
                      ? pendingAbsence
                      : collaborator.collaborator_is_absent,
                  collaborator_replacement_id:
                    getPendingReplacement(collaborator.id) ??
                    collaborator.collaborator_replacement_id,
                }}
                statusOptions={statusOptions}
                yesNoOptions={yesNoOptions}
                onRoleChange={handleRoleChange}
                onAbsenceChange={handleAbsenceChange}
                onReplacementChange={handleReplacementChange}
              />
            );
          })}
        </div>
      </div>

      {pendingChanges.length > 0 && (
        <div className="flex justify-end">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSaveChanges}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
}
