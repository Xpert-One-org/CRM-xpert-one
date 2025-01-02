'use client';

import { useSearchParams } from 'next/navigation';
import NewsXpertFournisseursTable from './_components/NewTable';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function NouveauxInscritsPage() {
  const searchParams = useSearchParams();

  const role = searchParams.get('role');

  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <NewsXpertFournisseursTable role={role ?? ''} />
    </ProtectedRoleRoutes>
  );
}
