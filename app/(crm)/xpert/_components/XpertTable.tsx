'use client';

import type { DBXpert, DBXpertOptimized, DBXpertNote } from '@/types/typesDb';
import React, { useCallback, useEffect, useState } from 'react';
import XpertRow from './row/XpertRow';
import XpertMissionRow from './row/mission/XpertMissionRow';
import { areObjectsEqual, cn } from '@/lib/utils';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { useXpertStore } from '@/store/xpert';
import Loader from '@/components/Loader';
import XpertFilter from './XpertFilter';
import type { NestedTableKey } from './row/XpertRowContent';
import XpertRowContent from './row/XpertRowContent';
import XpertMissionFilter from './row/mission/XpertMissionFilter';
import XpertRowContentBis from './row/XpertRowContentBis';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import DeleteXpertDialog from './DeleteXpertDialog';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import CreateFournisseurXpertDialog from '@/components/dialogs/CreateXpertDialog';
import RedirectButtons from './row/RedirectButtons';
import Button from '@/components/Button';
import { useWarnIfUnsavedChanges } from '@/hooks/useLeavePageConfirm';
import { XpertNotes } from './XpertNotes';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getNotes } from '@functions/xperts-notes';
import { toast } from 'sonner';

export type DocumentInfo = {
  publicUrl: string;
  created_at?: string;
};

