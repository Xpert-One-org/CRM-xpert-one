import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import SkeletonMsgCard from './SkeletonMsgCard';

export default function SkeletonChat({
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div className="flex flex-col items-center pt-spaceContainer">
      <Skeleton
        className={cn('mx-[30px] hidden h-[16px] w-[100px] md:flex', className)}
      />
      <div
        className="mt-[13px] flex w-full flex-col gap-y-spaceContainer overflow-auto px-[30px]"
        style={{
          maxHeight: 'calc(100vh - 500px)',
        }}
      >
        <SkeletonMsgCard />
        <SkeletonMsgCard />
        <SkeletonMsgCard />
      </div>
    </div>
  );
}
