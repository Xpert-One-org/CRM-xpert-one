import { cn } from '@/lib/utils';
import React from 'react';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-y-spaceSmall pt-spaceContainer">
      <p className={cn('text-lg font-normal')}>Profil</p>

      <p className={cn('text-lg font-normal')}>Autres informations</p>
    </div>
  );
}
