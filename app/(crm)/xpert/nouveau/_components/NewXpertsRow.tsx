import { Box } from '@/components/ui/box';
import type { DBProfile, DBUser } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClick: () => void;
  user: DBProfile;
};

export default function NewXpertsRow({ user, isOpen, onClick }: Props) {
  return (
    <>
      <div className="flex cursor-pointer" onClick={onClick}>
        <Box isSelected={isOpen}>
          <p>{formatDate(user.created_at) ?? 'Non renseigné'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{user.generated_id ?? 'Non renseigné'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{user.role ?? 'Non renseigné'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{`${user.totale_progression ?? '0'}%`}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{user.firstname ?? 'Non renseigné'}</p>
        </Box>
      </div>
    </>
  );
}
