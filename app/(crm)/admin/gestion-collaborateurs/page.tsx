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
import type { DBReferentType } from '@/types/typesDb';

export default function GestionCollaborateursPage() {
  const { fetchCollaborators } = useAdminCollaborators();
  const {
    updateXpertReferent,
    setHasReferentReassign,
    updateXpertGroupReferent,
  } = useXpertStore();
  const {
    updateFournisseurReferent,
    setHasReferentReassign: setHasReferentReassignFournisseur,
  } = useFournisseurStore();

  const [xpertGroupPendingChanges, setXpertGroupPendingChanges] = useState<
    { post: string; affected_referent: DBReferentType | null }[]
  >([]);

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
      const xpertGroupResults = await Promise.all(
        xpertGroupPendingChanges.map((change) =>
          updateXpertGroupReferent(change.post, change.affected_referent)
        )
      );
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

      setHasReferentReassign(false);

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

      setHasReferentReassignFournisseur(false);

      const errors = [
        ...xpertResults,
        ...fournisseurResults,
        ...xpertGroupResults,
      ].filter((result) => result);

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

  const hasGroupPendingChanges = xpertGroupPendingChanges.length > 0;

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
              setGroupPendingChanges={setXpertGroupPendingChanges}
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

        {(hasPendingChanges || hasGroupPendingChanges) && (
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
