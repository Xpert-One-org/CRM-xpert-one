import React from 'react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreateCollaboratorDialog from './CreateCollaborateursDialog';
import Link from 'next/link';

const statusOptions = [
  { label: 'SUPER ADMIN', value: 'super_admin' },
  { label: 'ADMIN', value: 'admin' },
  { label: "Chargé d'affaire", value: 'manager' },
  { label: 'Stagiaire', value: 'intern' },
  { label: 'RH', value: 'hr' },
];

const yesNoOptions = [
  { label: 'Oui', value: 'yes' },
  { label: 'Non', value: 'no' },
];

const mockCollaborators = [
  {
    status: 'super_admin',
    firstName: 'Thomas',
    lastName: 'Dubois',
    phone: '+33 6 12 34 56 78',
    email: 'thomas.dubois@xpertone.fr',
    absence: 'no',
    replacement: '',
  },
  {
    status: 'admin',
    firstName: 'Sophie',
    lastName: 'Martin',
    phone: '+33 6 23 45 67 89',
    email: 'sophie.martin@xpertone.fr',
    absence: 'yes',
    replacement: 'thomas.dubois@xpertone.fr',
  },
  {
    status: 'manager',
    firstName: 'Alexandre',
    lastName: 'Bernard',
    phone: '+33 6 34 56 78 90',
    email: 'alexandre.bernard@xpertone.fr',
    absence: 'no',
    replacement: '',
  },
  {
    status: 'hr',
    firstName: 'Marie',
    lastName: 'Petit',
    phone: '+33 6 45 67 89 01',
    email: 'marie.petit@xpertone.fr',
    absence: 'no',
    replacement: '',
  },
  {
    status: 'intern',
    firstName: 'Lucas',
    lastName: 'Robert',
    phone: '+33 6 56 78 90 12',
    email: 'lucas.robert@xpertone.fr',
    absence: 'yes',
    replacement: 'marie.petit@xpertone.fr',
  },
  {
    status: 'manager',
    firstName: 'Emma',
    lastName: 'Richard',
    phone: '+33 6 67 89 01 23',
    email: 'emma.richard@xpertone.fr',
    absence: 'no',
    replacement: '',
  },
];

export default function CollaboratorsTable() {
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

        <Button className="bg-primary text-white">Enregistrer</Button>
      </div>

      <div className="grid gap-3">
        {/* Header Row */}
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

        {/* Data Rows */}
        <div className="flex flex-col gap-3">
          {mockCollaborators.map((collaborator, index) => (
            <div
              key={collaborator.email}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr_1.5fr_1fr] gap-3"
            >
              <Box className="p-0">
                <Select defaultValue={collaborator.status}>
                  <SelectTrigger className="h-full border-0">
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
              <Box className="px-4">{collaborator.firstName}</Box>
              <Box className="px-4">{collaborator.lastName}</Box>
              <Box className="px-4">{collaborator.phone}</Box>
              <Box className="bg-primary px-4 text-white">
                {collaborator.email}
              </Box>
              <Box className="p-0">
                <Select defaultValue={collaborator.absence}>
                  <SelectTrigger className="h-full border-0">
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
                <Select defaultValue={collaborator.replacement || 'none'}>
                  <SelectTrigger className="h-full border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun remplaçant</SelectItem>
                    {mockCollaborators
                      .filter((c) => c.email !== collaborator.email)
                      .map((c) => (
                        <SelectItem key={c.email} value={c.email}>
                          {c.firstName} {c.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Box>
              <Box className="bg-primary px-4 text-white">
                <CreateCollaboratorDialog
                  mode="edit"
                  initialData={collaborator}
                />
              </Box>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
