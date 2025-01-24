'use client';

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useChat from '@/store/chat/chat';
import useReferent from './referent-store';
import { getReceiverAndReferentProfile } from './chat-user-info-actions';
import type { DBProfile } from '@/types/typesDb';

type ReceiverInfo = {
  receiver: DBProfile | null;
  referent: DBProfile | null;
};

export default function ChatUserInfo() {
  const [profiles, setProfiles] = useState<ReceiverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatSelected = useChat((state) => state.chatSelected);
  const lastUpdate = useReferent((state) => state.lastUpdate);

  useEffect(() => {
    async function fetchProfiles() {
      if (chatSelected?.receiver_id) {
        setIsLoading(true);
        try {
          const profilesData = await getReceiverAndReferentProfile(
            chatSelected.receiver_id
          );
          setProfiles(profilesData);
        } catch (error) {
          console.error('Error fetching profiles:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchProfiles();
  }, [chatSelected?.receiver_id, lastUpdate]);

  if (isLoading) {
    return <div className="w-full p-4 text-center">Chargement...</div>;
  }

  if (!profiles?.receiver) {
    return null;
  }

  const formattedDate = new Date(
    profiles.receiver.created_at
  ).toLocaleDateString('fr-FR');

  return (
    <Card className="w-full bg-gray-50 shadow-md">
      <CardHeader className="space-y-4 px-6 pb-4 pt-6">
        <div className="flex flex-col items-center">
          <div className="relative size-24 md:size-28">
            <Avatar className="size-full border-2 border-black">
              <AvatarImage
                className="object-cover"
                src={profiles.receiver.avatar_url || ''}
                alt={`${profiles.receiver.firstname} ${profiles.receiver.lastname}`}
              />
              <AvatarFallback className="text-base">
                {profiles.receiver.firstname?.[0]}
                {profiles.receiver.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-4 text-center">
            <h2 className="flex items-center justify-center gap-2 text-base font-semibold">
              {profiles.receiver.firstname} {profiles.receiver.lastname}
            </h2>

            <p className="text-muted-foreground mt-1 text-xs md:text-sm">
              Inscrit depuis le {formattedDate}
            </p>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs md:text-sm">
              <span className="text-gray-600">
                N° Xpert One : {profiles.receiver.generated_id}
              </span>
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="text-muted-foreground h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Votre identifiant unique</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
          </div>
        </div>
      </CardHeader>

      {profiles.referent && (
        <CardContent className="border-t border-gray-100 px-6 pb-6 pt-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 md:text-base">
              Contact Xpert One
            </h3>
            {profiles.referent && (
              <div className="space-y-2 rounded-lg bg-gray-50 text-xs md:text-sm">
                <p className="font-medium text-gray-900">
                  {profiles.referent.firstname} {profiles.referent.lastname}
                </p>
                {profiles.referent.mobile && (
                  <p className="flex items-center text-gray-600">
                    Tél : {profiles.referent.mobile}
                  </p>
                )}
                {profiles.referent.email && (
                  <p className="break-all text-gray-600">
                    Email : {profiles.referent.email}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
