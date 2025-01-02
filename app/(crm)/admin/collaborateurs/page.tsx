'use client';

import React, { useEffect } from 'react';
import CollaboratorsTable from './_components/CollaboratorsTable';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function CollaboratorsPage() {
  const { collaborators, loading, fetchCollaborators } =
    useAdminCollaborators();

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoleRoutes
      notAllowedRoles={['project_manager', 'intern', 'hr', 'adv']}
    >
      <CollaboratorsTable collaborators={collaborators} />
    </ProtectedRoleRoutes>
  );
}
