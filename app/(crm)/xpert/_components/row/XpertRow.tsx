import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { empty } from '@/data/constant';
import { cn } from '@/lib/utils';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import { uppercaseFirstLetter } from '@/utils/string';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const adminOpinionOptions: {
  label: string;
  value: 'positive' | 'neutral' | 'negative' | null;
  color: string;
}[] = [
  { label: 'Positif', value: 'positive', color: '#92C6B0' },
  { label: 'Neutre', value: 'neutral', color: '#F5B935' },
  { label: 'Négatif', value: 'negative', color: '#D64242' },
  { label: 'NON DÉFINI', value: null, color: '#E1E1E1' },
];

type AdminOpinion = 'positive' | 'neutral' | 'negative' | null;

export default function XpertRow({
  xpert,
  isOpen,
  onClick,
  onOpinionChange,
}: {
  xpert: DBXpert;
  isOpen: boolean;
  onClick: () => void;
  onOpinionChange: (xpertId: string, opinion: AdminOpinion) => void;
}) {
  const dateSignUp = formatDate(xpert.created_at);
  const { jobTitles, fetchJobTitles, countries, fetchCountries } = useSelect();
  const [pendingOpinion, setPendingOpinion] = useState<
    typeof xpert.admin_opinion
  >(xpert.admin_opinion);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchJobTitles();
    fetchCountries();
  }, [fetchJobTitles, fetchCountries]);

  const handleOpinionChange = (value: string | null) => {
    const opinion = value as AdminOpinion;
    setPendingOpinion(opinion);
    onOpinionChange(xpert.id, opinion);
  };

  const handleSave = async () => {
    const supabase = createSupabaseFrontendClient();
    const { error } = await supabase
      .from('profile')
      .update({ admin_opinion: pendingOpinion })
      .eq('id', xpert.id);

    if (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Error updating admin opinion:', error);
    } else {
      toast.success('Modifications enregistrées');
      setHasChanges(false);
    }
  };

  const postTypes = xpert.profile_mission
    ? xpert.profile_mission.job_titles?.map((job, i, arr) => {
        const badge = (
          <div key={`${xpert.generated_id}-${i}`}>
            <Badge
              className="m-1 max-w-[95%] font-normal"
              key={`${xpert.generated_id}-${i}`}
            >
              {getLabel({ value: job, select: jobTitles }) ?? empty}
            </Badge>
            {i < arr.length - 1 && <span className="text-gray-400">|</span>}
          </div>
        );
        return badge;
      })
    : empty;

  const availableDate = xpert.profile_mission
    ? formatDate(xpert.profile_mission.availability ?? '')
    : empty;

  const availabilityStatus = (() => {
    if (xpert.profile_mission?.availability === undefined) {
      return 'bg-[#D64242]';
    } else if (
      new Date(xpert.profile_mission.availability ?? '') > new Date()
    ) {
      return 'bg-[#D64242]';
    } else if (
      xpert.mission
        .map((mission) => mission.xpert_associated_id)
        .some((xpertId) => xpertId === xpert.id)
    ) {
      return 'bg-accent';
    } else {
      return 'bg-[#92C6B0]';
    }
  })();

  const adminOpinionStyle = (() => {
    switch (pendingOpinion) {
      case 'positive':
        return 'bg-[#92C6B0]';
      case 'neutral':
        return 'bg-[#F5B935]';
      case 'negative':
        return 'bg-[#D64242]';
      default:
        return 'bg-light-gray-third';
    }
  })();

  return (
    <>
      <Box className="col-span-1" isSelected={isOpen}>
        {dateSignUp}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {xpert.lastname?.toUpperCase()}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {uppercaseFirstLetter(xpert.firstname ?? '')}
      </Box>
      <Box className="col-span-2 flex flex-col p-2" isSelected={isOpen}>
        <div
          className={cn('flex size-full flex-row flex-wrap items-center', {
            'border bg-white': postTypes?.length,
          })}
        >
          {postTypes}
        </div>
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {countries.find((c) => c.value === xpert.country)?.flag && (
          <Image
            src={countries.find((c) => c.value === xpert.country)?.flag ?? ''}
            alt={`${countries.find((c) => c.value === xpert.country)?.label}-flag`}
            width={24}
            height={16}
          />
        )}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {xpert.generated_id}
      </Box>
      <Box className={`col-span-1 ${availabilityStatus} text-white`}>
        {availableDate}
      </Box>
      <Box
        className={`col-span-1 ${
          xpert.cv_name ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        } text-white`}
      >
        {xpert.cv_name ? 'OUI' : 'NON'}
      </Box>
      <Box
        className={cn('col-span-1', {
          'bg-light-gray-third': pendingOpinion === null,
          'bg-[#E1E1E1]': pendingOpinion !== null,
        })}
        isSelectable
        options={adminOpinionOptions}
        onValueChange={handleOpinionChange}
      >
        <div
          className="size-4 rounded-full transition-all hover:ring-2 hover:ring-offset-2"
          style={{
            backgroundColor: adminOpinionOptions.find(
              (opt) => opt.value === pendingOpinion
            )?.color,
          }}
          title={
            adminOpinionOptions.find((opt) => opt.value === pendingOpinion)
              ?.label
          }
        />
      </Box>
      <Button className="col-span-1 h-full gap-1 text-white" onClick={onClick}>
        {isOpen ? 'Fermer la fiche' : 'Ouvrir la fiche'}
      </Button>

      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary px-4 py-2 text-white shadow-lg hover:brightness-110"
          >
            <Save className="size-4" />
            Enregistrer les modifications
          </Button>
        </div>
      )}
    </>
  );
}
