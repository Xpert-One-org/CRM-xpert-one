import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import { useSelect } from '@/store/select';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import React, { useEffect } from 'react';

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
    address,
    city,
    postal_code,
    country,
    referent_name,
    referent_mail,
    referent_mobile,
    referent_fix,
    profile_searched,
    job_title,
    post_type,
    expertises,
    languages,
    sector,
    specialties,
    diplomas,
    mission_number,
    mission_application,
    description,
  } = missionDetails;

  const startDate = formatDate(start_date ?? '');
  const endDate = formatDate(end_date ?? '');
  const deadlineApplication = formatDate(deadline_application ?? '');

  const { jobTitles, fetchJobTitles } = useSelect();

  useEffect(() => {
    fetchJobTitles();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
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
            value={tjm ?? ''}
          />
          <Input
            className="max-max-w-[320px] w-full"
            type="number"
            label="CA définitif de la mission"
            disabled
            value={tjm ?? ''}
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
            value={tjm ?? ''}
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
            value={tjm ?? ''}
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
            value={profile_searched ?? ''}
            disabled
          />
          <Input
            className="w-full max-w-[280px]"
            label="Intitulé de mission"
            disabled
            value={
              getLabel({ value: job_title ?? '', select: jobTitles }) ?? empty
            }
          />
          <Input
            className="w-[280px]"
            disabled
            label="Type de poste"
            value={post_type ?? ''}
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-1/3"
            label="Secteur d’activité"
            value={sector ?? ''}
            disabled
          />
          <Input
            className="w-1/3"
            label="Spécialité"
            value={specialties ?? ''}
            disabled
          />
          <Input
            className="w-1/3"
            label="Expertise"
            value={expertises ?? ''}
            disabled
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-1/3"
            label="Diplôme / Niveau d’étude"
            value={diplomas ?? ''}
            disabled
          />
          <Input
            className="w-1/3"
            label="Langues"
            value={languages ?? ''}
            disabled
          />
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
          <Input
            label="Descriptif du besoin (Détaillez votre besoin quelques lignes)"
            value={tjm ?? ''}
            disabled
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            label="Descriptif du poste (Brief complet de votre recherche)"
            value={tjm ?? ''}
            disabled
          />
        </div>
        <div className="gap flex w-full flex-row gap-4">
          <Input label="Les + de votre entreprise" value={tjm ?? ''} disabled />
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
    </div>
  );
}
