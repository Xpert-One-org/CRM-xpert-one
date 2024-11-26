import type { DBMission } from '@/types/typesDb';
import React, { useState } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import Button from '@/components/Button';
import { Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function RecapMissionDialog({
  missionsData,
}: {
  missionsData: DBMission;
}) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
        <Button
          className="flex w-full items-center justify-center text-white"
          onClick={() => setPopupOpen(true)}
        >
          Récap des besoins fournisseur <Eye className="ml-1 size-4" />
        </Button>
        <CredenzaContent className="mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white p-0 backdrop-blur-sm">
          <div className="flex flex-col gap-4 rounded-lg px-spaceMediumContainer py-[10px] text-black shadow-container">
            <h3 className="text-lg font-medium text-black">
              Descriptif de la mission
            </h3>
            <div className="gap flex w-full flex-col gap-4">
              <Input
                label="Descriptif du besoin (Détaillez votre besoin quelques lignes)"
                value={missionsData.tjm ?? ''}
                disabled
              />
            </div>
            <div className="gap flex w-full flex-col gap-4">
              <Input
                label="Descriptif du poste (Brief complet de votre recherche)"
                value={missionsData.tjm ?? ''}
                disabled
              />
            </div>
            <div className="gap flex w-full flex-col gap-4">
              <Input
                label="Les + de votre entreprise"
                value={missionsData.tjm ?? ''}
                disabled
              />
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