export default function XpertTable() {
  const {
    xpertsOptimized,
    totalXpertOptimized,
    loading,
    xpertFilterKey,
    handleSaveUpdatedXpert,
    openedXpertNotSaved,
    fetchSpecificXpert,
    fetchXpertOptimizedFiltered,
    resetXperts,
    openedXpert,
    keyDBProfileChanged,
    keyDBProfileExpertiseChanged,
    keyDBProfileStatusChanged,
    keyDBProfileMissionChanged,
    setKeyDBProfileChanged,
    setKeyDBProfileExpertiseChanged,
    setKeyDBProfileStatusChanged,
    setKeyDBProfileMissionChanged,
    setOpenedXpertNotSaved,
    setOpenedXpert,
    activeFilters,
    setActiveFilters,
  } = useXpertStore();

  useWarnIfUnsavedChanges(!areObjectsEqual(openedXpert, openedXpertNotSaved));

  const [xpertIdOpened, setXpertIdOpened] = useState('');
  const [xpertIdOpenedNotes, setXpertIdOpenedNotes] = useState('');
  const [cvInfo, setCvInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [urssafInfo, setUrssafInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [hasChanged, setHasChanged] = useState(false);
  const [kbisInfo, setKbisInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [responsabiliteCivileInfo, setResponsabiliteCivileInfo] =
    useState<DocumentInfo>({ publicUrl: '' });
  const [ribInfo, setRibInfo] = useState<DocumentInfo>({ publicUrl: '' });
  const [habilitationInfo, setHabilitationInfo] = useState<DocumentInfo>({
    publicUrl: '',
  });
  const [openTooltip, setOpenTooltip] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const xpertIdParams = searchParams.get('id');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<DBXpertNote[]>([]);
  const hasMore =
    xpertsOptimized && totalXpertOptimized
      ? xpertsOptimized.length < totalXpertOptimized
      : totalXpertOptimized === 0
        ? false
        : true;

  const handleXpertIdOpened = useCallback((xpert: DBXpertOptimized) => {
    setOpenedXpertNotSaved(null);
    setOpenedXpert('');

    setXpertIdOpened((prevId) => {
      setCvInfo({ publicUrl: '' });
      setUrssafInfo({ publicUrl: '' });
      setKbisInfo({ publicUrl: '' });

      fetchNotes(xpert.id);
      return prevId === xpert.generated_id.toString()
        ? '0'
        : xpert.generated_id.toString();
    });
    fetchXpertDocumentsUrl(xpert);
  }, []);

  const fetchNotes = async (xpertId: string) => {
    const { data, error } = await getNotes(xpertId);
    if (error) {
      toast.error('Erreur lors du chargement des notes');
      return;
    }
    if (data) {
      setNotes(data);
    }
  };

  const handleKeyChanges = (
    table: NestedTableKey | undefined,
    name: string
  ) => {
    if (table === 'profile_expertise') {
      const prevKeys = keyDBProfileExpertiseChanged as string[];
      const newKeys = prevKeys.includes(name) ? prevKeys : [...prevKeys, name];
      setKeyDBProfileExpertiseChanged(newKeys as any);
    } else if (table === 'profile_status') {
      const prevKeys = keyDBProfileStatusChanged as string[];
      const newKeys = prevKeys.includes(name) ? prevKeys : [...prevKeys, name];
      setKeyDBProfileStatusChanged(newKeys as any);
    } else if (table === 'profile_mission') {
      const prevKeys = keyDBProfileMissionChanged as string[];
      const newKeys = prevKeys.includes(name) ? prevKeys : [...prevKeys, name];
      setKeyDBProfileMissionChanged(newKeys as any);
    } else {
      const prevKeys = keyDBProfileChanged as string[];
      const newKeys = prevKeys.includes(name) ? prevKeys : [...prevKeys, name];
      setKeyDBProfileChanged(newKeys as any);
    }
  };

  const fetchXpertDocumentsUrl = async (xpert: DBXpertOptimized) => {
    setIsLoading(true);
    const supabase = createSupabaseFrontendClient();

    const { data: cvData } = await supabase.storage
      .from('profile_files')
      .list(`${xpert.generated_id}/cv/`);

    const { data: urssafData } = await supabase.storage
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
      const sortedCvData = cvData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecentCV = sortedCvData[0];
      const { data } = supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/cv/${mostRecentCV.name}`);
      setCvInfo({
        publicUrl: data.publicUrl,
        created_at: mostRecentCV.created_at,
      });
    }

    if (urssafData && urssafData.length > 0) {
      const sortedUrssafData = urssafData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecentUrssafFile = sortedUrssafData[0];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(
          `${xpert.generated_id}/urssaf/${mostRecentUrssafFile.name}`
        );
      setUrssafInfo({
        publicUrl: data.publicUrl,
        created_at: mostRecentUrssafFile.created_at,
      });
    }

    if (kbisData && kbisData.length > 0) {
      const sortedKbisData = kbisData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecentKbisFile = sortedKbisData[0];
      const { data } = supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/kbis/${mostRecentKbisFile.name}`);
      setKbisInfo({
        publicUrl: data.publicUrl,
        created_at: mostRecentKbisFile.created_at,
      });
    }

    if (responsabiliteCivileData && responsabiliteCivileData.length > 0) {
      const sortedResponsabiliteCivileData = responsabiliteCivileData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecentResponsabiliteCivileFile =
        sortedResponsabiliteCivileData[0];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(
          `${xpert.generated_id}/civil_responsability/${mostRecentResponsabiliteCivileFile.name}`
        );
      setResponsabiliteCivileInfo({
        publicUrl: data.publicUrl,
        created_at: mostRecentResponsabiliteCivileFile.created_at,
      });
    }

    if (ribData && ribData.length > 0) {
      const sortedRibData = ribData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecentRibFile = sortedRibData[0];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(`${xpert.generated_id}/rib/${mostRecentRibFile.name}`);
      setRibInfo({
        publicUrl: data.publicUrl,
        created_at: mostRecentRibFile.created_at,
      });
    }

    if (habilitationData && habilitationData.length > 0) {
      const sortedHabilitationData = habilitationData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecentHabilitationFile = sortedHabilitationData[0];
      const { data } = await supabase.storage
        .from('profile_files')
        .getPublicUrl(
          `${xpert.generated_id}/habilitations/${mostRecentHabilitationFile.name}`
        );
      setHabilitationInfo({
        publicUrl: data.publicUrl,
        created_at: mostRecentHabilitationFile.created_at,
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setHasChanged(!areObjectsEqual(openedXpert, openedXpertNotSaved));
  }, [openedXpertNotSaved, openedXpert]);

  const renderMissions = (xpert: DBXpert) => {
    const canShowMissions = Boolean(xpert.cv_name);
    const hasMissions = xpert.mission && xpert.mission.length > 0;

    const tooltipContent = (
      <TooltipContent className="whitespace-nowrap bg-white p-2">
        <p>Pour voir les missions, il faut :</p>
        <ul className="list-disc pl-4">
          <li>Un CV téléchargé</li>
        </ul>
      </TooltipContent>
    );

    const infoTooltip = (
      <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipTrigger onClick={() => setOpenTooltip(true)}>
          <Info className="size-4 text-primary" />
        </TooltipTrigger>
        {tooltipContent}
      </Tooltip>
    );

    if (!canShowMissions) {
      return (
        <div className="col-span-4 flex items-center justify-start gap-2">
          <p className="text-gray-secondary text-center text-sm">
            Les conditions ne sont pas remplies
          </p>
          {infoTooltip}
        </div>
      );
    }

    if (!hasMissions) {
      return (
        <div className="col-span-4 flex items-center justify-start gap-2">
          <p className="text-gray-secondary whitespace-nowrap text-center text-sm">
            Aucune mission
          </p>
        </div>
      );
    }

    return xpert.mission.map((mission) => (
      <XpertMissionRow key={mission.id} mission={mission} />
    ));
  };

  useEffect(() => {
    const xpertId = searchParams.get('id');
    xpertId && fetchSpecificXpert(xpertId);
  }, [searchParams]);

  return (
    <>
      {
        <div className="mb-4 w-fit">
          <CreateFournisseurXpertDialog role="xpert" />
        </div>
      }

      <div className="grid grid-cols-[repeat(14,_minmax(0,_1fr))] gap-3">
        <XpertFilter
          key={xpertFilterKey}
          xperts={xpertsOptimized || []}
          // onSortedDataChange={handleFilterChange}
        />
        <div className="col-[span_14_/_span_14] flex items-center gap-4">
          {!loading ? (
            <>
              <p className="whitespace-nowrap">
                {totalXpertOptimized} résultats
              </p>
              <button className="font-[600] text-primary" onClick={resetXperts}>
                Réinitialiser
              </button>
              {/* Affichage des filtres actifs
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.jobTitles && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Poste: {activeFilters.jobTitles}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters, jobTitles: '' };
                        setActiveFilters(newFilters);
                        fetchXpertOptimizedFiltered(true);
                      }}
                    />
                  </Badge>
                )}
                {activeFilters.availability && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Disponibilité: {activeFilters.availability}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => {
                        const newFilters = {
                          ...activeFilters,
                          availability: '',
                        };
                        setActiveFilters(newFilters);
                        fetchXpertOptimizedFiltered(true);
                      }}
                    />
                  </Badge>
                )}
                {activeFilters.countries.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Pays: {activeFilters.countries.join(', ')}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters, countries: [] };
                        setActiveFilters(newFilters);
                        fetchXpertOptimizedFiltered(true);
                      }}
                    />
                  </Badge>
                )}
              </div> */}
            </>
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
                  'col-span-7 hidden h-full max-h-0 w-full overflow-visible rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                {xpertIdOpened === xpert.generated_id && (
                  <XpertRowContent
                    xpertOptimized={xpert}
                    handleKeyChanges={handleKeyChanges}
                    enableEmailEdit={true}
                  />
                )}
              </div>
              <div
                className={cn(
                  'col-span-7 hidden h-full max-h-0 w-full overflow-hidden',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                <div className="grid grid-cols-5 gap-3 rounded-lg rounded-b-xs bg-[#D0DDE1] p-3 shadow-container">
                  <XpertMissionFilter />

                  {openedXpert && <>{renderMissions(openedXpert)}</>}
                </div>
                {xpertIdOpened === xpert.generated_id && (
                  <XpertRowContentBis
                    isLoading={isLoading}
                    cvInfo={cvInfo}
                    urssafInfo={urssafInfo}
                    kbisInfo={kbisInfo}
                    responsabiliteCivileInfo={responsabiliteCivileInfo}
                    ribInfo={ribInfo}
                    habilitationInfo={habilitationInfo}
                    handleKeyChanges={handleKeyChanges}
                  />
                )}
                {/* Notes section */}
                {xpertIdOpened === xpert.generated_id && (
                  <XpertNotes
                    xpertId={xpert.id}
                    xpertIdOpened={xpertIdOpened}
                    notes={notes}
                    setNotes={setNotes}
                  />
                )}
                {/* task and redirection button here */}
                <div className="flex w-full justify-between gap-2 py-2">
                  <RedirectButtons user={xpert} />
                  <div className="flex gap-x-4">
                    <Button
                      className="size-fit disabled:bg-gray-200"
                      onClick={handleSaveUpdatedXpert}
                      disabled={!hasChanged}
                    >
                      Enregistrer
                    </Button>
                    <DeleteXpertDialog
                      xpertId={xpert.id}
                      xpertGeneratedId={xpert.generated_id}
                      xpertEmail={xpert.email}
                      xpertFirstName={xpert.firstname}
                      xpertLastName={xpert.lastname}
                    />
                  </div>
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
