import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import TextArea from '@/components/inputs/TextArea';
import { empty } from '@/data/constant';
import {
  postTypesSelect,
  profilSearchedSelect,
  reasonDeleteMissionSelect,
} from '@/data/mocked_select';
import { useSelect } from '@/store/select';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import React, { useEffect } from 'react';
import {
  calculateFinalRevenue,
  calculateProjectedRevenue,
} from '../../utils/tjm';
import { Button } from '@/components/ui/button';
import DeleteMissionDialog from '../../_components/DeleteMissionDialog';
import Link from 'next/link';

export default function RightSideFicheMission({
  missionDetails,
}: {
  missionDetails: DBMission;
}) {
  const {
    start_date,
    end_date,
    deadline_application,
    tjm,
    description,
    needed,
    advantages_company,
    address,
    city,
    postal_code,
    country,
    referent_name,
    referent_mail,
    referent_mobile,
    diplomas_other,
    languages_other,
    referent_fix,
    profile_searched,
    job_title,
    post_type,
    expertises,
    expertises_other,
    languages,
    sector,
    specialties,
    specialties_other,
    diplomas,
  } = missionDetails;

  const startDate = formatDate(start_date ?? '');
  const endDate = formatDate(end_date ?? '');
  const deadlineApplication = formatDate(deadline_application ?? '');

  const projectedRevenue = calculateProjectedRevenue(
    22,
    parseInt(tjm ?? '0'),
    30
  );

  const finalRevenue = calculateFinalRevenue(22, parseInt(tjm ?? '0'), 30);

  const selledTjmGd = parseInt(tjm ?? '0') + 30 * 1.55;

  const {
    jobTitles,
    sectors,
    specialities,
    diplomas: diplomaSelect,
    languages: languageSelect,
    fetchLanguages,
    fetchDiplomas,
    expertises: expertisesSelect,
    fetchJobTitles,
    fetchSectors,
    fetchSpecialties,
    fetchExpertises,
  } = useSelect();

  const loadingText = 'Chargement...';

  useEffect(() => {
    fetchJobTitles();
    fetchSpecialties();
    fetchDiplomas();
    fetchExpertises();
    fetchDiplomas();
    fetchLanguages();
    fetchSectors();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      {missionDetails.state === 'deleted' && (
        <>
          <p className="text-red-500">Cette mission a été supprimée</p>
          <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
            <h3 className="text-lg font-medium text-black">
              Motif de suppression
            </h3>
            <div className="gap flex w-full flex-row gap-4">
              <Input
                className="w-full max-w-[220px]"
                label="Motif de suppression"
                value={
                  getLabel({
                    value: missionDetails.reason_deletion ?? '',
                    select: reasonDeleteMissionSelect,
                  }) ?? empty
                }
                disabled
              />
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">Date de mission</h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            disabled
            label="Début de mission prévisionnel"
            value={startDate}
            defaultValue={startDate}
          />
          <Input
            disabled
            label="Fin de mission prévisionnel"
            value={endDate}
            defaultValue={endDate}
          />
          <Input
            disabled
            label="Remise des candidatures"
            value={deadlineApplication}
            defaultValue={deadlineApplication}
          />
        </div>
        <div className="gap flex w-2/3 flex-row gap-4">
          <Input
            disabled
            label="Début de mission définitif"
            value={startDate}
            defaultValue={startDate}
          />
          <Input disabled label="Fin de mission définitif" value={endDate} />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">
          Information monétaire
        </h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-full max-w-[220px]"
            type="number"
            label="CA prévisionnel de la mission"
            disabled
            value={projectedRevenue}
          />
          <Input
            className="max-max-w-[320px] w-full"
            type="number"
            label="CA définitif de la mission"
            disabled
            value={finalRevenue}
          />
          <Input
            className="w-full max-w-[220px]"
            type="number"
            label="Prix Grand Déplacement / jour"
            disabled
            value={tjm ?? ''}
          />
        </div>
        <div className="gap flex w-full flex-row flex-wrap gap-4">
          <Input
            className="max-w-[220px]"
            type="number"
            label="TJM Validé Xpert (GD inclus)"
            disabled
            value={tjm ?? ''}
          />
          <Input
            className="max-w-[220px]"
            type="number"
            label="TJM Base Fournisseur (GD inclus)"
            disabled
            value={tjm ?? ''}
          />
          <Input
            className="max-w-[160px]"
            type="number"
            label="Statut définitif"
            disabled
            value={projectedRevenue}
          />
          <Input
            className="max-w-[160px]"
            type="number"
            label="Charge patronale"
            disabled
            value={tjm ?? ''}
          />
          <Input
            className="max-w-[160px]"
            type="number"
            label="TJM Cible max"
            disabled
            value={tjm ?? ''}
          />
        </div>
        <div className="gap flex-wr flex w-1/4 flex-row gap-4">
          <Input
            className="max-w-[220px]"
            type="number"
            label="TJM vendu GD + charge incluse"
            disabled
            value={selledTjmGd}
          />
          <Input
            className="max-w-[320px]"
            type="number"
            label="Marge totale"
            disabled
            value={tjm ?? ''}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">
          Informations de mission
        </h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-full max-w-[200px]"
            label="Profil recherché"
            value={
              getLabel({
                value: profile_searched ?? '',
                select: profilSearchedSelect,
              }) ?? empty
            }
            disabled
          />
          <Input
            className="w-full max-w-[280px]"
            label="Intitulé de mission"
            disabled
            value={
              jobTitles.length
                ? (getLabel({ value: job_title ?? '', select: jobTitles }) ??
                  empty)
                : loadingText
            }
          />

          <MultiSelectComponent
            className="w-[280px]"
            disabled
            label="Type de poste"
            name=""
            defaultSelectedKeys={post_type}
            onValueChange={() => ({})}
            options={postTypesSelect}
          />
        </div>
        <div className="gap flex w-full flex-row flex-wrap gap-4">
          <Input
            className="w-1/3"
            label="Secteur d’activité"
            value={
              sectors.length
                ? (getLabel({ value: sector ?? '', select: sectors }) ?? empty)
                : loadingText
            }
            disabled
          />

          <MultiSelectComponent
            className="w-[280px]"
            disabled
            label="Spécialité"
            name=""
            placeholder={loadingText}
            defaultSelectedKeys={specialties}
            onValueChange={() => ({})}
            options={specialities ?? []}
          />
          {specialties_other && (
            <TextArea
              className="w-1/3"
              label="Détails de la spécialité"
              value={specialties_other}
              disabled
            />
          )}
          <MultiSelectComponent
            className="w-[280px]"
            disabled
            label="Expertise"
            name=""
            placeholder={loadingText}
            defaultSelectedKeys={expertises}
            onValueChange={() => ({})}
            options={expertisesSelect ?? []}
          />
          {expertises_other && (
            <TextArea
              className="w-1/3"
              label="Détails de l'expertise"
              value={expertises_other}
              disabled
            />
          )}
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <MultiSelectComponent
            className="w-[280px]"
            disabled
            label="Diplôme / Niveau d’étude"
            name=""
            placeholder={loadingText}
            defaultSelectedKeys={diplomas}
            onValueChange={() => ({})}
            options={diplomaSelect ?? []}
          />
          {diplomas_other && (
            <TextArea
              className="w-1/3"
              label="Détails du diplôme"
              value={diplomas_other}
              disabled
            />
          )}

          <MultiSelectComponent
            className="w-[280px]"
            disabled
            label="Langues"
            name=""
            placeholder={loadingText}
            defaultSelectedKeys={languages}
            onValueChange={() => ({})}
            options={languageSelect ?? []}
          />
          {languages_other && (
            <TextArea
              className="w-1/3"
              label="Détails du diplôme"
              value={languages_other}
              disabled
            />
          )}
          <Input
            className="w-1/3"
            label="TJM cible MAX"
            value={tjm ?? ''}
            disabled
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-1/3"
            label="Poste ouvert aux situations de handicap"
            value={'Oui'}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">Lieu de la mission</h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-full max-w-[120px]"
            label="N° de rue"
            disabled
            value={address?.split(' ')[0] ?? ''}
          />
          <Input
            className="w-full max-w-[280px]"
            label="Adresse postale"
            disabled
            value={address ?? ''}
          />
          <Input
            className="w-[170px]"
            label="Ville"
            disabled
            value={city ?? ''}
          />
          <Input
            className="w-full max-w-[120px]"
            label="Code postal"
            value={postal_code ?? ''}
            disabled
          />
          <Input
            className="w-full max-w-[200px]"
            disabled
            label="Pays"
            value={country ?? ''}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">
          Descriptif de la mission
        </h3>
        <div className="gap flex w-full flex-row gap-4">
          <TextArea
            label="Descriptif du besoin (Détaillez votre besoin quelques lignes)"
            value={description ?? ''}
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            label="Descriptif du poste (Brief complet de votre recherche)"
            value={needed ?? ''}
            disabled
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            label="Les + de votre entreprise"
            value={advantages_company ?? ''}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">Référent de mission</h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-1/3"
            disabled
            label="Nom du référent de mission"
            value={referent_name ?? ''}
          />
          <Input
            className="w-1/3"
            label="Tél mobile référent de mission"
            value={referent_mobile ?? ''}
            disabled
          />
          <Input
            className="w-1/3"
            label="Tél fixe référent de mission"
            value={referent_fix ?? ''}
            disabled
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-1/3"
            label="Mail du référent de mission"
            value={referent_mail ?? empty}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">Évaluation XPERT</h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-1/3"
            label="Évaluation"
            value={tjm ?? ''}
            disabled
          />
          <Input
            className="w-1/3"
            label="Auto Évaluation"
            value={tjm ?? ''}
            disabled
          />
        </div>
      </div>
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="flex gap-3">
          <Link
            href={`/mission/matching/${missionDetails.mission_number?.replace(
              ' ',
              '-'
            )}`}
          >
            <Button className="px-12 py-3 text-white">Vers le matching</Button>
          </Link>
          {missionDetails.xpert_associated_id && (
            <Link
              href={`/mission/activation-des-missions/${missionDetails.mission_number?.replace(
                ' ',
                '-'
              )}`}
            >
              <Button className="px-12 py-3 text-white">
                Vers activation de mission
              </Button>
            </Link>
          )}
        </div>
        {missionDetails.state != 'deleted' && (
          <DeleteMissionDialog missionId={missionDetails.id} />
        )}
      </div>
    </div>
  );
}
