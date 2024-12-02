import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import TextArea from '@/components/inputs/TextArea';
import { empty } from '@/data/constant';
import { areaSelect, franceSelect } from '@/data/mocked_select';
import { profileDataCompany } from '@/data/profile';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import React, { useState } from 'react';
import type { DocumentInfo } from '../XpertTable';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loader from '@/components/Loader';

type XpertRowContentBisProps = {
  xpert: DBXpert;
  isLoading: boolean;
  cvInfo: DocumentInfo;
  ursaffInfo: DocumentInfo;
  kbisInfo: DocumentInfo;
  responsabiliteCivileInfo: DocumentInfo;
  ribInfo: DocumentInfo;
  habilitationInfo: DocumentInfo;
};

export default function XpertRowContentBis({
  xpert,
  isLoading,
  cvInfo,
  ursaffInfo,
  kbisInfo,
  responsabiliteCivileInfo,
  ribInfo,
  habilitationInfo,
}: XpertRowContentBisProps) {
  const { sectors, regions, expertises, specialities, jobTitles } = useSelect();
  const [documentType, setDocumentType] = useState(
    cvInfo
      ? 'cv'
      : ursaffInfo
        ? 'ursaff'
        : kbisInfo
          ? 'kbis'
          : responsabiliteCivileInfo
            ? 'civil_responsability'
            : ribInfo
              ? 'rib'
              : habilitationInfo
                ? 'habilitation'
                : ''
  );

  const selectOptions = [
    ...(cvInfo.created_at
      ? [
          {
            label: 'Curriculum Vitae',
            value: 'cv',
            json_key: new Date(cvInfo.created_at).toLocaleDateString(),
          },
        ]
      : []),
    ...(ursaffInfo.created_at
      ? [
          {
            label: 'Attestation URSAFF',
            value: 'ursaff',
            json_key: new Date(ursaffInfo.created_at).toLocaleDateString(),
          },
        ]
      : []),
    ...(kbisInfo.created_at
      ? [
          {
            label: 'KBIS -3mois',
            value: 'kbis',
            json_key: new Date(kbisInfo.created_at).toLocaleDateString(),
          },
        ]
      : []),
    ...(responsabiliteCivileInfo.created_at
      ? [
          {
            label: 'Responsabilité civile',
            value: 'civil_responsability',
            json_key: new Date(
              responsabiliteCivileInfo.created_at
            ).toLocaleDateString(),
          },
        ]
      : []),
    ...(ribInfo.created_at
      ? [
          {
            label: 'RIB',
            value: 'rib',
            json_key: new Date(ribInfo.created_at).toLocaleDateString(),
          },
        ]
      : []),
    ...(habilitationInfo.created_at
      ? [
          {
            label: 'Habilitation',
            value: 'habilitation',
            json_key: new Date(
              habilitationInfo.created_at
            ).toLocaleDateString(),
          },
        ]
      : []),
  ];

  const onValueChange = (value: string) => {
    setDocumentType(value);
  };

  return (
    <>
      {cvInfo.created_at && (
        <>
          <div className="w-full p-1 font-light xl:max-w-[280px]">
            <Label htmlFor="document_type" className="mb-1 flex items-center">
              Type de documents
            </Label>
            <Select
              onValueChange={onValueChange}
              name="document_type"
              disabled={false}
            >
              <SelectTrigger className="h-[42px] rounded-md border bg-white shadow-sm transition duration-200 ease-in-out">
                <SelectValue
                  className="bg-white"
                  placeholder={
                    <div className="flex flex-row items-center gap-2">
                      <p className="font-medium text-black">
                        {selectOptions[0]?.label}
                      </p>
                      <p className="font-medium text-[#BEBEC0]">
                        {selectOptions[0]?.json_key}
                      </p>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectGroup>
                  {selectOptions
                    .filter((item) => item.value)
                    .map((item) => (
                      <SelectItem
                        key={item.value || ''}
                        value={item.value || ''}
                        className="transition duration-150"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <p className="font-medium text-black">{item.label}</p>
                          <p className="font-medium text-[#BEBEC0]">
                            {item.json_key}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {isLoading ? (
        <Loader className="size-full" />
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
          ) : documentType === 'civil_responsability' &&
            responsabiliteCivileInfo.publicUrl ? (
            <iframe
              src={responsabiliteCivileInfo.publicUrl}
              className="h-[90vh] w-full py-2"
            />
          ) : documentType === 'rib' && ribInfo.publicUrl ? (
            <iframe src={ribInfo.publicUrl} className="h-[90vh] w-full py-2" />
          ) : documentType === 'habilitation' && habilitationInfo.publicUrl ? (
            <iframe
              src={habilitationInfo.publicUrl}
              className="h-[90vh] w-full py-2"
            />
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
