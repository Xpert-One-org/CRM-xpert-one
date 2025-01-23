'use client';

import React, { useState } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import type { DBProfile } from '@/types/typesDb';
import { genres, how } from '@/data/mocked_select';
import MultiSelectComponent from '../MultiSelectComponent';
import { createUser } from '../../../app/(crm)/xpert/xpert.action';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';
import { useXpertStore } from '@/store/xpert';
import { errorManagement } from '@/utils/error-management';
import { signUpPasswordSchema } from '@/lib/schema/schema';
import { z } from 'zod';
import { useFournisseurStore } from '@/store/fournisseur';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import CreatableSelect from '@/components/CreatableSelect';
import { useSelect } from '@/store/select';

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
  | 'fix'
  | 'company_name'
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
  const [isLoading, setIsLoading] = useState(false);
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
    fix: '',
    street_number: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    linkedin: '',
    how_did_you_hear_about_us: '',
    company_name: '',
  });

  const requiredUserFields = [
    'email',
    'password',
    'passwordConfirmation',
    'lastname',
    'firstname',
    'mobile',
  ];

  const { fetchXpertOptimizedFiltered } = useXpertStore();
  const { fetchFournisseurs, resetFournisseurs } = useFournisseurStore();
  const { countries } = useSelect();

  const onChangeProfil = ({
    e,
    field = e.target.name as keyof ProfileDataPicked,
  }: {
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    field?: keyof ProfileDataPicked;
  }) => {
    setProfileData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isBtnDisabled =
    requiredUserFields.some((field) => !userData[field as keyof UserData]) ||
    userData.password !== userData.passwordConfirmation ||
    isLoading;

  const reset = () => {
    setUserData({
      email: '',
      password: '',
      passwordConfirmation: '',
      role,
      firstname: '',
      lastname: '',
      mobile: '',
      referent_id: null,
    });
    setProfileData({
      civility: '',
      company_name: '',
      fix: '',
      street_number: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
      linkedin: '',
      how_did_you_hear_about_us: '',
    });
  };

  const handleCreateXpert = async () => {
    setIsLoading(true);
    try {
      signUpPasswordSchema.parse(userData);

      const { error } = await createUser({
        profile: profileData,
        user: userData,
      });
      if (error) {
        const { response } = errorManagement({ error });
        toast.error(response);
      }
      if (!error) {
        toast.success(
          role === 'company'
            ? 'Fournisseur créé avec succès'
            : 'Xpert créé avec succès'
        );
        reset();
        if (role === 'company') {
          await resetFournisseurs();
          await fetchFournisseurs();
        } else {
          await fetchXpertOptimizedFiltered(true);
        }
        setPopupOpen(false);
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      userData.email !== '' ||
      userData.password !== '' ||
      userData.firstname !== '' ||
      userData.lastname !== '' ||
      userData.mobile !== '' ||
      profileData.company_name !== '' ||
      Object.values(profileData).some((value) => value !== '')
    );
  };

  const handleConfirmedClose = () => {
    reset();
    setPopupOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (hasChanges()) {
        return;
      }
      reset();
    }
    setPopupOpen(open);
  };

  return (
    <Credenza
      open={popupOpen}
      onOpenChange={handleOpenChange}
      shouldConfirmClose={hasChanges()}
      onConfirmedClose={handleConfirmedClose}
    >
      <Button
        variant={'primary'}
        className="px-spaceContainer py-spaceXSmall text-white"
        onClick={() => setPopupOpen(true)}
      >
        {role === 'company' ? 'Créer un fournisseur' : 'Créer un xpert'}
      </Button>
      <CredenzaContent className="mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
        <ScrollArea className="max-h-[90vh]">
          <div className="flex flex-col gap-y-spaceContainer p-6">
            <div className="grid grid-cols-3 gap-x-spaceContainer gap-y-spaceSmall">
              <div className="col-span-1">
                <Input
                  placeholder="Adresse mail"
                  type="email"
                  label="Adresse mail professionnelle"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
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
                <MultiSelectComponent
                  className="z-[999] xl:max-w-[400px]"
                  side="top"
                  showIndividualX={false}
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
                  type="text"
                  label="Nom de la société"
                  placeholder="Nom de votre société"
                  value={profileData.company_name ?? ''}
                  onChange={(e) => onChangeProfil({ e, field: 'company_name' })}
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
                <PhoneInputComponent
                  label="Tél portable"
                  name="mobile"
                  placeholder={''}
                  onValueChange={(value) =>
                    setUserData((prev) => ({ ...prev, mobile: value }))
                  }
                  value={userData.mobile}
                  defaultSelectedKeys={userData.mobile}
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
                <CreatableSelect
                  label={'Pays'}
                  className="flex h-full flex-col justify-between"
                  classNameInput="p-3 h-[47px] border-input"
                  options={countries.map((country) => ({
                    label: country.label!,
                    value: country.value!,
                  }))}
                  defaultValue={{
                    label: '',
                    value: profileData.country || '',
                  }}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, country: e.value }))
                  }
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
                  side="top"
                  showIndividualX={false}
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
                {isLoading ? 'Chargement' : "Créer l'utilisateur"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CredenzaContent>
    </Credenza>
  );
}
