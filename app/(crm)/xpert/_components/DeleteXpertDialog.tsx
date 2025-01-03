'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';

import FakeInput from '@/components/inputs/FakeInput';
import { useXpertStore } from '@/store/xpert';
import { useAuth } from '@/hooks/useAuth';

export default function DeleteXpertDialog({
  xpertId,
  xpertGeneratedId,
}: {
  xpertId: string;
  xpertGeneratedId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const { deleteXpert } = useXpertStore();
  const { user } = useAuth();

  const handleSendDeleteXpert = async () => {
    setIsLoading(true);
    try {
      deleteXpert(xpertId, xpertGeneratedId);
      setPopupOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      {/* TODO: add later logic for delete reason xpert with notification */}
      {/* for the moment, i disable the button for restrictions access role */}
      {user?.role === 'admin' ||
        (user?.role === 'project_manager' && (
          <Button variant={'destructive'} onClick={() => setPopupOpen(true)}>
            Supprimer l’XPERT
          </Button>
        ))}

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

          {/* <TextArea
            label="Motif de suppression"
            placeholder="Choississez un motif"
            name={reasonDelete}
            onChange={(e) => setReasonDelete(e.target.value)}
            required
          /> */}

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Précedent</Button>
            </CredenzaClose>

            <Button
              disabled={isLoading}
              onClick={handleSendDeleteXpert}
              className="w-fit self-end px-spaceContainer"
              variant={'destructive'}
            >
              {isLoading ? 'Chargement...' : 'SUPPRIMER LE COMPTE'}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
