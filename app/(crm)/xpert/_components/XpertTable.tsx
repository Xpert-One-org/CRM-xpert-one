'use client';

import type { DBXpert } from '@/types/typesDb';
import React, { useCallback, useEffect, useState } from 'react';
import XpertRow from './row/XpertRow';
import XpertMissionRow from './row/mission/XpertMissionRow';
import { cn } from '@/lib/utils';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { useSelect } from '@/store/select';
import { useSearchParams } from 'next/navigation';
import { useXpertStore } from '@/store/xpert';
import Loader from '@/components/Loader';
import XpertFilter from './XpertFilter';
import XpertRowContent from './row/XpertRowContent';
import XpertMissionFilter from './row/mission/XpertMissionFilter';
import XpertRowContentBis from './row/XpertRowContentBis';
import InfiniteScroll from '@/components/ui/infinite-scroll';

export default function XpertTable() {
  const {
    fetchSpecialties,
    fetchExpertises,
    fetchHabilitations,
    fetchDiplomas,
    fetchLanguages,
    fetchSectors,
    fetchJobTitles,
    fetchPosts,
    fetchInfrastructures,
    fetchRegions,
    fetchCountries,
  } = useSelect();

  const { fetchXperts, xperts, loading, totalXperts, fetchSpecificXpert } =
    useXpertStore();

  const [xpertIdOpened, setXpertIdOpened] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const handleXpertIdOpened = useCallback((xpert: DBXpert) => {
    setXpertIdOpened((prevId) => {
      setCvUrl('');
      return prevId === xpert.generated_id.toString()
        ? '0'
        : xpert.generated_id.toString();
    });
    fetchCvUrl(xpert);
  }, []);

  const fetchCvUrl = async (xpert: DBXpert) => {
    setIsLoading(true);
    const supabase = createSupabaseFrontendClient();

    const { data } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/cv/`);

    if (data?.length === 0) {
      setIsLoading(false);
      setCvUrl('');
      return;
    }

    const lastFile = data?.[data.length - 1];

    const { data: cvUrl } = await supabase.storage
      .from('profile_files')
      .getPublicUrl(`${xpert.generated_id}/cv/${lastFile?.name}`);

    setCvUrl(cvUrl.publicUrl);
    setIsLoading(false);
  };

  useEffect(() => {
    const xpertId = searchParams.get('id');
    if (xpertId && xperts) {
      const foundXpert = xperts.find((xpert) => xpert.generated_id === xpertId);
      if (foundXpert) {
        handleXpertIdOpened(foundXpert);
      } else {
        fetchSpecificXpert(xpertId);
      }
      setXpertIdOpened(xpertId);
    }
  }, [handleXpertIdOpened, searchParams, xperts]);

  useEffect(() => {
    fetchSpecialties();
    fetchExpertises();
    fetchHabilitations();
    fetchDiplomas();
    fetchLanguages();
    fetchSectors();
    fetchJobTitles();
    fetchRegions();
    fetchCountries();
    fetchPosts();
    fetchSectors();
    fetchInfrastructures();
  }, [
    fetchCountries,
    fetchDiplomas,
    fetchExpertises,
    fetchHabilitations,
    fetchInfrastructures,
    fetchJobTitles,
    fetchLanguages,
    fetchPosts,
    fetchRegions,
    fetchSectors,
    fetchSpecialties,
  ]);

  const hasMore = xperts && totalXperts ? xperts.length < totalXperts : true;

  return (
    <>
      <div className="mb-2 flex items-center justify-end gap-2">
        {/* <Button className="py-spaceXSmall pl-spaceContainer text-white">
          Créer un xpert
        </Button> */}
        {/* {xpertIdOpened !== '0' && (
          <Button className="py-spaceXSmall pl-spaceContainer text-white">
            Enregistrer
          </Button>
        )} */}
      </div>

      <div className="grid grid-cols-7 gap-3">
        <XpertFilter />
        {xperts?.map((xpert, i) => {
          return (
            <React.Fragment key={`${xpert.id} - ${i}`}>
              <XpertRow
                xpert={xpert}
                isOpen={xpertIdOpened === xpert.generated_id}
                onClick={() => handleXpertIdOpened(xpert)}
              />
              <div
                className={cn(
                  'col-span-3 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                <XpertRowContent xpert={xpert} />
              </div>
              <div
                className={cn(
                  'col-span-4 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                <div className="grid grid-cols-5 gap-3 p-[14px]">
                  <XpertMissionFilter />
                  <div className="flex flex-col">
                    {xpert.mission.length > 0 ? (
                      <>
                        {xpert.mission.map((mission) => (
                          <XpertMissionRow key={mission.id} mission={mission} />
                        ))}
                      </>
                    ) : (
                      <div className="col-span-4 flex items-center justify-center">
                        <p className="text-gray-secondary text-center text-sm">
                          Aucune mission
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <XpertRowContentBis
                  xpert={xpert}
                  isLoading={isLoading}
                  cvUrl={cvUrl}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <InfiniteScroll hasMore={hasMore} next={fetchXperts} isLoading={false}>
        {hasMore && (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
      </InfiniteScroll>
    </>
  );
}
