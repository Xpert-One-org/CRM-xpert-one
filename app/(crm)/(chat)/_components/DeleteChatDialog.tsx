// components/dialogs/DeleteChatDialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useChat from '@/store/chat/chat';
import { Loader } from 'lucide-react';
import { useState } from 'react';

type DeleteChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  chatTitle: string;
};

export default function DeleteChatDialog({
  isOpen,
  onClose,
  chatId,
  chatTitle,
}: DeleteChatDialogProps) {
  const { deleteChat } = useChat();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteChat(chatId);
    setIsDeleting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la conversation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer définitivement cette conversation
            : "{chatTitle}" ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full items-center justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
