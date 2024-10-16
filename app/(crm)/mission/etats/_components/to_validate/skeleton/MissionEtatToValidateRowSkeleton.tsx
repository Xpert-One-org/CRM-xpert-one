import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Box } from '@/components/ui/box';

export default function MissionEtatToValidateRowSkeleton() {
  return (
    <>
      <Box className="col-span-1">
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1 text-white" primary>
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1 text-white" primary>
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1">
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1">
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1">
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1">
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1 bg-[#D64242] text-white" isSelectable>
        <Skeleton className="h-10 w-full" />
      </Box>
    </>
  );
}
