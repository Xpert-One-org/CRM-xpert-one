'use client';

import { Box } from '@/components/ui/box';
import { empty } from '@/data/constant';
import { jobTitleSelect } from '@/data/mocked_select';
import type { DBXpertOptimized } from '@/types/typesDb';
import { getLabel } from '@/utils/getLabel';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminCollaborators } from '@/store/adminCollaborators';

type XpertGestionCollaborateursRowProps = {
  xpert: DBXpertOptimized;
  isGroupSelection: boolean;
  onReferentChange: (id: string, referentId: string | null) => void;
  pendingReferentId?: string | null;
};

export default function XpertGestionCollaborateursRow({
  xpert,
  isGroupSelection,
  onReferentChange,
  pendingReferentId,
}: XpertGestionCollaborateursRowProps) {
  const { collaborators } = useAdminCollaborators();

  const lastPosition = xpert.profile_mission?.job_titles
    ? (getLabel({
        value:
          xpert.profile_mission.job_titles[
            xpert.profile_mission.job_titles.length - 1
          ],
        select: jobTitleSelect,
      }) ?? empty)
    : empty;

  const handleReferentChange = (value: string) => {
    if (value === 'none') {
      onReferentChange(xpert.id, null);
    } else {
      onReferentChange(xpert.id, value);
    }
  };

  const getCurrentReferentValue = () => {
    const currentId = pendingReferentId ?? xpert.affected_referent_id;
    if (!currentId) return 'none';
    return currentId;
  };

  return (
    <div
      className={`grid ${isGroupSelection ? 'grid-cols-5' : 'grid-cols-6'} gap-3`}
    >
      <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
        {xpert.firstname}
      </Box>
      <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
        {xpert.lastname}
      </Box>
      {!isGroupSelection && (
        <Box className="flex h-12 items-center bg-primary px-4 text-white">
          {xpert.generated_id}
        </Box>
      )}
      <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
        {lastPosition}
      </Box>
      <Box className="col-span-2 p-0">
        <Select
          value={getCurrentReferentValue()}
          onValueChange={handleReferentChange}
        >
          <SelectTrigger className="h-full justify-center gap-2 border-0 bg-[#F5F5F5]">
            <SelectValue placeholder="Non assigné" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Non assigné</SelectItem>
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
