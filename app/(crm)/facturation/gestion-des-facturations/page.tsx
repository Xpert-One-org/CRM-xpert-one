'use client';

import React from 'react';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function GestionDesFacturationsPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern']}>
      <ComboboxMission slug="gestion-des-facturations" />
    </ProtectedRoleRoutes>
  );
}
