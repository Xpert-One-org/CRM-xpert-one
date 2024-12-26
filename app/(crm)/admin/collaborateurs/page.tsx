'use client';

import React, { useEffect } from 'react';
import CollaboratorsTable from './_components/CollaboratorsTable';
import { useAdminCollaborators } from '@/store/adminCollaborators';

export default function CollaboratorsPage() {
  const { collaborators, loading, fetchCollaborators } =
    useAdminCollaborators();

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <CollaboratorsTable collaborators={collaborators} />;
}
