'use client';
import { menuCrm } from '@/data/menu';
import { cn } from '@/lib/utils';
import { usePopupInformativeStore } from '@/store/usePopupInformative';
import { HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

type HasSeen = {
  has_seen_my_missions: boolean | null;
  has_seen_available_missions: boolean | null;
  has_seen_messaging: boolean | null;
  has_seen_community: boolean | null;
  has_seen_blog: boolean | null;
  has_seen_newsletter: boolean | null;
  has_seen_my_profile: boolean | null;
  has_seen_created_missions: boolean | null;
};

const pathnameToColumnMap: Record<string, keyof HasSeen> = {
  'mes-missions': 'has_seen_my_missions',
  'missions-disponibles': 'has_seen_available_missions',
  messagerie: 'has_seen_messaging',
  communaute: 'has_seen_community',
  blog: 'has_seen_blog',
  newsletter: 'has_seen_newsletter',
  'mon-profil': 'has_seen_my_profile',
  'creation-de-mission': 'has_seen_created_missions',
};

export default function ActualPageTitle({
  className,
  has_seen,
}: {
  className?: string;
  has_seen?: HasSeen | null;
}) {
  const menuEls = menuCrm;
  const pathname = usePathname().split('/')[1];
  const navbarText = menuEls.find(
    (el) => el.url.split('/')[1] === pathname
  )?.title;
  const setShowModal = usePopupInformativeStore((state) => state.setShowModal);

  useEffect(() => {
    const hasSeenKey = pathnameToColumnMap[pathname];

    if (hasSeenKey && has_seen && !has_seen[hasSeenKey]) {
      setShowModal(true);
    }
  }, [has_seen, pathname, setShowModal]);

  return (
    <div
      className={cn(
        'relative font-khand text-lg font-bold uppercase lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2',
        className
      )}
    >
      <div className="relative">
        {navbarText}
        <button
          className="absolute -right-4 -top-1 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <HelpCircle className="size-spaceSmall" />
        </button>
      </div>
    </div>
  );
}
