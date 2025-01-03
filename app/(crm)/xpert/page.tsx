'use client';

import React from 'react';
import XpertTable from './_components/XpertTable';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function XpertPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <XpertTable />
    </ProtectedRoleRoutes>
  );
}
