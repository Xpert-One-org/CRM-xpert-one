'use client';

import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import React from 'react';
import SuiviMissionsTable from './_components/SuiviMissionsTable';

export default function MissionSuiviDesMissionsPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <SuiviMissionsTable />
    </ProtectedRoleRoutes>
  );
}
