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
import SelectComponent from '@/components/SelectComponent';

const reasonDeleteTaskSelect = [
  { label: 'Tâche terminée', value: 'task_completed' },
  { label: 'Tâche obsolète', value: 'task_obsolete' },
  { label: 'Erreur de création', value: 'creation_error' },
  { label: 'Autre', value: 'other' },
];

type ReasonTaskDeletion =
  | 'task_completed'
  | 'task_obsolete'
  | 'creation_error'
  | 'other';

export default function DeleteTaskDialog({
  taskId,
  onDelete,
}: {
  taskId: number;
  onDelete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [reasonDelete, setReasonDelete] =
    useState<ReasonTaskDeletion>('task_completed');

  const handleSendDeleteTask = async () => {
    setIsLoading(true);
    try {
      const { error } = await deleteTask(taskId);
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
        className="size-full text-white hover:bg-[#D75D5D]/90"
      >
        <Trash className="size-4" />
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
          <div className="grid grid-cols-1 gap-x-spaceContainer gap-y-spaceSmall md:grid-cols-3">
            <SelectComponent
              className="xl:max-w-[300px]"
              label="Motif de suppression"
              placeholder="Choisissez un motif"
              name={reasonDelete}
              options={reasonDeleteTaskSelect}
              defaultSelectedKeys={reasonDelete}
              onValueChange={(value) =>
                setReasonDelete(value as ReasonTaskDeletion)
              }
              required
            />
          </div>

          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button variant={'outline'}>Annuler la suppression</Button>
            </CredenzaClose>

            <Button
              disabled={!reasonDelete || isLoading}
              onClick={handleSendDeleteTask}
              className="w-fit self-end px-spaceContainer"
              variant={'destructive'}
            >
              {isLoading ? 'Chargement...' : 'Supprimer la tâche'}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
