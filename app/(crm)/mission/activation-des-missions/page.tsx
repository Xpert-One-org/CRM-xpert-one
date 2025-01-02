'use client';

import React from 'react';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function ActivationDesMissionsPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <ComboboxMission slug="activation-des-missions" />
    </ProtectedRoleRoutes>
  );
}
