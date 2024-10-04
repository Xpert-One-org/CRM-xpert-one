'use client';
import { menuCrm } from '@/data/menu';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function ActualPageTitle() {
  const menuEls = menuCrm;
  const pathnameSegments = usePathname().split('/').filter(Boolean);
  const lastSegment = pathnameSegments[pathnameSegments.length - 1];

  const findMenuTitle = (segments: string[]) => {
    const parent = menuEls.find((el) => el.url === `/${segments[0]}`);

    if (parent) {
      if (segments.length > 1 && parent.sub) {
        const subItem = parent.sub.find(
          (subEl) => subEl.url === `/${segments.join('/')}`
        );
        return subItem ? subItem.title : parent.title;
      }
      return parent.title;
    }

    return null;
  };

  const navbarText = findMenuTitle(pathnameSegments) || lastSegment;

  return (
    <div
      className={cn(
        'relative font-khand text-lg font-bold uppercase lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2'
      )}
    >
      <div className="relative">{navbarText}</div>
    </div>
  );
}
