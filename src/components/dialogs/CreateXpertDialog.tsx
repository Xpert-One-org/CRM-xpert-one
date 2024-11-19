'use client';

import React, { useState } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
// import { getLabel } from '@/utils/getLabel';
// import { genres } from '@/data/mocked_select';
// import { empty } from '@/data/constant';
// import SelectComponent from '@/components/SelectComponent';
// import { profileDataCompany } from '@/data/profile';
// import type { UserType } from '@/types/types';
// import useUser from '@/store/useUser';
// import { useField } from '@/hooks/useField';
// import { toast } from 'sonner';

export default function CreateFournisseurXpertDialog({
  role,
}: {
  role: 'company' | 'xpert';
}) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
        <Button
          className="px-spaceContainer py-spaceXSmall text-white"
          onClick={() => setPopupOpen(true)}
        >
          {role === 'company' ? 'Créer un fournisseur' : 'Créer un xpert'}
        </Button>
        <CredenzaContent className="mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
          <div className="flex flex-col gap-y-spaceContainer p-6">
            <div className="grid grid-cols-3 gap-x-spaceContainer gap-y-spaceSmall">
              <div className="col-span-1">
                <Input
                  placeholder="Adresse mail"
                  label="Adresse mail professionnelle"
                  required
                />
              </div>
              <div className="col-span-1">
                <Input
                  placeholder="Mot de passe*"
                  label="Mot de passe"
                  required
                />
              </div>
              <div className="col-span-1">
                <Input
                  placeholder="Confirmer mot de passe"
                  label="Confirmer mot de passe"
                  required
                />
              </div>
            </div>

            <p className="text-lg font-medium text-black">Mon profil</p>
            <div className="grid w-full grid-cols-6 gap-4">
              <div className="col-span-1">
                {/* <SelectComponent
                  hasError={checkIfRequiredAndNotMissing(
                    profileDataCompany.civility?.name as keyof UserType
                  )}
                  className="input"
                  label={profileDataCompany.civility?.label}
                  options={genres}
                  defaultSelectedKeys={civility ?? ''}
                  name={profileDataCompany.civility?.name ?? ''}
                  required
                  onValueChange={handleChangeProfileSelect}
                /> */}
                <Input label="Civilité" placeholder="Monsieur" />
              </div>

              <div className="col-span-2">
                <Input
                  type="date"
                  label="Date de naissance"
                  value={'1990-01-01'}
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-6 gap-4">
              <div className="col-span-2">
                <Input label="Nom" placeholder="Votre nom" required />
              </div>
              <div className="col-span-2">
                <Input label="Prénom" placeholder="Votre prénom" required />
              </div>
            </div>

            <div className="h-px w-full bg-gray-200" />
            <p className="text-lg font-medium text-black">
              Informations personnelles
            </p>
            <div className="grid w-full grid-cols-6 gap-4">
              <div className="col-span-2">
                <Input
                  label="Tél portable"
                  placeholder="Télephone portable"
                  required
                />
              </div>
              <div className="col-span-2">
                <Input label="Tél fixe" placeholder="Télephone fixe" />
              </div>
            </div>

            <div className="grid w-full grid-cols-6 gap-4">
              <div className="col-span-1">
                <Input label="N° de rue" placeholder="32 bis" />
              </div>
              <div className="col-span-2">
                <Input label="Addresse postale" placeholder="Adresse postale" />
              </div>
              <div className="col-span-1">
                <Input label="Ville" placeholder="Paris(16e)" />
              </div>
              <div className="col-span-1">
                <Input label="Code postal " placeholder="75016" />
              </div>
              <div className="col-span-1">
                <Input label="Pays" placeholder="France" />
              </div>
            </div>

            <div className="h-px w-full bg-gray-200" />
            <p className="text-lg font-medium text-black">
              Autres informations
            </p>
            <div className="grid grid-cols-3 gap-x-spaceContainer gap-y-spaceSmall">
              <div className="col-span-1">
                <Input
                  label="Profil LinkedIn"
                  placeholder="https://martinleduc.linkedin.com"
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Comment avez vous connu Xpert One ?"
                  placeholder="Choisir"
                />
              </div>
              <div className="col-span-1">
                <Input label="Je suis parrainé par" placeholder="Choisir" />
              </div>
            </div>

            <div className="flex gap-x-spaceSmall self-end">
              <Button
                // disabled={!reasonDelete}
                // onClick={handleSendDeleteMission}
                className="min-w-[200px] rounded"
                shape={'right_bottom'}
              >
                {/* {isLoading ? 'Chargement...' : 'DEMANDER LA SUPPRESSION'} */}
                Enregistrer
              </Button>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
