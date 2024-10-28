import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { empty } from '@/data/constant';
import { useSelect } from '@/store/select';
import type { DBFournisseur } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import { uppercaseFirstLetter } from '@/utils/string';
import { Eye } from 'lucide-react';
import { X } from 'lucide-react';
import React from 'react';

export default function FournisseurRow({
  fournisseur,
  isOpen,
  onClick,
}: {
  fournisseur: DBFournisseur;
  isOpen: boolean;
  onClick: () => void;
}) {
  const dateSignUp = formatDate(fournisseur.created_at);
  const missions = fournisseur.mission;
  const { companyRoles } = useSelect();

  const fournisseurMissionsCount = missions.length > 0 ? missions.length : 0;

  return (
    <>
      <Box className="col-span-1" isSelected={isOpen}>
        {dateSignUp}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {fournisseur.lastname?.toUpperCase()}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {uppercaseFirstLetter(fournisseur.firstname ?? '')}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {uppercaseFirstLetter(
          getLabel({
            value: fournisseur.company_role ?? '',
            select: companyRoles,
          }) ?? empty
        )}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {fournisseur.generated_id}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {fournisseur.company_name?.toUpperCase()}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {fournisseurMissionsCount}
      </Box>
      <Button className="col-span-1 h-full gap-1 text-white" onClick={onClick}>
        {isOpen ? 'Fermer la fiche' : 'Ouvrir la fiche'}
        {isOpen ? (
          <X size={18} strokeWidth={4} />
        ) : (
          <Eye size={18} strokeWidth={1} />
        )}
      </Button>
    </>
  );
}
