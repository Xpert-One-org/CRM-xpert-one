import React, { useState, useEffect } from 'react';
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
  CredenzaDescription,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { getTaskHistory } from '../../../../functions/tasks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RotateCcw } from 'lucide-react';
import Loader from '@/components/Loader';
import type { Task, TaskHistoryAction, TaskStatus } from '@/types/types';
import Image from 'next/image';

type TaskHistoryEntry = {
  id: number;
  action: TaskHistoryAction;
  changed_at: string;
  old_values: Task;
  new_values: Task;
  changed_by_profile: {
    firstname: string | null;
    lastname: string | null;
  };
  old_assigned?: {
    firstname: string | null;
    lastname: string | null;
  } | null;
  new_assigned?: {
    firstname: string | null;
    lastname: string | null;
  } | null;
};
type Props = {
  taskId: number;
};

export default function DialogTaskHistory({ taskId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getTaskHistory(taskId);
      if (error) throw error;
      if (data) setHistory(data);
    } catch (err) {
      console.error('Error loading task history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, taskId]);

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'urgent':
        return 'Urgent';
      case 'pending':
        return 'À traiter';
      case 'done':
        return 'Traité';
      default:
        return status;
    }
  };

  const getChangeDescription = (entry: TaskHistoryEntry) => {
    const changes: string[] = [];

    if (entry.action === 'created') {
      return 'Tâche créée';
    }

    if (entry.action === 'completed') {
      return 'Tâche marquée comme terminée';
    }

    if (entry.action === 'deleted') {
      return 'Tâche supprimée';
    }

    // Compare old and new values to generate description
    if (entry.old_values && entry.new_values) {
      if (entry.old_values.status !== entry.new_values.status) {
        changes.push(
          `Statut changé de "${getStatusLabel(entry.old_values.status)}" à "${getStatusLabel(entry.new_values.status)}"`
        );
      }

      // Afficher les changements d'assignation avec les noms
      if (entry.old_values.assigned_to !== entry.new_values.assigned_to) {
        const oldName = entry.old_assigned
          ? `${entry.old_assigned.firstname || ''} ${entry.old_assigned.lastname || ''}`.trim()
          : 'personne';
        const newName = entry.new_assigned
          ? `${entry.new_assigned.firstname || ''} ${entry.new_assigned.lastname || ''}`.trim()
          : 'personne';

        changes.push(`Assignation modifiée de ${oldName} à ${newName}`);
      }

      if (entry.old_values.details !== entry.new_values.details) {
        changes.push('Détails modifiés');
      }
    }

    return changes.join(', ') || 'Modification';
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="size-full text-white hover:bg-[#4A8B96]/90"
      >
        <RotateCcw className="size-4" />
      </Button>

      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
          <div className="relative h-[175px] w-full">
            <Image
              src="/static/background.jpg"
              fill
              objectFit="cover"
              alt="history-popup"
            />
          </div>
          <div className="flex flex-col gap-y-spaceContainer p-6">
            <h2 className="text-xl font-semibold">
              Historique des modifications
            </h2>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            ) : (
              <div className="mt-4 max-h-[350px] space-y-4 overflow-y-auto pr-2">
                {history.map((entry) => (
                  <div key={entry.id} className="border-b pb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {entry.changed_by_profile.firstname}{' '}
                        {entry.changed_by_profile.lastname}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(
                          new Date(entry.changed_at),
                          "dd/MM/yyyy 'à' HH:mm",
                          {
                            locale: fr,
                          }
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      {getChangeDescription(entry)}
                    </p>
                  </div>
                ))}

                {history.length === 0 && (
                  <p className="text-center text-gray-500">
                    Aucun historique disponible
                  </p>
                )}
              </div>
            )}
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
