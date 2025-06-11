'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useIsIntern } from '@/hooks/useRoles';
import { useEditMissionStore } from '../editMissionStore';
import SelectComponent from '@/components/SelectComponent';
import { missionStates } from '@/data/mocked_select';
import type { DBMissionState } from '@/types/typesDb';
import { cloneMission } from '@functions/missions';

export default function CloneMissionDialog({
  missionId,
}: {
  missionId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<DBMissionState>('open');
  const isIntern = useIsIntern();
  const { openedMissionNotSaved: mission } = useEditMissionStore();

  const router = useRouter();

  const handleCloneMission = async () => {
    setIsLoading(true);
    try {
      // Création de l'objet mission cloné
      const clonedMission = {
        // Champs généraux
        profile_searched: mission?.profile_searched,
        job_title: mission?.job_title,
        job_title_other: mission?.job_title_other,
        post_type: mission?.post_type,
        sector: mission?.sector,
        sector_other: mission?.sector_other,
        sector_energy: mission?.sector_energy,
        sector_renewable_energy: mission?.sector_renewable_energy,
        sector_infrastructure: mission?.sector_infrastructure,
        sector_infrastructure_other: mission?.sector_infrastructure_other,
        sector_renewable_energy_other: mission?.sector_renewable_energy_other,
        sector_waste_treatment: mission?.sector_waste_treatment,

        // Compétences et qualifications
        specialties: mission?.specialties,
        specialties_other: mission?.specialties_other,
        expertises: mission?.expertises,
        expertises_other: mission?.expertises_other,
        diplomas: mission?.diplomas,
        diplomas_other: mission?.diplomas_other,
        languages: mission?.languages,
        languages_other: mission?.languages_other,

        // Conditions
        tjm: mission?.tjm,
        open_to_disabled: mission?.open_to_disabled,
        start_date: mission?.start_date,
        end_date: mission?.end_date,
        deadline_application: mission?.deadline_application,

        // Localisation
        street_number: mission?.street_number,
        address: mission?.address,
        city: mission?.city,
        postal_code: mission?.postal_code,
        country: mission?.country,

        // Description
        needed: mission?.needed,
        description: mission?.description,
        advantages_company: mission?.advantages_company,

        // Référent
        referent_name: mission?.referent_name,
        referent_mail: mission?.referent_mail,
        referent_mobile: mission?.referent_mobile,
        referent_fix: mission?.referent_fix,

        // Autres champs
        created_by: mission?.created_by,
        state: selectedState,
        show_on_website: mission?.show_on_website,

        // Champs financiers
        finance: mission?.finance
          ? {
              annex_costs: mission.finance.annex_costs,
              base_tarifaire: mission.finance.base_tarifaire,
              daily_rate: mission.finance.daily_rate,
              days_worked: mission.finance.days_worked,
              gd_rate: mission.finance.gd_rate,
              margin: mission.finance.margin,
              monthly_rate: mission.finance.monthly_rate,
              months_worked: mission.finance.months_worked,
              total_ca: mission.finance.total_ca,
              xpert_status: mission.finance.xpert_status,
            }
          : null,
      };

      const { data, error } = await cloneMission(clonedMission);

      console.log(data, error);

      setPopupOpen(false);
      //indiquer le numéro de la nouvelle mission
      toast.success(`Mission clonée avec succès : ${data?.mission_number}`);
      router.push(
        `/mission/fiche/${data?.mission_number?.split(' ').join('-').toUpperCase() ?? ''}`
      );
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du clonage de la mission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      {!isIntern && (
        <Button
          variant={'default'}
          className="text-white"
          onClick={() => setPopupOpen(true)}
        >
          Cloner la mission
        </Button>
      )}

      <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
        <div className="relative h-[175px] w-full">
          <Image
            src="/static/background.jpg"
            fill
            objectFit="cover"
            alt="confirm-popup"
          />
        </div>
        <div className="flex flex-col gap-y-spaceContainer p-6">
          <div className="grid grid-cols-1 gap-x-spaceContainer gap-y-spaceSmall md:grid-cols-3">
            <div className="col-span-1 md:col-span-3">
              <p className="text-lg font-medium">Cloner la mission</p>
              <p className="text-sm text-gray-600">
                Cette action va créer une nouvelle mission avec les mêmes
                informations que la mission actuelle. Le numéro de mission sera
                généré automatiquement.
              </p>
            </div>
            <div className="col-span-1">
              <SelectComponent
                className="xl:max-w-[300px]"
                label="État de la mission"
                placeholder="Choisissez un état"
                name="state"
                options={missionStates}
                defaultSelectedKeys={selectedState}
                onValueChange={(value) =>
                  setSelectedState(value as DBMissionState)
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Annuler</Button>
            </CredenzaClose>

            <Button
              onClick={handleCloneMission}
              className="w-fit self-end px-spaceContainer text-white"
              variant={'default'}
            >
              {isLoading ? 'Chargement...' : 'Cloner la mission'}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
