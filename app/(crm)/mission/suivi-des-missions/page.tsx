'use client';

import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import React from 'react';

export default function MissionSuiviDesMissionsPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <div>Suivi des missions</div>
    </ProtectedRoleRoutes>
  );
}
