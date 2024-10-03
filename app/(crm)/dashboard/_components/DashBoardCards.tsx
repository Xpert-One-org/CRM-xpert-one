'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type DashBoardCardsProps = {
  count: number;
  title: string;
  urgentTitle: string;
  urgentCount: number;
  buttonTitle: string;
  iconButton: React.ReactNode;
  link: string;
};

export default function DashBoardCards(props: DashBoardCardsProps) {
  const {
    count,
    title,
    urgentTitle,
    urgentCount,
    buttonTitle,
    iconButton,
    link,
  } = props;

  return (
    <>
      <div className="py- flex w-full flex-col items-center justify-between gap-y-spaceSmall rounded border bg-[#D0DDE1] px-spaceContainer py-spaceSmall">
        <div className="flex w-full items-center justify-between gap-x-spaceSmall">
          <h2>
            {title} : {count}
          </h2>
          <h2 className="font-bold text-red-500">
            {urgentTitle} : {urgentCount}
          </h2>
        </div>
        <div className="flex w-full items-center justify-center">
          <Link href={link} className="flex w-full justify-center">
            <Button className="flex w-full gap-2 px-spaceContainer text-white">
              {buttonTitle}
              {iconButton}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
