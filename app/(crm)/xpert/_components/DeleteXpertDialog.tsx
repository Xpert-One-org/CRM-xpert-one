'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

import FakeInput from '@/components/inputs/FakeInput';
import { useXpertStore } from '@/store/xpert';
import { useAuth } from '@/hooks/useAuth';
import TextArea from '@/components/inputs/TextArea';

export default function DeleteXpertDialog({
  xpertId,
  xpertGeneratedId,
}: {
  xpertId: string;
  xpertGeneratedId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [reasonDelete, setReasonDelete] = useState('');
  const { deleteXpert } = useXpertStore();
  const { user } = useAuth();

  const handleSendDeleteXpert = async () => {
    setIsLoading(true);
    try {
      deleteXpert(xpertId, xpertGeneratedId, reasonDelete);
      setPopupOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  console.log(user?.role);

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      {user?.role === 'admin' && (
        <Button variant={'destructive'} onClick={() => setPopupOpen(true)}>
          Supprimer l'XPERT
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
            label="Motif de suppression"
            placeholder="Veuillez indiquer le motif de suppression"
            value={reasonDelete}
            onChange={(e) => setReasonDelete(e.target.value)}
            required
          />

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Précédent</Button>
            </CredenzaClose>

            <Button
              disabled={isLoading || !reasonDelete.trim()}
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
