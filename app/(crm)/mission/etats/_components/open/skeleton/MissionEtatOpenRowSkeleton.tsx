import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function MissionEtatOpenRowSkeleton() {
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
      <Box className="col-span-1 bg-accent text-white">
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
      <Box className="col-span-1 bg-[#D64242] text-white">
        <Skeleton className="h-10 w-full" />
      </Box>
      <Box className="col-span-1">
        <Skeleton className="h-10 w-full" />
      </Box>
    </>
  );
}
