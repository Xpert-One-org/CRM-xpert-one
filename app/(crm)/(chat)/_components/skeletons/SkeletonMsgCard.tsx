import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonMsgCard() {
  return (
    <Skeleton className="flex w-full flex-col gap-y-spaceSmall rounded-[10px] p-spaceMediumContainer shadow-msg">
      <div className="flex items-center gap-x-spaceMediumContainer">
        <Skeleton
          className={cn('h-[50px] w-[50px] rounded-full bg-fond-gray')}
        />
        <div className="flex flex-col gap-y-[2px]">
          <Skeleton className={cn('h-[16px] w-[120px] bg-fond-gray')} />
          <Skeleton className={cn('h-[14px] w-[100px] bg-fond-gray')} />
        </div>
        <div className="flex flex-col gap-y-[2px]">
          <Skeleton className={cn('h-[14px] w-[80px] bg-fond-gray')} />
          <Skeleton className={cn('h-[14px] w-[60px] bg-fond-gray')} />
        </div>
      </div>
      <Skeleton className={cn('mt-spaceSmall h-[60px] w-full bg-fond-gray')} />
      <div className="mt-spaceSmall flex flex-wrap gap-x-spaceSmall gap-y-spaceXSmall">
        <Skeleton className={cn('h-[27px] w-[120px] bg-fond-gray')} />
        <Skeleton
          className={cn('h-[27px] w-[27px] rounded-full bg-fond-gray')}
        />
        <Skeleton
          className={cn('h-[27px] w-[27px] rounded-full bg-fond-gray')}
        />
        <Skeleton
          className={cn('h-[27px] w-[27px] rounded-full bg-fond-gray')}
        />
      </div>
    </Skeleton>
  );
}
