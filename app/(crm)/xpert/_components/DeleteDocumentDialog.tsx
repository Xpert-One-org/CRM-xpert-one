'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import React from 'react';

type DeleteDocumentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentType: string;
};

export default function DeleteDocumentDialog({
  isOpen,
  onClose,
  onConfirm,
  documentType,
}: DeleteDocumentDialogProps) {
  return (
    <Credenza open={isOpen} onOpenChange={onClose}>
      <CredenzaContent className="font-fira mx-4 max-w-[500px] overflow-hidden rounded-sm border-0 bg-white p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Confirmer la suppression</h2>
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer ce document {documentType} ?
            Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <CredenzaClose asChild>
              <Button variant="outline">Annuler</Button>
            </CredenzaClose>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={onConfirm}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
