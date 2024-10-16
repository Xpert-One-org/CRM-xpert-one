'use client';

import { FilterButton } from '@/components/FilterButton';
import type { DBXpert } from '@/types/typesDb';
import React, { useEffect, useState } from 'react';
import XpertRow from './XpertRow';
import XpertMissionRow from './XpertMissionRow';
import { cn } from '@/lib/utils';
import Input from '@/components/inputs/Input';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { getYears } from '@/utils/string';
import { getLabel } from '@/utils/getLabel';
import {
  areaSelect,
  franceSelect,
  genres,
  how,
  iamSelect,
  statusSelectEmployee,
  statusSelectInde,
} from '@/data/mocked_select';
import MultiSelectComponent from '@/components/inputs/MultiSelectComponent';
import { useSelect } from '@/store/select';
import { formatDate } from '@/utils/formatDates';
import { empty } from '@/data/constant';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearchParams } from 'next/navigation';

export default function XpertTable({ xperts }: { xperts: DBXpert[] }) {
  const {
    specialities,
    expertises,
    habilitations,
    diplomas,
    languages,
    sectors,
    jobTitles,
    regions,
    countries,
    fetchSpecialties,
    fetchExpertises,
    fetchHabilitations,
    fetchDiplomas,
    fetchLanguages,
    fetchSectors,
    fetchJobTitles,
    fetchRegions,
    fetchCountries,
  } = useSelect();

  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];
  const ageMax = 35;

  const [xpertIdOpened, setXpertIdOpened] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const handleXpertIdOpened = (xpert: DBXpert) => {
    setXpertIdOpened((prevId) => {
      setCvUrl('');
      return prevId === xpert.id.toString() ? '0' : xpert.id.toString();
    });
    fetchCvUrl(xpert);
  };

  const fetchCvUrl = async (xpert: DBXpert) => {
    setIsLoading(true);
    const supabase = createSupabaseFrontendClient();

    const { data } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/cv/`);

    if (data?.length === 0) {
      setIsLoading(false);
      setCvUrl('');
      return;
    }

    const lastFile = data?.[data.length - 1];

    const { data: cvUrl } = await supabase.storage
      .from('profile_files')
      .getPublicUrl(`${xpert.generated_id}/cv/${lastFile?.name}`);

    setCvUrl(cvUrl.publicUrl);
    setIsLoading(false);
  };

  useEffect(() => {
    const xpertId = searchParams.get('id');
    if (xpertId) {
      const foundXpert = xperts.find((xpert) => xpert.id === xpertId);
      if (foundXpert) {
        handleXpertIdOpened(foundXpert);
      }
      setXpertIdOpened(xpertId);
    }
    fetchSpecialties();
    fetchExpertises();
    fetchHabilitations();
    fetchDiplomas();
    fetchLanguages();
    fetchSectors();
    fetchJobTitles();
    fetchRegions();
    fetchCountries();
  }, []);

  return (
    <>
      <div className="mb-2 flex items-center justify-end gap-2">
        {/* <Button className="py-spaceXSmall pl-spaceContainer text-white">
          Créer un xpert
        </Button> */}
        {/* {xpertIdOpened !== '0' && (
          <Button className="py-spaceXSmall pl-spaceContainer text-white">
            Enregistrer
          </Button>
        )} */}
      </div>

      <div className="grid grid-cols-7 gap-3">
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Date d'inscription"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Nom"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Prénom"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Poste"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="N° identification"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Disponible le"
        />
        <FilterButton placeholder="Fiche détaillée" filter={true} />

        {xperts.map((xpert) => {
          // GET YEARS FOR SENIORITY TEXT
          const years = getYears({
            data:
              (xpert.profile_expertise && xpert.profile_expertise.seniority) ??
              0,
            max: ageMax,
          });

          const selectStatus = [...statusSelectEmployee, ...statusSelectInde];

          return (
            <>
              <XpertRow
                key={xpert.id}
                xpert={xpert}
                isOpen={xpertIdOpened === xpert.id}
                onClick={() => handleXpertIdOpened(xpert)}
              />
              <div
                className={cn(
                  'col-span-3 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.id }
                )}
              >
                <div className="flex flex-col gap-y-spaceXSmall p-spaceSmall">
                  <div className="grid w-full grid-cols-2 gap-4">
                    <div className="flex flex-col gap-y-spaceXSmall">
                      <Input
                        label="Référant XPERT ONE"
                        value={`${xpert.firstname}`}
                        disabled
                      />
                      <Input
                        label="Adresse mail"
                        value={xpert.email ?? ''}
                        disabled
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <Avatar className="aspect-square size-[120px]">
                        <AvatarImage src={xpert.avatar_url ?? ''} />
                        <AvatarFallback className="bg-primary text-xl uppercase text-white">
                          {xpert.firstname?.substring(0, 1)}
                          {xpert.lastname?.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <p className="pt-4 text-lg font-medium text-black">
                    Mon profil
                  </p>
                  <div className="grid w-full grid-cols-3 gap-4">
                    <Input
                      label="Civilité"
                      value={
                        getLabel({
                          value: xpert.civility ?? '',
                          select: genres,
                        }) ?? empty
                      }
                      disabled
                    />
                    <Input
                      type="date"
                      label="Date de naissance"
                      disabled
                      value={xpert.birthdate ?? ''}
                    />
                    <Input
                      label="Notation"
                      disabled
                      value={'Indisponible pour le moment'}
                    />
                  </div>
                  <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Tél portable"
                      value={xpert.mobile ?? ''}
                      disabled
                    />
                    <Input label="Tél fixe" value={xpert.fix ?? ''} disabled />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="N° de rue"
                      value={xpert.street_number ?? ''}
                      disabled
                    />
                    <Input
                      label="Addresse postale"
                      value={xpert.address ?? ''}
                      disabled
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input label="Ville" value={xpert.city ?? ''} disabled />
                    <Input
                      label="Pays"
                      value={
                        getLabel({
                          value: xpert.country ?? '',
                          select: countries,
                        }) ?? empty
                      }
                      disabled
                    />
                  </div>
                  <div className="mb-spaceContainer mt-[60px] h-px w-full bg-[#BEBEC0]" />
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Profil LinkedIn"
                      value={xpert.linkedin ?? ''}
                    />
                    <Input
                      label="Comment avez-vous connu Xpert One"
                      value={
                        getLabel({
                          value: xpert.how_did_you_hear_about_us ?? '',
                          select: how,
                        }) ?? ''
                      }
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Je suis parrainé par"
                      value={xpert.referent_id ?? empty}
                      disabled={true}
                    />
                  </div>
                  <p className="pt-spaceContainer text-lg font-medium text-black">
                    Mon statut
                  </p>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Je suis"
                      value={
                        (xpert.profile_status &&
                          getLabel({
                            value: xpert.profile_status.iam ?? '',
                            select: iamSelect,
                          })) ??
                        ''
                      }
                    />
                    <Input
                      label="Mon statut"
                      value={
                        (xpert.profile_status &&
                          getLabel({
                            value: xpert.profile_status.status ?? '',
                            select: selectStatus,
                          })) ??
                        ''
                      }
                    />
                  </div>
                  <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Mon RIB"
                      value={
                        (xpert.profile_status &&
                          xpert.profile_status.rib_name) ??
                        empty
                      }
                      disabled={true}
                    />
                  </div>
                  <div className="mb-spaceMediumContainer mt-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <p className="pt-spaceContainer text-lg font-medium text-black">
                    Mon expertise
                  </p>
                  <p className="text-md font-medium text-black">
                    Depuis combien de temps exercez-vous dans les métiers de la
                    transition énergétique ?
                  </p>
                  <Slider
                    disabled
                    defaultValue={[
                      xpert.profile_expertise &&
                      xpert.profile_expertise.seniority
                        ? xpert.profile_expertise.seniority
                        : 0,
                    ]}
                    max={35}
                    step={1}
                    className="mt-[25px] w-[75%] max-w-[538px]"
                    textValue={String(
                      `${
                        (xpert.profile_expertise &&
                          xpert.profile_expertise.seniority) ??
                        0
                      } ${years}`
                    )}
                  />
                  <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <div className="grid w-full grid-cols-2 gap-4">
                    <MultiSelectComponent
                      disabled
                      label="Quelles sont vos spécialités"
                      defaultSelectedKeys={[
                        ...(xpert.profile_expertise?.specialties ?? []),
                        xpert.profile_expertise?.specialties_other ?? '',
                      ]}
                      options={specialities}
                      name=""
                      onValueChange={() => ({})}
                    />
                    <MultiSelectComponent
                      disabled
                      label="Quelles sont vos expertises"
                      defaultSelectedKeys={[
                        ...(xpert.profile_expertise?.expertises ?? []),
                        xpert.profile_expertise?.expertises_other ?? '',
                      ]}
                      options={expertises}
                      name=""
                      onValueChange={() => ({})}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <MultiSelectComponent
                      disabled
                      label="Quelles sont vos habilitations"
                      defaultSelectedKeys={[
                        ...(xpert.profile_expertise?.habilitations ?? []),
                        xpert.profile_expertise?.habilitations_other ?? '',
                      ]}
                      options={habilitations}
                      name=""
                      onValueChange={() => ({})}
                    />
                  </div>
                  <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Niveau d’étude"
                      value={
                        (xpert.profile_expertise &&
                          getLabel({
                            value: xpert.profile_expertise.degree ?? '',
                            select: diplomas,
                          })) ??
                        empty
                      }
                      disabled={true}
                    />
                    <Input
                      label="Diplôme précis"
                      value={
                        (xpert.profile_expertise &&
                          xpert.profile_expertise.diploma) ??
                        ''
                      }
                      disabled={true}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Éléments supplémentaires à nous communiquer"
                      value={
                        (xpert.profile_expertise &&
                          xpert.profile_expertise.expertises_other) ??
                        empty
                      }
                      disabled={true}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Langue maternelle"
                      value={
                        (xpert.profile_expertise &&
                          getLabel({
                            value:
                              (xpert.profile_expertise.maternal_language !==
                              'other'
                                ? xpert.profile_expertise.maternal_language
                                : xpert.profile_expertise
                                    .maternal_language_other) ?? empty,
                            select: languages,
                          })) ??
                        empty
                      }
                      disabled={true}
                    />
                    <MultiSelectComponent
                      disabled
                      label="Autres langues parlées"
                      defaultSelectedKeys={[
                        ...(xpert.profile_expertise?.other_language?.map(
                          (lang: any) => lang?.language
                        ) ?? []),
                        xpert.profile_expertise?.other_language_detail ?? empty,
                      ]}
                      options={languages}
                      placeholder={empty}
                      name=""
                      onValueChange={() => ({})}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    {/* <FileInput
                      isDownload={true}
                      download={downloadFile}
                      name=""
                      fileName={
                        signed_quote_file_name
                          ? signed_quote_file_name
                          : devisFileName
                      }
                      label="Télécharger mon CV"
                      placeholder="Uploader le devis signé"
                      onChange={(e) =>
                        handleFileChange({ e: e, file_name: 'devis' })
                      }
                    /> */}
                    <Input
                      label="Télécharger mon CV"
                      value={xpert.cv_name ?? ''}
                      disabled={true}
                    />

                    <Input
                      label="Auto-Évaluation"
                      value={empty}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'col-span-4 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.id }
                )}
              >
                <div className="grid grid-cols-5 gap-3 p-[14px]">
                  <FilterButton
                    options={signUpDateOptions}
                    defaultSelectedKeys=""
                    onValueChange={() => {}}
                    placeholder="Date de début/fin"
                  />
                  <FilterButton
                    options={signUpDateOptions}
                    defaultSelectedKeys=""
                    onValueChange={() => {}}
                    placeholder="N° de mission"
                    filter={false}
                  />
                  <FilterButton
                    options={signUpDateOptions}
                    defaultSelectedKeys=""
                    onValueChange={() => {}}
                    placeholder="Titre"
                    filter={false}
                  />
                  <FilterButton
                    options={signUpDateOptions}
                    defaultSelectedKeys=""
                    onValueChange={() => {}}
                    placeholder="Situation"
                  />
                  <FilterButton
                    options={signUpDateOptions}
                    defaultSelectedKeys=""
                    onValueChange={() => {}}
                    placeholder="TJM XPERT GD inclus"
                    filter={false}
                  />
                  <div className="flex flex-col">
                    {xpert.mission.length > 0 ? (
                      <>
                        {xpert.mission.map((mission) => (
                          <XpertMissionRow key={mission.id} mission={mission} />
                        ))}
                      </>
                    ) : (
                      <div className="col-span-4 flex items-center justify-center">
                        <p className="text-gray-secondary text-center text-sm">
                          Aucune mission
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 p-4">
                  {isLoading ? (
                    <Skeleton className="size-full" />
                  ) : (
                    <div className="flex size-full items-start justify-start">
                      {cvUrl ? (
                        <iframe src={cvUrl} className="h-[90vh] w-full" />
                      ) : (
                        <p>Aucun CV uploadé par l'xpert pour le moment</p>
                      )}
                    </div>
                  )}
                  <p className="pt-spaceContainer text-lg font-medium text-black">
                    Ma recherche de mission
                  </p>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <MultiSelectComponent
                      className="xl:max-w-full"
                      disabled
                      label="Quels secteurs d’activités"
                      defaultSelectedKeys={[
                        ...(xpert.profile_mission?.sector ?? []),
                        xpert.profile_mission?.sector_other ?? empty,
                      ]}
                      options={sectors}
                      name=""
                      onValueChange={() => ({})}
                    />

                    <MultiSelectComponent
                      className="xl:max-w-full"
                      disabled
                      label="Quels types de postes"
                      defaultSelectedKeys={[
                        ...(xpert.profile_mission?.job_titles ?? []),
                        xpert.profile_mission?.job_titles_other ?? empty,
                      ]}
                      options={jobTitles}
                      name=""
                      onValueChange={() => ({})}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <MultiSelectComponent
                      className="xl:max-w-full"
                      disabled
                      label="Dans quelles spécialités"
                      defaultSelectedKeys={[
                        ...(xpert.profile_mission?.specialties ?? []),
                        xpert.profile_mission?.specialties_others ?? empty,
                      ]}
                      options={specialities}
                      name=""
                      onValueChange={() => ({})}
                    />

                    {/* <Input
                      label="Dans quelles expertises"
                      disabled
                      value={
                        (xpert.profile_mission &&
                          xpert.profile_mission.expertises) ??
                        ''
                      }
                    /> */}
                    <MultiSelectComponent
                      className="xl:max-w-full"
                      disabled
                      label="Dans quelles expertises"
                      defaultSelectedKeys={[
                        ...(xpert.profile_mission?.expertises ?? []),
                        xpert.profile_mission?.expertises_others ?? empty,
                      ]}
                      options={expertises}
                      name=""
                      onValueChange={() => ({})}
                    />
                  </div>
                  <div className="mb-spaceSmall mt-[36px] h-px w-full bg-[#BEBEC0]" />
                  <p className="text-lg font-medium text-black">
                    Mes disponibilités
                  </p>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Disponibilités"
                      disabled
                      value={
                        (xpert.profile_mission &&
                          formatDate(
                            xpert.profile_mission.availability ?? ''
                          )) ??
                        ''
                      }
                    />

                    <MultiSelectComponent
                      className="xl:max-w-full"
                      disabled
                      label="Quelles zones géographiques"
                      defaultSelectedKeys={[
                        ...(xpert.profile_mission?.area ?? []),
                        ...(xpert.profile_mission?.france_detail ?? []),
                        ...(xpert.profile_mission?.regions ?? [] ?? empty),
                      ]}
                      options={[...areaSelect, ...franceSelect, ...regions]}
                      name=""
                      onValueChange={() => ({})}
                    />
                  </div>
                  <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <p className="text-lg font-medium text-black">
                    Prétentions salariales
                  </p>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="TJM total frais souhaité (hors grand déplacement)"
                      disabled
                      value={
                        (xpert.profile_mission &&
                          xpert.profile_mission.desired_tjm) ??
                        empty
                      }
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Rémunération BRUT mensuel souhaitée (hors grand déplacement)"
                      disabled
                      value={
                        (xpert.profile_mission &&
                          xpert.profile_mission.desired_monthly_brut) ??
                        ''
                      }
                    />
                  </div>
                  <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
                  <p className="text-lg font-medium text-black">
                    Aménagement de poste
                  </p>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Avez-vous besoin d’un amménagement de poste"
                      disabled
                      value={
                        (xpert.profile_mission &&
                          xpert.profile_mission &&
                          getLabel({
                            value:
                              xpert.profile_mission.workstation_needed ?? '',
                            select: [],
                          })) ??
                        empty
                      }
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Input
                      label="Décrivez-nous votre besoin"
                      disabled
                      value={
                        (xpert.profile_mission &&
                          xpert.profile_mission.workstation_description) ??
                        empty
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
