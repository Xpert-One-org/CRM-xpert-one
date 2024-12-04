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
import DeleteXpertDialog from './DeleteXpertDialog';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type DocumentInfo = {
  publicUrl: string;
  created_at?: string;
};

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

  const { fetchXperts, xperts, totalXperts, fetchSpecificXpert } =
    useXpertStore();
  const [filteredXperts, setFilteredXperts] = useState<DBXpert[]>([]);

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

  const hasMore = xperts && totalXperts ? xperts.length < totalXperts : true;

  const [activeFilters, setActiveFilters] = useState<{
    jobTitles: string[];
    availability: string;
    cv: string;
    countries: string[];
    sortDate: string;
    adminOpinion: string;
  }>({
    jobTitles: [],
    availability: '',
    cv: '',
    countries: [],
    sortDate: '',
    adminOpinion: '',
  });

  const [pendingOpinions, setPendingOpinions] = useState<
    Record<string, 'positive' | 'neutral' | 'negative' | '' | null>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleOpinionChange = (
    xpertId: string,
    opinion: 'positive' | 'neutral' | 'negative' | '' | null
  ) => {
    setPendingOpinions((prev) => ({
      ...prev,
      [xpertId]: opinion === '' ? null : opinion,
    }));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    const supabase = createSupabaseFrontendClient();
    try {
      for (const [xpertId, opinion] of Object.entries(pendingOpinions)) {
        const validOpinion = opinion === '' ? null : opinion;
        const { error } = await supabase
          .from('profile')
          .update({ admin_opinion: validOpinion })
          .eq('id', xpertId);

        if (error) throw error;
      }
      toast.success('Toutes les modifications ont été enregistrées');
      setHasChanges(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Error updating admin opinions:', error);
    }
  };

  const handleFilterChange = useCallback(
    (data: DBXpert[], filterType?: string, filterValues?: string[]) => {
      if (filterType === 'jobTitles') {
        setActiveFilters((prev) => ({
          ...prev,
          jobTitles: filterValues || [],
        }));
      } else if (filterType === 'availability') {
        setActiveFilters((prev) => ({
          ...prev,
          availability: filterValues?.[0] || '',
        }));
      } else if (filterType === 'cv') {
        setActiveFilters((prev) => ({
          ...prev,
          cv: filterValues?.[0] || '',
        }));
      } else if (filterType === 'country') {
        setActiveFilters((prev) => ({
          ...prev,
          countries: filterValues || [],
        }));
      } else if (filterType === 'sortDate') {
        setActiveFilters((prev) => ({
          ...prev,
          sortDate: filterValues?.[0] || '',
        }));
      } else if (filterType === 'adminOpinion') {
        setActiveFilters((prev) => ({
          ...prev,
          adminOpinion: filterValues?.[0] || '',
        }));
      }
      setFilteredXperts(data);
    },
    []
  );

  const handleXpertIdOpened = useCallback((xpert: DBXpert) => {
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

  const fetchXpertDocumentsUrl = async (xpert: DBXpert) => {
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
      const { data } = await supabase.storage
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
      const { data } = await supabase.storage
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
          `${xpert.generated_id}/habilitation/${lastHabilitationFile.name}`
        );
      setHabilitationInfo({
        publicUrl: data.publicUrl,
        created_at: lastHabilitationFile.created_at,
      });
    }

    setIsLoading(false);
  };

  const renderMissions = (xpert: DBXpert) => {
    const isProfileComplete = xpert.totale_progression >= 80;
    const hasCV = Boolean(xpert.cv_name);
    const canShowMissions = isProfileComplete && hasCV;

    return (
      <>
        {canShowMissions ? (
          <>
            {xpert.mission.length > 0 ? (
              xpert.mission.map((mission) => (
                <XpertMissionRow key={mission.id} mission={mission} />
              ))
            ) : (
              <div className="col-span-4 ml-5 flex items-center justify-center gap-2">
                <p className="text-gray-secondary whitespace-nowrap text-center text-sm">
                  Aucune mission
                </p>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] bg-white p-2">
                    <p>Pour voir les missions, il faut :</p>
                    <ul className="list-disc pl-4">
                      <li>Un profil complété à 80% minimum</li>
                      <li>Un CV téléchargé</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-4 flex items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] bg-white p-2">
                <p>Pour voir les missions, il faut :</p>
                <ul className="list-disc pl-4">
                  <li>Un profil complété à 80% minimum</li>
                  <li>Un CV téléchargé</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </>
    );
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
    } else {
      setXpertIdOpened('');
    }
  }, [
    fetchSpecificXpert,
    fetchXperts,
    handleXpertIdOpened,
    searchParams,
    xperts,
  ]);

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

  useEffect(() => {
    if (xperts) {
      let filtered = [...xperts];

      if (activeFilters.jobTitles.length > 0) {
        filtered = filtered.filter((xpert) => {
          return activeFilters.jobTitles.some((value) =>
            xpert.profile_mission?.job_titles?.some((title) => title === value)
          );
        });
      }

      if (activeFilters.availability) {
        filtered = filtered.filter((xpert) => {
          if (activeFilters.availability === 'unavailable') {
            return (
              xpert.profile_mission?.availability === undefined ||
              new Date(xpert.profile_mission.availability ?? '') > new Date()
            );
          } else if (activeFilters.availability === 'in_mission') {
            return xpert.mission
              .map((mission) => mission.xpert_associated_id)
              .some((xpertId) => xpertId === xpert.id);
          } else if (activeFilters.availability === 'available') {
            const isAvailable =
              xpert.profile_mission?.availability !== undefined &&
              new Date(xpert.profile_mission.availability ?? '') <= new Date();
            const isNotInMission = !xpert.mission
              .map((mission) => mission.xpert_associated_id)
              .some((xpertId) => xpertId === xpert.id);
            return isAvailable && isNotInMission;
          }
          return true;
        });
      }

      if (activeFilters.cv) {
        filtered = filtered.filter((xpert) => {
          if (activeFilters.cv === 'yes') {
            return !!xpert.cv_name;
          } else if (activeFilters.cv === 'no') {
            return !xpert.cv_name;
          }
          return true;
        });
      }

      if (activeFilters.countries.length > 0) {
        filtered = filtered.filter((xpert) =>
          activeFilters.countries.includes(xpert.country || '')
        );
      }

      if (activeFilters.sortDate) {
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return activeFilters.sortDate === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
      }

      if (activeFilters.adminOpinion) {
        filtered = filtered.filter(
          (xpert) => xpert.admin_opinion === activeFilters.adminOpinion
        );
      }

      setFilteredXperts(filtered);
    }
  }, [xperts, activeFilters]);

  return (
    <>
      <div className="grid grid-cols-11 gap-3">
        <XpertFilter
          xperts={xperts || []}
          onSortedDataChange={handleFilterChange}
          activeFilters={activeFilters}
        />
        {filteredXperts.map((xpert) => {
          return (
            <React.Fragment key={xpert.id}>
              <XpertRow
                xpert={xpert}
                isOpen={xpertIdOpened === xpert.generated_id.toString()}
                onClick={() => handleXpertIdOpened(xpert)}
                onOpinionChange={handleOpinionChange}
              />
              <div
                className={cn(
                  'col-span-5 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                <XpertRowContent xpert={xpert} />
              </div>
              <div
                className={cn(
                  'col-span-5 hidden h-full max-h-0 w-full overflow-hidden',
                  { 'block max-h-full': xpertIdOpened === xpert.generated_id }
                )}
              >
                <div className="grid grid-cols-5 gap-3 rounded-lg rounded-b-xs bg-[#D0DDE1] p-3 shadow-container">
                  <XpertMissionFilter />
                  <div className="flex flex-col">{renderMissions(xpert)}</div>
                </div>
                <XpertRowContentBis
                  xpert={xpert}
                  isLoading={isLoading}
                  cvInfo={cvInfo}
                  ursaffInfo={ursaffInfo}
                  kbisInfo={kbisInfo}
                  responsabiliteCivileInfo={responsabiliteCivileInfo}
                  ribInfo={ribInfo}
                  habilitationInfo={habilitationInfo}
                />
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
      <InfiniteScroll hasMore={hasMore} next={fetchXperts} isLoading={false}>
        {hasMore && (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
      </InfiniteScroll>
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleSaveAll}
            className="flex items-center gap-2 bg-primary px-4 py-2 text-white shadow-lg hover:brightness-110"
          >
            <Save className="size-4" />
            Enregistrer toutes les modifications
          </Button>
        </div>
      )}
    </>
  );
}
