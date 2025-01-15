'use client';

import { Box } from '@/components/ui/box';
import { empty } from '@/data/constant';
import { posts } from '@/data/mocked_select';
import type {
  DBReferentType,
  DBXpertLastPost,
  DBXpertOptimized,
} from '@/types/typesDb';
import { getLabel } from '@/utils/getLabel';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import { useRouter } from 'next/navigation';
import { useXpertStore } from '@/store/xpert';
import { cn } from '@/lib/utils';

type XpertGestionCollaborateursRowProps = {
  xpert?: DBXpertOptimized;
  job?: DBXpertLastPost;
  isGroupSelection: boolean;
  onReferentChange: ({
    referent,
    xpertId,
    jobName,
    referentInfo,
  }: {
    referent: DBReferentType | null;
    xpertId?: string;
    jobName?: string;
    referentInfo?: { firstname: string; lastname: string };
  }) => void;
};

export default function XpertGestionCollaborateursRow({
  xpert,
  isGroupSelection,
  onReferentChange,
  job,
}: XpertGestionCollaborateursRowProps) {
  const { collaborators } = useAdminCollaborators();
  const router = useRouter();

  const { hasReferentReassign, setHasReferentReassign } = useXpertStore();
  const [currentReferentValue, setCurrentReferentValue] = useState('none');

  const lastPosition = xpert?.profile_experience?.post
    ? (getLabel({
        value: xpert.profile_experience.post.includes('other')
          ? (xpert.profile_experience.post_other ?? '')
          : xpert.profile_experience.post,
        select: posts,
      }) ?? empty)
    : empty;

  const handleReferentChange = (value: string) => {
    if (value === 'none') {
      if (!isGroupSelection && xpert) {
        onReferentChange({ xpertId: xpert.id, referent: null });
      } else if (job) {
        onReferentChange({ referent: null, jobName: job.post ?? undefined });
      }
      setCurrentReferentValue('none');
    } else {
      const selectedCollaborator = collaborators.find((c) => c.id === value);
      if (selectedCollaborator) {
        const referent = {
          id: selectedCollaborator.id,
          firstname: selectedCollaborator.firstname,
          lastname: selectedCollaborator.lastname,
        };

        if (!isGroupSelection && xpert) {
          onReferentChange({
            xpertId: xpert.id,
            referent: referent,
          });
        } else if (job) {
          onReferentChange({
            referent: referent,
            jobName: job.post ?? undefined,
          });
        }
        setCurrentReferentValue(value);
        if (!hasReferentReassign) {
          setHasReferentReassign(true);
        }
      }
    }
  };

  useEffect(() => {
    const DEFAULT_VALUE = 'none';

    if (!hasReferentReassign && currentReferentValue !== DEFAULT_VALUE) {
      setCurrentReferentValue(DEFAULT_VALUE);
    }
  }, [hasReferentReassign, currentReferentValue]);

  const handleRedirectXpert = (xpertId?: string) => {
    if (!xpertId) return;
    router.push(`/xpert?id=${xpertId}`);
  };

  return (
    <div
      className={`grid ${isGroupSelection ? 'grid-cols-6' : 'grid-cols-6'} gap-3`}
    >
      {isGroupSelection && (
        <Box className="col-span-2 flex h-12 items-center bg-[#F5F5F5] px-4">
          {job?.referents
            ?.map((r) => `${r.firstname} ${r.lastname}`)
            .join(', ')}
        </Box>
      )}
      {!isGroupSelection && (
        <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
          {collaborators.find((c) => c.id === xpert?.affected_referent_id)
            ?.firstname ?? ''}
        </Box>
      )}
      {!isGroupSelection && (
        <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
          {collaborators.find((c) => c.id === xpert?.affected_referent_id)
            ?.lastname ?? ''}
        </Box>
      )}
      {!isGroupSelection && (
        <Box
          className="flex h-12 cursor-pointer items-center bg-primary px-4 text-white"
          onClick={() => handleRedirectXpert(xpert?.generated_id)}
        >
          {xpert?.generated_id}
        </Box>
      )}
      <Box
        className={cn('flex h-12 items-center bg-[#F5F5F5] px-4', {
          'col-span-2': isGroupSelection,
        })}
      >
        {isGroupSelection
          ? getLabel({ select: posts, value: job?.post ?? '' })
          : lastPosition}
      </Box>
      <Box className={cn('col-span-2 p-0', { '': isGroupSelection })}>
        <Select
          value={currentReferentValue}
          onValueChange={handleReferentChange}
        >
          <SelectTrigger className="h-full justify-center gap-2 border-0 bg-[#F5F5F5]">
            <SelectValue placeholder="Non réaffecté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Non réaffecté</SelectItem>
            {collaborators
              .filter((c) => c.role === 'admin' || c.role === 'project_manager')
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.firstname} {c.lastname}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </Box>
    </div>
  );
}
