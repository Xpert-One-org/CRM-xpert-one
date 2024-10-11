'use client';

import React, { useEffect, useState } from 'react';
import { getMissionDetails } from '../mission.action';
import type { DBMission } from '@/types/typesDb';
import FicheMissionTable from './_components/FicheMissionTable';

export default function MissionFichePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: missionId } = params;
  const missionNumber = missionId.replace('-', ' ');
  const [missionDetails, setMissionDetails] = useState<DBMission | null>(null);

  useEffect(() => {
    const fetchMissionDetails = async () => {
      try {
        const details = await getMissionDetails(missionNumber);
        setMissionDetails(details);
      } catch (error) {
        console.error('Failed to fetch mission details:', error);
      }
    };

    fetchMissionDetails();
  }, [missionId]);

  return (
    <div>
      {missionDetails ? (
        <FicheMissionTable missionDetails={missionDetails} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
