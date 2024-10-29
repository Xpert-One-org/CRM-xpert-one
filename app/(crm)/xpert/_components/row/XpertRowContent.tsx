import Input from '@/components/inputs/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';
import { getLabel } from '@/utils/getLabel';
import React from 'react';
import {
  genres,
  how,
  iamSelect,
  statusSelectEmployee,
  statusSelectInde,
} from '@/data/mocked_select';
import { ageMax, empty } from '@/data/constant';
import { Slider } from '@/components/ui/slider';
import XpertExperience from '../XpertExperience';
import MultiSelectComponent from '@/components/inputs/MultiSelectComponent';
import { getYears } from '@/utils/string';

export default function XpertRowContent({ xpert }: { xpert: DBXpert }) {
  const selectStatus = [...statusSelectEmployee, ...statusSelectInde];
  const {
    countries,
    habilitations,
    diplomas,
    expertises,
    specialities,
    languages,
  } = useSelect();

  const years = getYears({
    data: (xpert.profile_expertise && xpert.profile_expertise.seniority) ?? 0,
    max: ageMax,
  });
  return (
    console.log(xpert.profile_expertise?.experiences),
    (
      <div className="flex flex-col gap-y-spaceXSmall p-spaceSmall">
        <div className="grid w-full grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Input
              label="Référant XPERT ONE"
              value={`${xpert.firstname}`}
              disabled
            />
            <Input label="Adresse mail" value={xpert.email ?? ''} disabled />
          </div>
          <div className="flex items-center justify-end">
            <Avatar className="aspect-square size-[120px]">
              <AvatarImage
                src={xpert.avatar_url ?? ''}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-xl uppercase text-white">
                {xpert.firstname?.substring(0, 1)}
                {xpert.lastname?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <p className="pt-4 text-lg font-medium text-black">Mon profil</p>
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
          <Input label="Tél portable" value={xpert.mobile ?? ''} disabled />
          <Input label="Tél fixe" value={xpert.fix ?? ''} disabled />

          <Input label="N° de rue" value={xpert.street_number ?? ''} disabled />
          <Input
            label="Addresse postale"
            value={xpert.address ?? ''}
            disabled
          />

          <Input label="Ville" value={xpert.city ?? ''} disabled />
          <Input label="Code postal" value={xpert.postal_code ?? ''} disabled />
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
            disabled
            value={xpert.linkedin ?? ''}
          />
          <Input
            label="Comment avez-vous connu Xpert One"
            disabled
            value={
              getLabel({
                value: xpert.how_did_you_hear_about_us ?? '',
                select: how,
              }) ?? ''
            }
          />
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
            disabled
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
            disabled
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
            value={xpert.profile_status?.rib_name ?? empty}
            disabled={true}
          />
        </div>
        <div className="mb-spaceMediumContainer mt-spaceContainer h-px w-full bg-[#BEBEC0]" />
        <p className="pt-spaceContainer text-lg font-medium text-black">
          Mon expertise
        </p>
        <p className="text-md font-medium text-black">
          Depuis combien de temps exercez-vous dans les métiers de la transition
          énergétique ?
        </p>
        <Slider
          disabled
          defaultValue={[
            xpert.profile_expertise && xpert.profile_expertise.seniority
              ? xpert.profile_expertise.seniority
              : 0,
          ]}
          max={35}
          step={1}
          className="mt-[25px] w-3/4 max-w-[538px]"
          textValue={String(
            `${
              (xpert.profile_expertise && xpert.profile_expertise.seniority) ??
              0
            } ${years}`
          )}
        />
        <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
        <XpertExperience xpert={xpert} />
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

          <MultiSelectComponent
            disabled
            placeholder=""
            label="Quelles sont vos habilitations"
            defaultSelectedKeys={[
              ...(xpert.profile_expertise?.habilitations ?? []),
            ]}
            options={habilitations}
            name=""
            onValueChange={() => ({})}
          />
          {xpert.profile_expertise?.habilitations_other && (
            <Input
              label="Détails des habilitations"
              value={xpert.profile_expertise.habilitations_other}
              disabled
            />
          )}
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
              (xpert.profile_expertise && xpert.profile_expertise.diploma) ?? ''
            }
            disabled={true}
          />
          <Input
            label="Éléments supplémentaires"
            value={
              (xpert.profile_expertise &&
                xpert.profile_expertise.expertises_other) ??
              empty
            }
            disabled={true}
          />
          <Input
            label="Langue maternelle"
            value={
              (xpert.profile_expertise &&
                getLabel({
                  value:
                    (xpert.profile_expertise.maternal_language !== 'other'
                      ? xpert.profile_expertise.maternal_language
                      : xpert.profile_expertise.maternal_language_other) ??
                    empty,
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

          <Input label="Auto-Évaluation" value={empty} disabled={true} />
        </div>
      </div>
    )
  );
}
