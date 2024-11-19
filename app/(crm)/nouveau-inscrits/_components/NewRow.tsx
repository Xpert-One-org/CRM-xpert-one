import { Box } from '@/components/ui/box';
import type { DBProfile } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { EyeIcon } from 'lucide-react';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClick: () => void;
  user: DBProfile;
};

export default function NewRow({ user, isOpen, onClick }: Props) {
  return (
    <>
      <div className="grid w-full grid-cols-7 gap-4">
        <Box isSelected={isOpen} className="">
          <p>{formatDate(user.created_at) ?? 'Non renseigné'}</p>
        </Box>
        <Box
          isSelected={isOpen}
          primary
          className="cursor-pointer text-white"
          onClick={onClick}
        >
          <p>{user.generated_id ?? 'Non renseigné'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{user.role === 'company' ? 'F' : 'X'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{`${user.totale_progression ?? '0'}%`}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{}</p>
        </Box>
        <Box isSelected={isOpen} primary className="text-white">
          <p>{'Ceci est un commentaire ...'}</p>
          <EyeIcon className="ml-1" />
        </Box>
        <Box isSelected={isOpen}>
          <p>{user.referent_id ?? 'Non renseigné'}</p>
        </Box>
      </div>
    </>
  );
}
