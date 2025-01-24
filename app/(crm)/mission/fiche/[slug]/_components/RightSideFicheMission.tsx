import { Button } from '@/components/ui/button';
import DeleteMissionDialog from '../../_components/DeleteMissionDialog';
import Link from 'next/link';
import { DeletedMissionBanner } from './sections/DeletedMissionBanner';
import { MissionDates } from './sections/MissionDates';
import { MissionFinancials } from './sections/MissionFinancials';
import { MissionDetails } from './sections/MissionDetails';
import { MissionLocation } from './sections/MissionLocation';
import { MissionDescription } from './sections/MissionDescription';
import { MissionReferentSupplier } from './sections/MissionReferentSupplier';
import { MissionEvaluation } from './sections/MissionEvaluation';
import { useEditMissionStore } from '../../editMissionStore';
import { MissionReferentXpertOne } from './sections/MissionReferentXpertOne';
import { useWarnIfUnsavedChanges } from '@/hooks/useLeavePageConfirm';
import { MissionNotes } from './MissionNotes';

export default function RightSideFicheMission() {
  const {
    openedMissionNotSaved: mission,
    handleSaveUpdatedMission,

    hasChanges,
    loading,
  } = useEditMissionStore();

  useWarnIfUnsavedChanges(hasChanges);

  if (!mission) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      {mission.state === 'deleted' && (
        <DeletedMissionBanner reason={mission.reason_deletion} />
      )}

      <MissionDates />
      <MissionFinancials />
      <MissionDetails />
      <MissionLocation />
      <MissionDescription />

      {/* Référent FOURNISSEUR != Référent XPERT ONE (admin) */}
      <MissionReferentSupplier />

      {/* Référent XPERT ONE (admin) */}
      <MissionReferentXpertOne />

      <MissionEvaluation />
      <MissionNotes missionId={mission.id} />
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="flex gap-3">
          <Button
            onClick={handleSaveUpdatedMission}
            className="self-end px-12 py-3 text-white"
            disabled={!hasChanges || loading}
            variant={!hasChanges ? 'outline' : 'default'}
          >
            Enregistrer
          </Button>
          <Link
            href={`/mission/matching/${mission.mission_number?.replace(' ', '-')}`}
          >
            <Button className="px-12 py-3 text-white">Vers le matching</Button>
          </Link>
          {mission.xpert_associated_id && (
            <Link
              href={`/mission/activation-des-missions/${mission.mission_number?.replace(' ', '-')}`}
            >
              <Button className="px-12 py-3 text-white">
                Vers activation de mission
              </Button>
            </Link>
          )}
        </div>
        {mission.state != 'deleted' && (
          <DeleteMissionDialog missionId={mission.id} />
        )}
      </div>
    </div>
  );
}
