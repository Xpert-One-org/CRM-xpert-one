import React, { Suspense } from 'react';
import NavigationCommunaute from './_components/NavigationCommunaute';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full flex-col gap-spaceXSmall overflow-scroll lg:max-h-[calc(100vh_-_170px)]">
      {/* <InformativePopup /> */}
      {/* <UnderDevelopmentOverlay
        message={
          "L'espace communauté est en cours de redéveloppement."
        }
      /> */}
      <div className="flex w-full justify-end">
        <div></div>
      </div>
      {/* Container  */}
      <section className="flex w-full grow flex-col">
        <div className="pb-spaceMediumContainer">
          <NavigationCommunaute />
        </div>
        {children}
      </section>
    </section>
  );
}
