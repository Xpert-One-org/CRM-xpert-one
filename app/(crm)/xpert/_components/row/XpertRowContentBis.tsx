import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/inputs/MultiSelectComponent';
import TextArea from '@/components/inputs/TextArea';
import { Skeleton } from '@/components/ui/skeleton';
import { empty } from '@/data/constant';
import { areaSelect, franceSelect } from '@/data/mocked_select';
import { profileDataCompany } from '@/data/profile';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import React from 'react';

export default function XpertRowContentBis({
  xpert,
  isLoading,
  cvUrl,
}: {
  xpert: DBXpert;
  isLoading: boolean;
  cvUrl: string;
}) {
  const { sectors, regions, expertises, specialities, jobTitles } = useSelect();
  return (
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
          defaultSelectedKeys={[...(xpert.profile_mission?.sector ?? [])]}
          options={sectors}
          name=""
          onValueChange={() => ({})}
        />

        {xpert.profile_mission?.sector_other && (
          <TextArea
            label="Détails du secteur"
            value={xpert.profile_mission.sector_other ?? empty}
            disabled={true}
          />
        )}
        <MultiSelectComponent
          className="xl:max-w-full"
          disabled
          label="Quels types de postes"
          defaultSelectedKeys={[...(xpert.profile_mission?.job_titles ?? [])]}
          options={jobTitles}
          name=""
          onValueChange={() => ({})}
        />
        {xpert.profile_mission?.job_titles?.includes('other') &&
          xpert.profile_mission.job_titles_other && (
            <TextArea
              label="Détails du poste"
              value={xpert.profile_mission.job_titles_other ?? empty}
              disabled={true}
            />
          )}
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <MultiSelectComponent
          className="xl:max-w-full"
          disabled
          label="Dans quelles spécialités"
          defaultSelectedKeys={[...(xpert.profile_mission?.specialties ?? [])]}
          options={specialities}
          name=""
          onValueChange={() => ({})}
        />
        {xpert.profile_mission?.specialties_others && (
          <TextArea
            label="Détails de la spécialité"
            value={xpert.profile_mission.specialties_others}
            disabled={true}
          />
        )}

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
        {xpert.profile_mission?.expertises_others && (
          <TextArea
            label="Détails de l'expertise"
            value={xpert.profile_mission.expertises_others}
            disabled={true}
          />
        )}
      </div>
      <div className="mb-spaceSmall mt-[36px] h-px w-full bg-[#BEBEC0]" />
      <p className="text-lg font-medium text-black">Mes disponibilités</p>
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="Disponibilités"
          disabled
          value={
            (xpert.profile_mission &&
              formatDate(xpert.profile_mission.availability ?? '')) ??
            ''
          }
        />

        <MultiSelectComponent
          className="xl:max-w-full"
          disabled
          label="Quelles zones géographiques"
          defaultSelectedKeys={[...(xpert.profile_mission?.area ?? [])]}
          options={[...areaSelect]}
          name=""
          onValueChange={() => ({})}
        />
        {xpert.profile_mission?.area?.includes('france') && (
          <MultiSelectComponent
            className="xl:max-w-full"
            disabled
            label={profileDataCompany.france_detail?.label}
            defaultSelectedKeys={[
              ...(xpert.profile_mission.france_detail ?? []),
            ]}
            options={[...franceSelect]}
            name=""
            onValueChange={() => ({})}
          />
        )}
        {xpert.profile_mission?.france_detail?.includes('regions') && (
          <MultiSelectComponent
            className="xl:max-w-full"
            disabled
            label={profileDataCompany.regions?.label}
            defaultSelectedKeys={[...(xpert.profile_mission.regions ?? [])]}
            options={[...regions]}
            name=""
            onValueChange={() => ({})}
          />
        )}
      </div>
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <p className="text-lg font-medium text-black">Prétentions salariales</p>
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="TJM total frais souhaité (hors grand déplacement)"
          disabled
          value={xpert.profile_mission?.desired_tjm ?? empty}
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="Rémunération BRUT mensuel souhaitée (hors grand déplacement)"
          disabled
          value={xpert.profile_mission?.desired_monthly_brut ?? ''}
        />
      </div>
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <p className="text-lg font-medium text-black">Aménagement de poste</p>
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="Avez-vous besoin d’un amménagement de poste"
          disabled
          value={
            (xpert.profile_mission &&
              getLabel({
                value: xpert.profile_mission.workstation_needed ?? '',
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
          value={xpert.profile_mission?.workstation_description ?? empty}
        />
      </div>
    </div>
  );
}
