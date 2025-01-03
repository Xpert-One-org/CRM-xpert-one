'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import XpertGestionCollaborateursTable from './_components/XpertGestionCollaborateursTable';
import FournisseurGestionCollaborateursTable from './_components/FournisseurGestionCollaborateursTable';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import { useXpertStore } from '@/store/xpert';
import { useFournisseurStore } from '@/store/fournisseur';
import { toast } from 'sonner';

export default function GestionCollaborateursPage() {
  const { fetchCollaborators } = useAdminCollaborators();
  const { updateXpertReferent } = useXpertStore();
  const { updateFournisseurReferent } = useFournisseurStore();

  const [xpertPendingChanges, setXpertPendingChanges] = useState<
    { id: string; affected_referent_id: string | null }[]
  >([]);
  const [fournisseurPendingChanges, setFournisseurPendingChanges] = useState<
    { id: string; affected_referent_id: string | null }[]
  >([]);

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  const handleSaveAll = async () => {
    try {
      const xpertResults = await Promise.all(
        xpertPendingChanges.map((change) =>
          updateXpertReferent(
            change.id,
            change.affected_referent_id === 'none'
              ? null
              : change.affected_referent_id
          )
        )
      );

      const fournisseurResults = await Promise.all(
        fournisseurPendingChanges.map((change) =>
          updateFournisseurReferent(
            change.id,
            change.affected_referent_id === 'none'
              ? null
              : change.affected_referent_id
          )
        )
      );

      const errors = [...xpertResults, ...fournisseurResults].filter(
        (result) => result
      );

      if (errors.length > 0) {
        toast.error(
          errors.join(', ') || 'Une erreur est survenue lors de la sauvegarde'
        );
        return;
      }

      setXpertPendingChanges([]);
      setFournisseurPendingChanges([]);
      toast.success(
        'Toutes les modifications ont été enregistrées avec succès'
      );
    } catch (error) {
      console.error('Error saving all changes:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde');
    }
  };

  const hasPendingChanges =
    xpertPendingChanges.length > 0 || fournisseurPendingChanges.length > 0;

  return (
    <ProtectedRoleRoutes
      notAllowedRoles={['project_manager', 'intern', 'hr', 'adv']}
    >
      <div className="flex h-[calc(100vh-200px)] flex-col gap-6">
        <div className="h-3/5 overflow-auto">
          <div className="h-full">
            <XpertGestionCollaborateursTable
              pendingChanges={xpertPendingChanges}
              setPendingChanges={setXpertPendingChanges}
            />
          </div>
        </div>
        <div className="h-3/5 overflow-auto">
          <div className="h-full">
            <FournisseurGestionCollaborateursTable
              pendingChanges={fournisseurPendingChanges}
              setPendingChanges={setFournisseurPendingChanges}
            />
          </div>
        </div>

        {hasPendingChanges && (
          <div className="flex justify-end">
            <Button
              onClick={handleSaveAll}
              className="bg-primary px-spaceLarge py-spaceContainer text-white"
            >
              Enregistrer
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoleRoutes>
  );
}
