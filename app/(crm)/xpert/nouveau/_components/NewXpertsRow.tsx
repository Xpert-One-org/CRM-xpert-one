import { cn } from '@/lib/utils';
import type { DBUser } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClick: () => void;
  user: DBUser;
};

export default function NewXpertsRow({ user, isOpen, onClick }: Props) {
  return (
    <>
      <div className="flex" onClick={onClick}>
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

const Box = ({
  children,
  isSelected,
  className,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-visible rounded-xs bg-lightgray-secondary px-2 py-6 text-center text-sm text-dark transition-colors',
        className,
        { 'bg-background': isSelected }
      )}
    >
      {children}
    </div>
  );
};
