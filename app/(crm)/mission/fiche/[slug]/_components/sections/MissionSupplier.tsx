import React, { useState, useEffect } from 'react';
import { useFournisseurStore } from '@/store/fournisseur';
import { useEditMissionStore } from '../../../editMissionStore';
import { Label } from '@/components/ui/label';

import Link from 'next/link';
import { toast } from 'sonner';
import Combobox from '@/components/combobox/Combobox';
import Button from '@/components/Button';

export function MissionSupplier() {
  const {
    openedMissionNotSaved: mission,
    handleUpdateSupplier,
    loading,
  } = useEditMissionStore();
  const { fournisseurs, fetchFournisseurs } = useFournisseurStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (isChanging) {
      fetchFournisseurs();
    }
  }, [isChanging, fetchFournisseurs]);

  // Si une recherche est lancée, pré-remplir avec le fournisseur actuel
  useEffect(() => {
    if (mission?.supplier && !searchTerm && isChanging) {
      const companyInfo = mission.supplier.company_name
        ? ` - ${mission.supplier.company_name}`
        : '';
      const currentSupplier = `${mission.supplier.firstname} ${mission.supplier.lastname}${companyInfo} (${mission.supplier.generated_id})`;
      setSearchTerm(currentSupplier);
    }
  }, [mission?.supplier, isChanging, searchTerm]);

  if (!mission) return null;

  const handleChangeSupplier = async (value: string) => {
    if (!fournisseurs) return;

    const fournisseurId = value.split('(')[1]?.replace(')', '').toUpperCase();
    if (!fournisseurId) return;

    const findFournisseur = fournisseurs.find(
      (fournisseur) => fournisseur.generated_id === fournisseurId
    );

    if (findFournisseur) {
      // Vérifier que ce n'est pas déjà le même fournisseur
      if (mission.supplier?.id === findFournisseur.id) {
        toast.info('Ce fournisseur est déjà associé à cette mission');
        setIsChanging(false);
        return;
      }

      await handleUpdateSupplier(findFournisseur.id);
      // La mise à jour de l'état se fait dans handleUpdateSupplier
      setIsChanging(false);
    }
  };

  // Format des données pour le combobox
  const formattedFournisseurs =
    fournisseurs?.map((fournisseur) => {
      const companyInfo = fournisseur.company_name
        ? ` - ${fournisseur.company_name}`
        : '';

      return `${fournisseur.firstname} ${fournisseur.lastname}${companyInfo} (${fournisseur.generated_id})`;
    }) ?? [];

  const toggleChangeSupplier = () => {
    setIsChanging(!isChanging);
    if (!isChanging) {
      setSearchTerm('');
    }
  };

  const currentSupplier = mission.supplier;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Fournisseur</h3>

      {!isChanging ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Fournisseur actuel</Label>
              <p className="text-md">
                {currentSupplier ? (
                  <>
                    {currentSupplier.company_name || 'N/A'} -{' '}
                    {currentSupplier.firstname} {currentSupplier.lastname}
                  </>
                ) : (
                  'Aucun fournisseur associé'
                )}
              </p>
              <p className="text-sm text-gray-600">
                ID: {currentSupplier?.generated_id || 'N/A'}
              </p>
            </div>

            <div className="flex gap-2">
              {currentSupplier && (
                <Link href={`/fournisseur?id=${currentSupplier.generated_id}`}>
                  <Button variant="outline" className="w-fit">
                    Voir la fiche
                  </Button>
                </Link>
              )}
              <Button
                onClick={toggleChangeSupplier}
                variant={'primary'}
                className="w-fit"
              >
                Changer de fournisseur
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Recherchez et sélectionnez un nouveau fournisseur pour cette mission
          </p>

          <Combobox
            data={formattedFournisseurs}
            value={searchTerm}
            handleSetValue={handleChangeSupplier}
            handleValueChange={setSearchTerm}
            placeholder="Rechercher un fournisseur"
            placeholderSearch="Rechercher par nom, prénom, société ou identifiant"
            classNamePopover="w-full max-w-[500px]"
          />

          <div className="flex justify-end gap-2">
            <Button onClick={toggleChangeSupplier} disabled={loading}>
              Annuler
            </Button>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Mise à jour...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
