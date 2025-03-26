'use client';
import { Button } from '@/components/ui/button';
import { menuCrm } from '@/data/menu';
import { cn } from '@/lib/utils';
import useChat from '@/store/chat/chat';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavigationCommunaute() {
  const pathname = usePathname();
  const { chatSelected } = useChat();
  const el = menuCrm.find(
    (el) => el.url.split('/')[1] === pathname.split('/')[1]
  );

  const subPathname = `/communaute/${pathname.split('/')[2]}`;
  const isForumEntry = pathname.includes('/forum/');
  return (
    <div className="flex w-full justify-between">
      <div
        className={cn(
          'flex w-full flex-wrap gap-spaceXSmall whitespace-nowrap px-spaceContainer text-white lg:flex lg:px-0',
          { hidden: chatSelected }
        )}
      >
        <Button
          isLink
          href={el?.sub?.[0].url}
          className="w-full max-w-[200px] rounded-bl-full"
          variant={el?.sub?.[0].url === subPathname ? 'accent' : 'secondary'}
        >
          {el?.sub?.[0].title}
        </Button>
        <Button
          isLink
          href={el?.sub?.[1].url}
          className="w-full max-w-[200px]"
          variant={el?.sub?.[1].url === subPathname ? 'accent' : 'secondary'}
        >
          {el?.sub?.[1].title}
        </Button>
        <Button
          isLink
          href={el?.sub?.[2].url}
          className="w-full max-w-[200px] rounded-br-full"
          variant={el?.sub?.[2].url === subPathname ? 'accent' : 'secondary'}
        >
          {el?.sub?.[2].title}
        </Button>
      </div>
      {isForumEntry && (
        <Button isLink href={el?.sub?.[1].url} className="w-fit">
          Revenir au forum
        </Button>
      )}
    </div>
  );
}
