'use client';

import React, { useState } from 'react';
import TabContent from '../../_components/TabContent';
import ChatContent from '../../_components/ChatContent';
import ContactRequestsPanel from './ContactRequestsPanel';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { DESKTOP } from '@/data/constant';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReadOnlyChatContent from '../../_components/ReadOnlyChatContent';

export default function XpertToXpertPage() {
  const isDesktop = useMediaQuery(DESKTOP);
  const [showRequests, setShowRequests] = useState(false);

  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern', 'hr']}>
      <section className="flex h-full flex-col gap-spaceXSmall lg:max-h-[calc(100vh_-_170px)]">
        <div className="flex w-full items-center justify-between px-spaceContainer lg:px-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Relations XPERT / XPERT</h1>
            <div className="flex items-center text-sm text-gray-500">
              <Info size={16} className="mr-1" />
              <span>Consultez les échanges entre experts</span>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <Button
              variant={showRequests ? 'default' : 'outline'}
              onClick={() => setShowRequests(!showRequests)}
              className={cn(
                'transition-all',
                showRequests && 'bg-primary text-white'
              )}
            >
              {showRequests
                ? 'Retour aux conversations'
                : 'Demandes de contact'}
            </Button>
          </div>
        </div>

        {/* Container */}
        <section className="mt-spaceSmall flex w-full grow">
          {showRequests ? (
            <ContactRequestsPanel />
          ) : (
            <>
              {/* Tabs */}
              <TabContent type={'xpert_to_xpert'} />

              {/* Content */}
              <ReadOnlyChatContent type={'xpert_to_xpert'} readOnly={true} />
            </>
          )}
        </section>
      </section>
    </ProtectedRoleRoutes>
  );
}
