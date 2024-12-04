'use client';

import type { DBXpert, DBXpertOptimized } from '@/types/typesDb';
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
import DeleteXpertDialog from './DeleteXpertDialog';
import { FilterXpert } from '@/types/types';
import Button from '@/components/Button';
import { Skeleton } from '@/components/ui/skeleton';
// import CreateFournisseurXpertDialog from '@/components/dialogs/CreateXpertDialog';
import CreateFournisseurXpertDialog from '@/components/dialogs/CreateXpertDialog';

export type DocumentInfo = {
  publicUrl: string;
  created_at?: string;
};

export default function XpertTable() {
  const {
    xpertsOptimized,
    totalXpertOptimized,
    loading,
    setActiveFilters,
    activeFilters,
    fetchSpecificXpert,
    fetchXpertOptimizedFiltered,
  } = useXpertStore();

  const [xpertIdOpened, setXpertIdOpened] = useState('');
  const [cvInfo, setCvInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [ursaffInfo, setUrsaffInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [kbisInfo, setKbisInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [responsabiliteCivileInfo, setResponsabiliteCivileInfo] =
    useState<DocumentInfo>({ publicUrl: '' });
  const [ribInfo, setRibInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [habilitationInfo, setHabilitationInfo] = useState<DocumentInfo>({
    publicUrl: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const xpertIdParams = searchParams.get('id');
  const [xpertFilterKey, setXpertFilterKey] = useState(new Date().getTime());

  const hasMore =
    xpertsOptimized && totalXpertOptimized
      ? xpertsOptimized.length < totalXpertOptimized
      : totalXpertOptimized === 0
        ? false
        : true;

  const handleXpertIdOpened = useCallback((xpert: DBXpertOptimized) => {
    setXpertIdOpened((prevId) => {
      setCvInfo({ publicUrl: '' });
      setUrsaffInfo({ publicUrl: '' });
      setKbisInfo({ publicUrl: '' });

      return prevId === xpert.generated_id.toString()
        ? '0'
        : xpert.generated_id.toString();
    });
    fetchXpertDocumentsUrl(xpert);
  }, []);

  const fetchXpertDocumentsUrl = async (xpert: DBXpertOptimized) => {
    setIsLoading(true);
    const supabase = createSupabaseFrontendClient();

    const { data: cvData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/cv/`);

    const { data: ursaffData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/urssaf/`);

    const { data: kbisData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/kbis/`);

    const { data: responsabiliteCivileData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/civil_responsability/`);

    const { data: ribData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/rib/`);

    const { data: habilitationData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/habilitations/`);

    if (cvData && cvData.length > 0) {
      const lastCV = cvData[cvData.length - 1];
      const { data } = supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/cv/${lastCV.name}`);
      setCvInfo({
        publicUrl: data.publicUrl,
        created_at: lastCV.created_at,
      });
    }

    if (ursaffData && ursaffData.length > 0) {
      const lastUrsaffFile = ursaffData[ursaffData.length - 1];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/urssaf/${lastUrsaffFile.name}`);
      setUrsaffInfo({
        publicUrl: data.publicUrl,
        created_at: lastUrsaffFile.created_at,
      });
    }

    if (kbisData && kbisData.length > 0) {
      const lastKbisFile = kbisData[kbisData.length - 1];
      const { data } = supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/kbis/${lastKbisFile.name}`);
      setKbisInfo({
        publicUrl: data.publicUrl,
        created_at: lastKbisFile.created_at,
      });
    }

    if (responsabiliteCivileData && responsabiliteCivileData.length > 0) {
      const lastResponsabiliteCivileFile =
        responsabiliteCivileData[responsabiliteCivileData.length - 1];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(
          `${xpert.generated_id}/civil_responsability/${lastResponsabiliteCivileFile.name}`
        );
      setResponsabiliteCivileInfo({
        publicUrl: data.publicUrl,
        created_at: lastResponsabiliteCivileFile.created_at,
      });
    }

    if (ribData && ribData.length > 0) {
      const lastRibFile = ribData[ribData.length - 1];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/rib/${lastRibFile.name}`);
      setRibInfo({
        publicUrl: data.publicUrl,
        created_at: lastRibFile.created_at,
      });
    }

    if (habilitationData && habilitationData.length > 0) {
      const lastHabilitationFile =
        habilitationData[habilitationData.length - 1];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(
          `${xpert.generated_id}/habilitations/${lastHabilitationFile.name}`
        );
      setHabilitationInfo({
        publicUrl: data.publicUrl,
        created_at: lastHabilitationFile.created_at,
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const xpertId = searchParams.get('id');
    xpertId && fetchSpecificXpert(xpertId);
  }, [searchParams]);

  const resetFilter = () => {
    setActiveFilters({
      jobTitles: '',
      availability: '',
      cv: '',
      countries: [],
      sortDate: '',
      firstname: '',
      generated_id: '',
      lastname: '',
    });
    setXpertFilterKey(new Date().getTime());
    fetchXpertOptimizedFiltered(true);
  };

  return (
    <>
      {
        <div className="mb-4 w-fit">
          <CreateFournisseurXpertDialog role="xpert" />
        </div>
      }

      <div className="grid grid-cols-10 gap-3">
        <XpertFilter
          key={xpertFilterKey}
          xperts={xpertsOptimized || []}
          // onSortedDataChange={handleFilterChange}
        />
        <div className="col-span-10">
          {!loading ? (
            <div className="flex w-fit items-center gap-x-4">
              <p className="whitespace-nowrap">
                {totalXpertOptimized} résultats
              </p>
              {/* RESET */}
              {(activeFilters.jobTitles ||
                activeFilters.availability ||
                activeFilters.cv ||
                activeFilters.countries.length > 0 ||
                activeFilters.sortDate ||
                activeFilters.firstname ||
                activeFilters.generated_id ||
                activeFilters.lastname ||
                xpertIdParams) && (
                <button
                  className="font-[600] text-primary"
                  onClick={resetFilter}
                >
                  Réinitialiser
                </button>
              )}
            </div>
          ) : (
            <Skeleton className="h-6 w-40" />
          )}
        </div>
        {xpertsOptimized?.map((xpert) => {
          return (
            <React.Fragment key={xpert.id}>
              <XpertRow
                xpert={xpert}
                isOpen={xpertIdOpened === xpert.generated_id.toString()}
                onClick={() => handleXpertIdOpened(xpert)}
              />
              <div
                className={cn(
                  'col-span-5 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                {xpertIdOpened === xpert.generated_id && (
                  <XpertRowContent xpertOptimized={xpert} />
                )}
              </div>
              <div
                className={cn(
                  'col-span-5 hidden h-full max-h-0 w-full overflow-hidden',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                <div className="grid grid-cols-5 gap-3 rounded-lg rounded-b-xs bg-[#D0DDE1] p-3 shadow-container">
                  <XpertMissionFilter />
                  <div className="flex flex-col">
                    {/* {xpert.mission.length > 0 ? (
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
                    )} */}
                  </div>
                </div>
                {xpertIdOpened === xpert.generated_id && (
                  <XpertRowContentBis
                    isLoading={isLoading}
                    cvInfo={cvInfo}
                    ursaffInfo={ursaffInfo}
                    kbisInfo={kbisInfo}
                    responsabiliteCivileInfo={responsabiliteCivileInfo}
                    ribInfo={ribInfo}
                    habilitationInfo={habilitationInfo}
                  />
                )}
                <div className="flex w-full justify-end py-2">
                  <DeleteXpertDialog
                    xpertId={xpert.id}
                    xpertGeneratedId={xpert.generated_id}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {!xpertIdParams ? (
        <InfiniteScroll
          hasMore={hasMore}
          next={fetchXpertOptimizedFiltered}
          isLoading={false}
        >
          {hasMore && (
            <div className="mt-4 flex w-full items-center justify-center">
              <Loader />
            </div>
          )}
          {!hasMore && loading && (
            <div className="mt-4 flex w-full items-center justify-center">
              <Loader />
            </div>
          )}
          {xpertsOptimized?.length === 0 && (
            <div className="mt-4 flex w-full items-center justify-center">
              <p className="text-gray-secondary text-center text-sm">
                Aucun résultat
              </p>
            </div>
          )}
        </InfiniteScroll>
      ) : (
        loading && (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        )
      )}
    </>
  );
}
