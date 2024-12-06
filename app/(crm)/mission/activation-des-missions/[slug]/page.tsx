'use client';

import React, { use } from 'react';
import MissionActivationTable from './_components/MissionActivationTable';

export default function ActivationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);

  const missionNumber = params.slug.replaceAll('-', ' ');
  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <div className="flex w-3/4">
        <MissionActivationTable slug={missionNumber} />
      </div>
    </div>
  );
}
