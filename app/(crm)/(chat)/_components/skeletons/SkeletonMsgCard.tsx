import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonMsgCard() {
  return (
    <Skeleton className="flex w-full flex-col gap-y-spaceSmall rounded-[10px] p-spaceMediumContainer shadow-msg">
      <div className="flex items-center gap-x-spaceMediumContainer">
        <Skeleton
          className={cn('bg-colors-fond-gray h-[50px] w-[50px] rounded-full')}
        />
        <div className="flex flex-col gap-y-[2px]">
          <Skeleton className={cn('bg-colors-fond-gray h-[16px] w-[120px]')} />
          <Skeleton className={cn('bg-colors-fond-gray h-[14px] w-[100px]')} />
        </div>
        <div className="flex flex-col gap-y-[2px]">
          <Skeleton className={cn('bg-colors-fond-gray h-[14px] w-[80px]')} />
          <Skeleton className={cn('bg-colors-fond-gray h-[14px] w-[60px]')} />
        </div>
      </div>
      <Skeleton
        className={cn('bg-colors-fond-gray mt-spaceSmall h-[60px] w-full')}
      />
      <div className="mt-spaceSmall flex flex-wrap gap-x-spaceSmall gap-y-spaceXSmall">
        <Skeleton className={cn('bg-colors-fond-gray h-[27px] w-[120px]')} />
        <Skeleton
          className={cn('bg-colors-fond-gray h-[27px] w-[27px] rounded-full')}
        />
        <Skeleton
          className={cn('bg-colors-fond-gray h-[27px] w-[27px] rounded-full')}
        />
        <Skeleton
          className={cn('bg-colors-fond-gray h-[27px] w-[27px] rounded-full')}
        />
      </div>
    </Skeleton>
  );
}
