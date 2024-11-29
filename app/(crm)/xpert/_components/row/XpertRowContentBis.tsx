import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import TextArea from '@/components/inputs/TextArea';
import { Skeleton } from '@/components/ui/skeleton';
import { empty } from '@/data/constant';
import { areaSelect, franceSelect } from '@/data/mocked_select';
import { profileDataCompany } from '@/data/profile';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import React, { useState } from 'react';
import SelectComponent from '@/components/SelectComponent';
import type { DocumentInfo } from '../XpertTable';

type XpertRowContentBisProps = {
  xpert: DBXpert;
  isLoading: boolean;
  cvInfo: DocumentInfo;
  ursaffInfo: DocumentInfo;
  kbisInfo: DocumentInfo;
};

export default function XpertRowContentBis({
  xpert,
  isLoading,
  cvInfo,
  ursaffInfo,
  kbisInfo,
}: XpertRowContentBisProps) {
  const { sectors, regions, expertises, specialities, jobTitles } = useSelect();
  const [documentType, setDocumentType] = useState(
    cvInfo ? 'cv' : ursaffInfo ? 'ursaff' : kbisInfo ? 'kbis' : ''
  );

  const selectOptions = [
    ...(cvInfo.created_at
      ? [{ label: 'Curriculum Vitae', value: 'cv', json_key: null }]
      : []),
    ...(ursaffInfo.created_at
      ? [{ label: 'URSAFF', value: 'ursaff', json_key: null }]
      : []),
    ...(kbisInfo.created_at
      ? [{ label: 'KBIS -3mois', value: 'kbis', json_key: null }]
      : []),
  ];

  const onValueChange = (value: string) => {
    setDocumentType(value);
  };

  return (
    <>
      {cvInfo.created_at && (
        <SelectComponent
          label="Type de documents"
          placeholder="Sélectionner un type de document"
          name="document_type"
          options={selectOptions}
          defaultSelectedKeys={selectOptions[0]?.value ?? ''}
          onValueChange={onValueChange}
          className="p-1"
        />
      )}
      {isLoading ? (
        <Skeleton className="size-full" />
      ) : (
        <>
          {documentType === 'cv' && cvInfo.publicUrl ? (
            <iframe src={cvInfo.publicUrl} className="h-[90vh] w-full py-2" />
          ) : documentType === 'ursaff' && ursaffInfo.publicUrl ? (
            <iframe
              src={ursaffInfo.publicUrl}
              className="h-[90vh] w-full py-2"
            />
          ) : documentType === 'kbis' && kbisInfo.publicUrl ? (
            <iframe src={kbisInfo.publicUrl} className="h-[90vh] w-full py-2" />
          ) : (
            <p>Aucun document uploadé par l'xpert pour le moment</p>
          )}
        </>
      )}
      <div className="flex w-full flex-col gap-4 rounded-lg rounded-b-xs bg-[#D0DDE1] p-3 shadow-container">
        <p className="text-lg font-medium text-black">
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
            defaultSelectedKeys={[
              ...(xpert.profile_mission?.specialties ?? []),
            ]}
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
        <div className="h-px w-full bg-[#BEBEC0]" />
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
        <div className="h-px w-full bg-[#BEBEC0]" />
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
        <div className="h-px w-full bg-[#BEBEC0]" />
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
        <div className="grid w-full grid-cols-1 gap-4">
          <Input
            label="Décrivez-nous votre besoin"
            disabled
            value={xpert.profile_mission?.workstation_description ?? empty}
          />
        </div>
      </div>
    </>
  );
}
