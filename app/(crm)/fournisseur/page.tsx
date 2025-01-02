'use client';

import React from 'react';
import FournisseurTable from './_components/FournisseurTable';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function FournisseurPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <FournisseurTable />
    </ProtectedRoleRoutes>
  );
}
