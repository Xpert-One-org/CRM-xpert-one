'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import SelectComponent from '@/components/SelectComponent';
import { deleteMission } from '@functions/missions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReasonMissionDeletion } from '@/types/typesDb';
import { reasonDeleteMissionSelect } from '@/data/mocked_select';
import { useIsIntern } from '@/hooks/useRoles';

export default function DeleteMissionDialog({
  missionId,
}: {
  missionId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const isIntern = useIsIntern();

  const [reasonDelete, setReasonDelete] =
    useState<ReasonMissionDeletion | null>(null);
  const router = useRouter();

  const handleSendDeleteMission = async () => {
    if (!reasonDelete) {
      toast.error('Veuillez sélectionner un motif de suppression');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await deleteMission(missionId, reasonDelete);
      if (!error) {
        toast.success('Mission supprimée avec succès');
      }
      setPopupOpen(false);
      router.push('/mission/etats?etat=deleted');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      {!isIntern && (
        <Button variant={'destructive'} onClick={() => setPopupOpen(true)}>
          Supprimer la mission
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
            <SelectComponent
              className="xl:max-w-[300px]"
              label="Motif de suppression"
              placeholder="Choississez un motif"
              name={reasonDelete ?? ''}
              options={reasonDeleteMissionSelect}
              defaultSelectedKeys={reasonDelete}
              onValueChange={(value) =>
                setReasonDelete(value as ReasonMissionDeletion)
              }
              required
            />
          </div>

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Annuler demande de suppresion</Button>
            </CredenzaClose>

            <Button
              disabled={!reasonDelete}
              onClick={handleSendDeleteMission}
              className="w-fit self-end px-spaceContainer"
              variant={'destructive'}
            >
              {isLoading ? 'Chargement...' : 'Supprimer la mission'}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
