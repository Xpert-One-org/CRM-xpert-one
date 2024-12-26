import React from 'react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import CreateCollaboratorDialog from './CreateCollaboratorDialog';
import Link from 'next/link';
import CollaboratorsRow from './CollaboratorsRow';
import type { Collaborator } from '@/types/collaborator';

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

export default function CollaboratorsTable({
  collaborators,
}: {
  collaborators: Collaborator[];
}) {
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
          {collaborators.map((collaborator) => (
            <CollaboratorsRow
              key={collaborator.id}
              collaborator={collaborator}
              statusOptions={statusOptions}
              yesNoOptions={yesNoOptions}
              allCollaborators={collaborators}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-primary px-spaceLarge py-spaceContainer text-white">
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
