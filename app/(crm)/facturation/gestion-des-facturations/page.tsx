'use client';

import React from 'react';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function GestionDesFacturationsPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern', 'hr', 'adv']}>
      <ComboboxMission slug="gestion-des-facturations" />
    </ProtectedRoleRoutes>
  );
}
