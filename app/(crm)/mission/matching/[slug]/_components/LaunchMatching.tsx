import { FilterButton } from '@/components/FilterButton';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function LaunchMatching() {
  return (
    <>
      <div className="col-span-3 rounded border p-3">
        <Button className="w-full text-white">LANCER LE MATCHING</Button>

        <div className="mt-3 grid grid-cols-4 gap-spaceSmall">
          <div className="col-span-1">
            <FilterButton
              className="size-full"
              placeholder="92 XPERT correspondant"
            />
          </div>
          <div className="col-span-1">
            <FilterButton className="size-full" placeholder="Non matching" />
          </div>
          <div className="col-span-1">
            <FilterButton
              className="size-full"
              placeholder="XPERT disponible ?"
            />
          </div>
          <div className="col-span-1">
            <FilterButton
              className="size-full"
              placeholder="Envoyer vers Drag & Drop"
              filter={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
