import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import {
  areaSelect,
  booleanSelect,
  expertiseSelect,
  franceSelect,
  jobTitleSelect,
  sectorSelect,
  specialitySelect,
} from '@/data/mocked_select';
import { useSelect } from '@/store/select';
import { getLabel } from '@/utils/getLabel';
import React, { useEffect, useState } from 'react';
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
import { useXpertStore } from '@/store/xpert';
import type { NestedTableKey } from './XpertRowContent';
import MultiCreatableSelect from '@/components/MultiCreatableSelect';
import CreatableSelect from '@/components/CreatableSelect';
import FileInput from '@/components/inputs/FileInput';
import Button from '@/components/Button';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

type XpertRowContentBisProps = {
  isLoading: boolean;
  cvInfo: DocumentInfo;
  urssafInfo: DocumentInfo;
  kbisInfo: DocumentInfo;
  responsabiliteCivileInfo: DocumentInfo;
  ribInfo: DocumentInfo;
  habilitationInfo: DocumentInfo;
  handleKeyChanges: (table: NestedTableKey | undefined, name: string) => void;
};

type FileType =
  | 'cv'
  | 'urssaf'
  | 'kbis'
  | 'civil_responsability'
  | 'rib'
  | 'habilitation';

export default function XpertRowContentBis({
  isLoading,
  cvInfo,
  urssafInfo,
  kbisInfo,
  responsabiliteCivileInfo,
  ribInfo,
  habilitationInfo,
  handleKeyChanges,
}: XpertRowContentBisProps) {
  const {
    openedXpert,
    openedXpertNotSaved: xpert,
    setOpenedXpertNotSaved: setXpert,
  } = useXpertStore();

  const { regions, fetchRegions } = useSelect();

  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFileType, setNewFileType] = useState<FileType | null>(null);

  const [reload, setReload] = useState(false);

  const typeOptions: { label: string; value: FileType }[] = [
    { label: 'Curriculum Vitae', value: 'cv' },
    { label: 'Attestation Urssaf', value: 'urssaf' },
    { label: 'KBIS -3mois', value: 'kbis' },
    { label: 'Responsabilité civile', value: 'civil_responsability' },
    { label: 'RIB', value: 'rib' },
    { label: 'Habilitation', value: 'habilitation' },
  ];

  useEffect(() => {
    setXpert(openedXpert);
  }, [openedXpert]);

  useEffect(() => {
    fetchRegions();
  }, []);

  const [documentType, setDocumentType] = useState(
    cvInfo
      ? 'cv'
      : urssafInfo
        ? 'urssaf'
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
    ...(urssafInfo.created_at
      ? [
          {
            label: 'Attestation Urssaf',
            value: 'urssaf',
            json_key: new Date(urssafInfo.created_at).toLocaleDateString(),
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

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    table?: NestedTableKey
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    handleKeyChanges(table, name);

    if (table) {
      const newXpert = xpert
        ? { ...xpert, [table]: { ...xpert[table], [name]: value } }
        : null;
      setXpert(newXpert);
      return;
    }
    const newXpert = xpert ? { ...xpert, [name]: value } : null;
    setXpert(newXpert);
  };

  const handleChangeSelect = (
    value: string | number,
    name: string,
    table?: NestedTableKey
  ) => {
    handleKeyChanges(table, name);

    if (table) {
      const newXpert = xpert
        ? { ...xpert, [table]: { ...xpert[table], [name]: value } }
        : null;
      setXpert(newXpert);
      return;
    }
    const newXpert = xpert ? { ...xpert, [name]: value } : null;
    setXpert(newXpert);
  };

  const handleChangeMultiSelect = (
    value: string[] | string,
    name: string,
    table?: NestedTableKey
  ) => {
    handleKeyChanges(table, name);
    if (table) {
      const newXpert = xpert
        ? { ...xpert, [table]: { ...xpert[table], [name]: value } }
        : null;
      setXpert(newXpert);
      return;
    }
    const newXpert = xpert ? { ...xpert, [name]: value } : null;

    setXpert(newXpert);
  };

  const onValueChange = (value: string) => {
    setDocumentType(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewFile(file);
  };

  const uploadFile = async () => {
    const supabase = createSupabaseFrontendClient();
    if (!newFile || !newFileType || !xpert) {
      return;
    }

    try {
      // Upload the file
      const file = newFile;
      const fileType = newFileType;
      const fileName = `${xpert.generated_id}/${fileType}/${fileType}_${new Date().getTime()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile_files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('profile_files-bucket')
        .getPublicUrl(uploadData?.fullPath ?? '');

      // Update the appropriate column in the profile table based on file type
      if (fileType === 'cv') {
        const { error: updateError } = await supabase
          .from('profile')
          .update({ cv_name: file.name })
          .eq('id', xpert.id);

        if (updateError) throw updateError;
      }

      // Reset states
      setNewFile(null);
      setNewFileType(null);
      setReload(true);

      toast.success(
        'Fichier uploadé avec succès (recharger la page pour voir les changements)'
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Une erreur est survenue lors de l'upload du fichier");
    }
  };

  const handleFileTypes = (value: FileType) => {
    setNewFileType(value);
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!xpert) {
    return null;
  }
  return (
    <>
      {cvInfo.created_at ||
        (urssafInfo.created_at && (
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
                        <p className="font-medium text-[#BEBEC0] group-hover:text-black">
                          {selectOptions[0]?.json_key}
                        </p>
                      </div>
                    }
                  />
                </SelectTrigger>
                <SelectContent className="group w-full">
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
                            <p className="font-medium text-black">
                              {item.label}
                            </p>
                            <p className="font-medium">{item.json_key}</p>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </>
        ))}
      <div className="bg flex w-full items-center gap-x-4">
        <FileInput
          name=""
          fileName={newFile?.name ?? ''}
          label="Uploader un nouveau document"
          placeholder=""
          onChange={handleFileChange}
        />
        <CreatableSelect
          options={typeOptions}
          className="max-w-[300px]"
          onChange={(e) => handleFileTypes(e.value as FileType)}
          label="Type de document"
        />
        <Button
          disabled={!newFile || !newFileType}
          className="flex size-fit self-end disabled:bg-gray-300"
          onClick={uploadFile}
        >
          Ajouter le fichier
        </Button>
        <Button
          disabled={!reload}
          className="flex size-fit self-end disabled:bg-gray-300"
          onClick={handleReload}
        >
          Recharger la page
        </Button>
      </div>
      {isLoading ? (
        <Loader className="size-full" />
      ) : (
        <>
          {documentType === 'cv' && cvInfo.publicUrl ? (
            <iframe src={cvInfo.publicUrl} className="h-[90vh] w-full py-2" />
          ) : documentType === 'urssaf' && urssafInfo.publicUrl ? (
            <iframe
              src={urssafInfo.publicUrl}
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
        <p className="text-lg font-medium text-black">Recherche de mission</p>
        <p>{xpert.firstname}</p>
        <div className="grid w-full grid-cols-2 gap-4">
          <MultiCreatableSelect
            creatable
            label="Quels secteurs d'activités ?"
            defaultValue={xpert.profile_mission?.sector?.map((sector) => ({
              label: getLabel({ value: sector, select: sectorSelect }) ?? '',
              value: sector ?? '',
            }))}
            onChange={(selectedOption) =>
              handleChangeMultiSelect(
                selectedOption.map((option) => option.value),
                'sector',
                'profile_mission'
              )
            }
            optionsOther={xpert.profile_mission?.sector_other ?? ''}
            options={sectorSelect}
          />
          {xpert.profile_mission?.sector?.includes('others') && (
            <Input
              required
              label="Préciser vos autres secteurs d'activités"
              name="sector_other"
              placeholder="Préciser vos autres secteurs d'activités"
              className="mission_input min-w-[200px] flex-1 xl:max-w-full"
              onChange={(e) => handleChangeInput(e, 'profile_mission')}
              value={xpert.profile_mission?.sector_other ?? ''}
            />
          )}
          <MultiCreatableSelect
            label="Types de postes"
            defaultValue={xpert.profile_mission?.job_titles?.map((title) => ({
              label: getLabel({ value: title, select: jobTitleSelect }) ?? '',
              value: title ?? '',
            }))}
            onChange={(selectedOption) =>
              handleChangeMultiSelect(
                selectedOption.map((option) => option.value),
                'job_titles',
                'profile_mission'
              )
            }
            options={jobTitleSelect}
          />
          {xpert.profile_mission?.job_titles?.includes('others') && (
            <Input
              required
              label="Préciser le type de poste"
              name="job_titles_other"
              placeholder="Préciser le type de poste"
              className="mission_input min-w-[200px] flex-1 xl:max-w-full"
              onChange={(e) => handleChangeInput(e, 'profile_mission')}
              value={xpert.profile_mission?.job_titles_other ?? ''}
            />
          )}
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <MultiCreatableSelect
            creatable
            label="Dans quelles spécialités ?"
            defaultValue={xpert.profile_mission?.specialties?.map((spe) => ({
              label: getLabel({ value: spe, select: specialitySelect }) ?? '',
              value: spe ?? '',
            }))}
            onChange={(selectedOption) =>
              handleChangeMultiSelect(
                selectedOption.map((option) => option.value),
                'specialties',
                'profile_mission'
              )
            }
            optionsOther={xpert.profile_mission?.specialties_others ?? ''}
            options={
              xpert.profile_mission?.specialties_others
                ? [
                    ...specialitySelect,
                    {
                      label: xpert.profile_mission.specialties_others ?? '',
                      value: xpert.profile_mission.specialties_others ?? '',
                    },
                  ]
                : specialitySelect
            }
          />
          {xpert.profile_mission?.specialties?.includes('others') && (
            <Input
              required
              label="Préciser la spécialité"
              name="specialties_others"
              placeholder="Préciser la spécialité"
              className="mission_input min-w-[200px] flex-1 xl:max-w-full"
              onChange={(e) => handleChangeInput(e, 'profile_mission')}
              value={xpert.profile_mission?.specialties_others ?? ''}
            />
          )}
          <MultiCreatableSelect
            creatable
            label="Dans quelles expertises ?"
            defaultValue={xpert.profile_mission?.expertises?.map((exp) => ({
              label: getLabel({ value: exp, select: expertiseSelect }) ?? '',
              value: exp ?? '',
            }))}
            onChange={(selectedOption) =>
              handleChangeMultiSelect(
                selectedOption.map((option) => option.value),
                'expertises',
                'profile_mission'
              )
            }
            optionsOther={xpert.profile_mission?.expertises_others ?? ''}
            options={
              xpert.profile_mission?.expertises_others
                ? [
                    ...expertiseSelect,
                    {
                      label: xpert.profile_mission.expertises_others ?? '',
                      value: xpert.profile_mission.expertises_others ?? '',
                    },
                  ]
                : expertiseSelect
            }
          />
          {xpert.profile_mission?.expertises?.includes('others') && (
            <Input
              required
              label="Préciser l'expertise"
              name="expertises_others"
              placeholder="Préciser l'expertise"
              className="mission_input min-w-[200px] flex-1 xl:max-w-full"
              onChange={(e) => handleChangeInput(e, 'profile_mission')}
              value={xpert.profile_mission?.expertises_others ?? ''}
            />
          )}
        </div>
        <div className="h-px w-full bg-[#BEBEC0]" />
        <p className="text-lg font-medium text-black">Disponibilités</p>
        <div className="grid w-full grid-cols-2 gap-4">
          <Input
            type="date"
            label="Disponibilités"
            value={xpert.profile_mission?.availability ?? ''}
            name="availability"
            onChange={(e) => handleChangeInput(e, 'profile_mission')}
          />

          {/* <MultiSelectComponent
            className="xl:max-w-full"
            disabled
            label="Quelles zones géographiques"
            defaultSelectedKeys={[...(xpert.profile_mission?.area ?? [])]}
            options={[...areaSelect]}
            name=""
            onValueChange={() => ({})}
          /> */}
          <MultiCreatableSelect
            label="Quelles zones géographiques?"
            defaultValue={xpert.profile_mission?.area?.map((area) => ({
              label: getLabel({ value: area, select: areaSelect }) ?? '',
              value: area ?? '',
            }))}
            onChange={(selectedOption) =>
              handleChangeMultiSelect(
                selectedOption.map((option) => option.value),
                'area',
                'profile_mission'
              )
            }
            options={areaSelect}
          />
          {xpert.profile_mission?.area?.includes('france') && (
            <MultiCreatableSelect
              label="Précisez la zone géographique française"
              defaultValue={xpert.profile_mission?.france_detail?.map(
                (item) => ({
                  label: getLabel({ value: item, select: franceSelect }) ?? '',
                  value: item ?? '',
                })
              )}
              onChange={(selectedOption) =>
                handleChangeMultiSelect(
                  selectedOption.map((option) => option.value),
                  'france_detail',
                  'profile_mission'
                )
              }
              options={franceSelect}
            />
          )}
          {xpert.profile_mission?.france_detail?.includes('regions') &&
            xpert.profile_mission.area?.includes('france') && (
              <MultiCreatableSelect
                label="Précisez la région française"
                defaultValue={xpert.profile_mission?.regions?.map((region) => ({
                  label: getLabel({ value: region, select: regions }) ?? '',
                  value: region ?? '',
                }))}
                onChange={(selectedOption) =>
                  handleChangeMultiSelect(
                    selectedOption.map((option) => option.value),
                    'regions',
                    'profile_mission'
                  )
                }
                options={regions.map((region) => ({
                  label: region.label!,
                  value: region.value!,
                }))}
              />
            )}
        </div>
        <div className="h-px w-full bg-[#BEBEC0]" />
        <p className="text-lg font-medium text-black">Prétentions salariales</p>
        <div className="grid w-full grid-cols-2 gap-4">
          {/* <Input
            label="TJM total frais souhaité (hors grand déplacement)"
            disabled
            value={xpert.profile_mission?.desired_tjm ?? empty}
          /> */}
          <Input
            label="TJM total frais souhaité (hors grand déplacement)"
            value={xpert.profile_mission?.desired_tjm ?? empty}
            name="desired_tjm"
            onChange={(e) => handleChangeInput(e, 'profile_mission')}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Input
            label="Rémunération BRUT mensuel souhaitée (hors grand déplacement)"
            value={xpert.profile_mission?.desired_monthly_brut ?? empty}
            name="desired_monthly_brut"
            onChange={(e) => handleChangeInput(e, 'profile_mission')}
          />
        </div>
        <div className="h-px w-full bg-[#BEBEC0]" />
        <p className="text-lg font-medium text-black">Aménagement de poste</p>
        <div className="grid w-full grid-cols-2 gap-4">
          {/* <Input
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
          /> */}
          <CreatableSelect
            options={booleanSelect}
            defaultValue={{
              label: String(xpert.profile_mission?.workstation_needed) ?? '',
              value: String(xpert.profile_mission?.workstation_needed) ?? '',
            }}
            onChange={(e) =>
              handleChangeSelect(
                e.value,
                'workstation_needed',
                'profile_mission'
              )
            }
            label={'A besoin d’un amménagement de poste ?'}
          />
        </div>
        {xpert.profile_mission?.workstation_needed === 'true' && (
          <div className="grid w-full grid-cols-1 gap-4">
            <Input
              label="Décrivez-nous votre besoin"
              value={xpert.profile_mission?.workstation_description ?? empty}
              name="workstation_description"
              onChange={(e) => handleChangeInput(e, 'profile_mission')}
            />
          </div>
        )}
      </div>
    </>
  );
}
