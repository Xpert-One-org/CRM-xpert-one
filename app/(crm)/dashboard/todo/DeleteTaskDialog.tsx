'use client';

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { deleteTask } from '../../../../functions/tasks';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeleteTaskDialog({
  taskIds,
  onDelete,
  text,
  className,
}: {
  taskIds: number[];
  onDelete: () => void;
  text?: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleSendDeleteTask = async () => {
    setIsLoading(true);
    try {
      const { error } = await deleteTask(taskIds);
      if (error) {
        console.error(error);
        toast.error('Erreur lors de la suppression de la tâche');
        return;
      }
      toast.success('Tâche supprimée avec succès');
      onDelete();
      setPopupOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression de la tâche');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setPopupOpen(true)}
        className={cn('w-full text-white hover:bg-[#D75D5D]/90', className)}
      >
        {text ? text : <Trash className="size-5" />}
      </Button>

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
          <p className="text-center text-lg font-semibold">
            {taskIds.length > 1
              ? 'Êtes-vous sûr de vouloir supprimer ces tâches ? Cette action est irréversible.'
              : 'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.'}
          </p>

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Annuler la suppression</Button>
            </CredenzaClose>

            <Button
              onClick={handleSendDeleteTask}
              className="w-fit self-end px-spaceContainer"
              variant={'destructive'}
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : 'Confirmer la suppression'}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
