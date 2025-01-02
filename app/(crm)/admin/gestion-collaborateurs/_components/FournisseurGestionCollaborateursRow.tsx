'use client';

import { Box } from '@/components/ui/box';
import type { DBFournisseur } from '@/types/typesDb';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminCollaborators } from '@/store/adminCollaborators';

type FournisseurGestionCollaborateursRowProps = {
  fournisseur: DBFournisseur;
  isGroupSelection: boolean;
  onReferentChange: (id: string, referentId: string | null) => void;
  pendingReferentId?: string | null;
};

export default function FournisseurGestionCollaborateursRow({
  fournisseur,
  isGroupSelection,
  onReferentChange,
  pendingReferentId,
}: FournisseurGestionCollaborateursRowProps) {
  const { collaborators } = useAdminCollaborators();

  const handleReferentChange = (value: string) => {
    if (value === 'none') {
      onReferentChange(fournisseur.id, 'none');
    } else {
      onReferentChange(fournisseur.id, value);
    }
  };

  const getCurrentReferentValue = () => {
    const currentId = pendingReferentId ?? fournisseur.affected_referent_id;
    if (!currentId) return 'none';
    return currentId;
  };

  return (
    <div
      className={`grid ${isGroupSelection ? 'grid-cols-5' : 'grid-cols-6'} gap-3`}
    >
      <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
        {fournisseur.firstname}
      </Box>
      <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
        {fournisseur.lastname}
      </Box>
      {!isGroupSelection && (
        <Box className="flex h-12 items-center bg-primary px-4 text-white">
          {fournisseur.generated_id}
        </Box>
      )}
      <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
        {fournisseur.company_name || 'N/A'}
      </Box>
      <Box className="col-span-2 p-0">
        <Select
          value={getCurrentReferentValue()}
          onValueChange={handleReferentChange}
        >
          <SelectTrigger className="h-full justify-center gap-2 border-0 bg-[#F5F5F5]">
            <SelectValue placeholder="Non assigné" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Non assigné</SelectItem>
            {collaborators.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.firstname} {c.lastname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>
    </div>
  );
}
