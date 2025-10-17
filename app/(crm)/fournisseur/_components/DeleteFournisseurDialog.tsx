'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { toast } from 'sonner';
import FakeInput from '@/components/inputs/FakeInput';
import { useFournisseurStore } from '@/store/fournisseur';
import TextArea from '@/components/inputs/TextArea';
import { AuthContext } from '@/components/auth/AuthProvider';

export default function DeleteFournisseurDialog({
  fournisseurId,
  fournisseurGeneratedId,
  fournisseurEmail,
  fournisseurFirstName,
  fournisseurLastName,
}: {
  fournisseurId: string;
  fournisseurGeneratedId: string;
  fournisseurEmail: string | null;
  fournisseurFirstName: string | null;
  fournisseurLastName: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [reasonDelete, setReasonDelete] = useState('');
  const { deleteFournisseur } = useFournisseurStore();
  const { user } = useContext(AuthContext);

  const handleSendDeleteFournisseur = async () => {
    setIsLoading(true);
    try {
      deleteFournisseur({
        fournisseurId,
        fournisseurGeneratedId,
        reason: reasonDelete,
        fournisseurEmail,
        fournisseurFirstName,
        fournisseurLastName,
      });
      setPopupOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      {user?.role === 'admin' && (
        <Button variant={'destructive'} onClick={() => setPopupOpen(true)}>
          Supprimer le fournisseur
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
            label="Numéro de compte fournisseur"
            value={fournisseurGeneratedId}
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
              onClick={handleSendDeleteFournisseur}
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
