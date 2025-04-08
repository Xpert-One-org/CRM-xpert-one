'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import FakeInput from '@/components/inputs/FakeInput';
import { useXpertStore } from '@/store/xpert';
import { useAuth } from '@/hooks/useAuth';
import TextArea from '@/components/inputs/TextArea';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

export default function BanXpertDialog({
  xpertId,
  xpertGeneratedId,
  xpertEmail,
  xpertFirstName,
  xpertLastName,
  onBanSuccess,
}: {
  xpertId: string;
  xpertGeneratedId: string;
  xpertEmail: string | null;
  xpertFirstName: string | null;
  xpertLastName: string | null;
  onBanSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [reasonBan, setReasonBan] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const { banXpert } = useXpertStore();
  const { user } = useAuth();

  useEffect(() => {
    checkIfUserIsBanned();
  }, [xpertId]);

  useEffect(() => {
    const handleUnban = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.xpertId === xpertId) {
        setIsBanned(false);
      }
    };

    document.addEventListener('xpert-unbanned', handleUnban);

    return () => {
      document.removeEventListener('xpert-unbanned', handleUnban);
    };
  }, [xpertId]);

  const checkIfUserIsBanned = async () => {
    try {
      const supabase = createSupabaseFrontendClient();
      const { data, error } = await supabase
        .from('profile')
        .select('is_banned_from_community')
        .eq('id', xpertId)
        .single();

      if (error) {
        console.error(
          'Erreur lors de la vérification du statut de bannissement:',
          error
        );
        return;
      }

      setIsBanned(data?.is_banned_from_community || false);
    } catch (error) {
      console.error(
        'Erreur lors de la vérification du statut de bannissement:',
        error
      );
    }
  };

  const handleBanXpert = async () => {
    setIsLoading(true);
    try {
      await banXpert({
        xpertId,
        reason: reasonBan,
      });
      setPopupOpen(false);
      toast.success(`L'XPERT ${xpertGeneratedId} a été banni avec succès`);
      setIsBanned(true);
      if (onBanSuccess) {
        onBanSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors du bannissement de l'XPERT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      {user?.role === 'admin' && (
        <Button
          variant={'destructive'}
          onClick={() => setPopupOpen(true)}
          disabled={isBanned}
          title={isBanned ? 'Cet XPERT est déjà banni' : "Bannir l'XPERT"}
        >
          Bannir l'XPERT
        </Button>
      )}

      <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
        <div className="relative h-[175px] w-full">
          <Image
            src="/static/background.jpg"
            fill
            objectFit="cover"
            alt="confirm-popup"
          />
        </div>
        <div className="flex flex-col gap-y-spaceContainer p-6">
          <FakeInput
            label="Numéro de compte Xpert One"
            value={xpertGeneratedId}
          />

          <TextArea
            label="Motif de bannissement"
            placeholder="Veuillez indiquer le motif de bannissement"
            value={reasonBan}
            onChange={(e) => setReasonBan(e.target.value)}
            required
          />

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Annuler</Button>
            </CredenzaClose>

            <Button
              disabled={isLoading || !reasonBan.trim()}
              onClick={handleBanXpert}
              className="w-fit self-end px-spaceContainer"
              variant={'destructive'}
            >
              {isLoading ? 'Chargement...' : "BANNIR L'UTILISATEUR"}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
