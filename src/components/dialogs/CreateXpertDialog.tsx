'use client';

import React, { useState } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import type { DBProfile } from '@/types/typesDb';
import SelectComponent from '../SelectComponent';
import { genres, how } from '@/data/mocked_select';
import MultiSelectComponent from '../MultiSelectComponent';
import { createXpert } from '../../../app/(crm)/xpert/xpert.action';
import { toast } from 'sonner';
// import { getLabel } from '@/utils/getLabel';
// import { genres } from '@/data/mocked_select';
// import { empty } from '@/data/constant';
// import SelectComponent from '@/components/SelectComponent';
// import { profileDataCompany } from '@/data/profile';
// import type { UserType } from '@/types/types';
// import useUser from '@/store/useUser';
// import { useField } from '@/hooks/useField';
// import { toast } from 'sonner';

export type UserData = {
  email: string;
  password: string;
  passwordConfirmation: string;
  role: 'company' | 'xpert';
  referent_id: string | null;
  mobile: string;
  firstname: string;
  lastname: string;
};

export type ProfileDataPicked = Pick<
  DBProfile,
  | 'civility'
  | 'birthdate'
  | 'fix'
  | 'street_number'
  | 'address'
  | 'city'
  | 'postal_code'
  | 'country'
  | 'linkedin'
  | 'how_did_you_hear_about_us'
>;

export default function CreateFournisseurXpertDialog({
  role,
}: {
  role: 'company' | 'xpert';
}) {
  const [popupOpen, setPopupOpen] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
    passwordConfirmation: '',
    role,
    firstname: '',
    lastname: '',
    mobile: '',
    referent_id: null,
  });

  const [profileData, setProfileData] = useState<ProfileDataPicked>({
    civility: '',
    birthdate: '',
    fix: '',
    street_number: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    linkedin: '',
    how_did_you_hear_about_us: '',
  });

  const requiredUserFields = [
    'email',
    'password',
    'passwordConfirmation',
    'lastname',
    'firstname',
    'mobile',
  ];

  // const requiredProfileFields = [""];

  const onChangeProfil = ({
    e,
    field = e.target.name as keyof ProfileDataPicked,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    field?: keyof ProfileDataPicked;
  }) => {
    setProfileData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isBtnDisabled =
    requiredUserFields.some((field) => !userData[field as keyof UserData]) ||
    userData.password !== userData.passwordConfirmation;
  // ||
  // requiredProfileFields.some(
  //   (field) => !profileData[field as keyof ProfileDataPicked]
  // );

  const handleCreateXpert = async () => {
    const { error } = await createXpert({
      profile: profileData,
      user: userData,
    });
    if (!error) {
      toast.success('Xpert créé avec succès');
      setPopupOpen(false);
    }
  };

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
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <Input
                  placeholder="Mot de passe*"
                  type="password"
                  label="Mot de passe"
                  hasError={userData.password !== userData.passwordConfirmation}
                  showPasswordToggle
                  required
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-1">
                <Input
                  type="password"
                  hasError={userData.password !== userData.passwordConfirmation}
                  showPasswordToggle
                  placeholder="Confirmer mot de passe"
                  label="Confirmer mot de passe"
                  required
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      passwordConfirmation: e.target.value,
                    }))
                  }
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
                {/* <Input
                  label="Civilité"
                  placeholder="Monsieur"
                  onChange={(e) => onChangeProfil({ e, field: 'civility' })}
                /> */}
                <MultiSelectComponent
                  className="z-[999] xl:max-w-[400px]"
                  side="top"
                  creatable
                  defaultSelectedKeys={
                    profileData.civility ? [profileData.civility] : []
                  }
                  label="Civilité"
                  options={genres}
                  name="civility"
                  placeholder="Choisir"
                  onValueChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      civility: Array.isArray(value)
                        ? value[value.length - 1]
                        : value,
                    }))
                  }
                />
              </div>

              <div className="col-span-2">
                <Input
                  type="date"
                  label="Date de naissance"
                  value={'1990-01-01'}
                  onChange={(e) => onChangeProfil({ e, field: 'birthdate' })}
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-6 gap-4">
              <div className="col-span-2">
                <Input
                  label="Nom"
                  placeholder="Votre nom"
                  required
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      lastname: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Prénom"
                  placeholder="Votre prénom"
                  required
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }))
                  }
                />
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
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Tél fixe"
                  placeholder="Télephone fixe"
                  onChange={(e) => onChangeProfil({ e, field: 'fix' })}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-6 gap-4">
              <div className="col-span-1">
                <Input
                  label="N° de rue"
                  placeholder="32 bis"
                  onChange={(e) =>
                    onChangeProfil({ e, field: 'street_number' })
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Addresse postale"
                  placeholder="Adresse postale"
                  onChange={(e) => onChangeProfil({ e, field: 'address' })}
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Ville"
                  placeholder="Paris(16e)"
                  onChange={(e) => onChangeProfil({ e, field: 'city' })}
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Code postal "
                  placeholder="75016"
                  onChange={(e) => onChangeProfil({ e, field: 'postal_code' })}
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Pays"
                  placeholder="France"
                  onChange={(e) => onChangeProfil({ e, field: 'country' })}
                />
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
                  onChange={(e) => onChangeProfil({ e, field: 'linkedin' })}
                  placeholder="https://martinleduc.linkedin.com"
                />
              </div>
              <div className="col-span-1">
                <MultiSelectComponent
                  className="z-[999"
                  side="top"
                  creatable
                  defaultSelectedKeys={
                    profileData.how_did_you_hear_about_us
                      ? [profileData.how_did_you_hear_about_us]
                      : []
                  }
                  label="Comment avez vous connu Xpert One ?"
                  options={how}
                  name="how_did_you_hear_about_us"
                  placeholder="Choisir"
                  onValueChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      how_did_you_hear_about_us: Array.isArray(value)
                        ? value[value.length - 1]
                        : value,
                    }))
                  }
                />
              </div>
              <div className="col-span-1">
                <Input label="Je suis parrainé par" placeholder="Choisir" />
              </div>
            </div>

            <div className="flex gap-x-spaceSmall self-end">
              <Button
                variant={isBtnDisabled ? 'disabled' : 'primary'}
                disabled={isBtnDisabled}
                onClick={handleCreateXpert}
                className="min-w-[200px] rounded"
                shape={'right_bottom'}
              >
                {/* {isLoading ? 'Chargement...' : 'DEMANDER LA SUPPRESSION'} */}
                Créer l'utilisateur
              </Button>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
