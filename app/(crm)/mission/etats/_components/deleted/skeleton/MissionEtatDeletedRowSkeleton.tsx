import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function MissionEtatDeletedRowSkeleton() {
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
      <Box className="col-span-2 text-white" primary>
        <Skeleton className="h-10 w-full" />
      </Box>
    </>
  );
}
