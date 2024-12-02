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
import CreateFournisseurXpertDialog from '@/components/dialogs/CreateXpertDialog';

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

  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const hasMore = xperts && totalXperts ? xperts.length < totalXperts : true;

  const [activeFilters, setActiveFilters] = useState<{
    jobTitles: string[];
    availability: string;
    cv: string;
    countries: string[];
    sortDate: string;
  }>({
    jobTitles: [],
    availability: '',
    cv: '',
    countries: [],
    sortDate: '',
  });

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

      setFilteredXperts(filtered);
    }
  }, [xperts, activeFilters]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <CreateFournisseurXpertDialog role="xpert" />
        </div>
        {/* {xpertIdOpened !== '0' && (
              <Button className="px-spaceContainer py-spaceXSmall text-white">
                Enregistrer
              </Button>
            )} */}
      </div>

      <div className="grid grid-cols-10 gap-3">
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
                  cvInfo={cvInfo}
                  ursaffInfo={ursaffInfo}
                  kbisInfo={kbisInfo}
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
    </>
  );
}
