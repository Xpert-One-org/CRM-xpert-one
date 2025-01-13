'use client';

import { useEffect } from 'react';
import { useEditMissionStore } from '../editMissionStore';
import { getMissionDetails } from '../mission.action';
import FicheMissionTable from './_components/FicheMissionTable';
import { use } from 'react';

export default function FicheMissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { setOpenedMission, setOpenedMissionNotSaved } = useEditMissionStore();

  useEffect(() => {
    const fetchMission = async () => {
      const mission = await getMissionDetails(resolvedParams.slug);
      setOpenedMission(mission);
      setOpenedMissionNotSaved(mission);
    };

    fetchMission();

    return () => {
      setOpenedMission(null);
      setOpenedMissionNotSaved(null);
    };
  }, [resolvedParams.slug]);

  return <FicheMissionTable />;
}
