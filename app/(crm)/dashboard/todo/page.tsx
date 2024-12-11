'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FilterButton } from '@/components/FilterButton';
import { Box } from '@/components/ui/box';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw, Trash } from 'lucide-react';
import CreateTaskDialog from './CreateTaskDialog';
import {
  updateTask,
  completeTask,
  getAdminUsers,
  deleteTask,
} from '../../../../functions/tasks';
import type {
  FilterTasks,
  TaskSubjectType,
  TaskWithRelations,
} from '@/types/types';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import { useTasksStore } from '@/store/task';
import { useWarnIfUnsavedChanges } from '@/hooks/useLeavePageConfirm';
import DeleteTaskDialog from './DeleteTaskDialog';
import DialogTaskHistory from './HistoryTaskDialog';

type TaskStatus = 'urgent' | 'pending' | 'done';
type SubjectType = 'xpert' | 'supplier' | 'mission' | 'other';

const statusOptions = [
  { label: 'Urgent', value: 'urgent', color: '#D75D5D' },
  { label: 'À traiter', value: 'pending', color: '#6B7280' },
  { label: 'Traité', value: 'done', color: '#4A8B96' },
  { label: 'Tous', value: ' ' },
];

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'urgent':
      return 'bg-[#D75D5D]';
    case 'done':
      return 'bg-[#65ADAF]';
    default:
      return 'bg-[#65ADAF]';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const getSubjectReference = (task: TaskWithRelations) => {
  switch (task.subject_type) {
    case 'xpert':
      return task.xpert?.id ? `${task.xpert.generated_id} - ${task.id}` : '-';
    case 'supplier':
      return task.supplier?.id
        ? ` ${task.supplier.generated_id} - ${task.id}`
        : '-';
    case 'mission':
      return task.mission?.id
        ? `${task.mission.mission_number} - ${task.id}`
        : '-';
    default:
      return 'Autre';
  }
};

type NewStatusNotSaved = {
  status: { status: TaskStatus; task_id: number };
};

type NewAssignedToNotSaved = {
  assignedTo: { assigned_to: string; task_id: number };
};

export default function TaskTable() {
  const {
    loadTasks,
    loading,
    resetTasks,
    tasks,
    activeFilters,
    setActiveFilters,
    totalTasks,
  } = useTasksStore();

  const [newStatusNotSaved, setNewStatusNotSaved] = useState<
    NewStatusNotSaved[]
  >([]);
  const [newAssignedToNotSaved, setNewAssignedToNotSaved] = useState<
    NewAssignedToNotSaved[]
  >([]);

  const [isSaving, setIsSaving] = useState(false);

  const [adminOptions, setAdminOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const hasSomethingNotSaved =
    newStatusNotSaved.length > 0 || newAssignedToNotSaved.length > 0;

  useWarnIfUnsavedChanges(hasSomethingNotSaved);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      const admins = await getAdminUsers();
      setAdminOptions(
        admins.map((admin) => ({
          label: `${admin.firstname} ${admin.lastname}`,
          value: admin.id,
        }))
      );
    };

    fetchAdminUsers();
  }, []);

  const handleUpdateStatus = async () => {
    if (!newStatusNotSaved.length) {
      return { error: null };
    }
    try {
      const promiseStatus = newStatusNotSaved.map(async (data) => {
        if (data.status.status === 'done') {
          const { error } = await completeTask(data.status.task_id);
          if (error) {
            return { error };
          } else {
            return { error: null };
          }
        } else {
          const { error } = await updateTask(data.status.task_id, {
            status: data.status.status,
          });
          if (error) {
            return { error };
          } else {
            return { error: null };
          }
        }
      });

      const data = await Promise.all(promiseStatus);

      if (data.some((d) => d.error)) {
        return { error: true };
      }
      return { error: null };
    } catch (error) {
      return { error: true };
    }
  };
  const handleUpdateAssignedTo = async () => {
    if (!newAssignedToNotSaved.length) {
      return { error: null };
    }
    try {
      const promise = newAssignedToNotSaved.map(async (data) => {
        const { error } = await updateTask(data.assignedTo.task_id, {
          assigned_to: data.assignedTo.assigned_to,
        });
        if (error) {
          return { error };
        }
      });
      const data = await Promise.all(promise);

      if (data.some((d) => d?.error)) {
        return { error: true };
      }
      return { error: null };
    } catch (error) {
      return { error: true };
    }
  };

  const handleFilterChange = (key: keyof FilterTasks, value: string | null) => {
    const newValue = value === ' ' ? undefined : value;
    const newFilters = { ...activeFilters, [key]: newValue };
    setActiveFilters(newFilters);
  };

  const checkIfFilterIsNotEmpty = (filter: FilterTasks) => {
    return Object.values(filter).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== '';
    });
  };

  const isFilterNotEmpty = checkIfFilterIsNotEmpty(activeFilters);

  useEffect(() => {
    if (isFilterNotEmpty) {
      loadTasks(true);
    }
  }, [activeFilters]);

  const hasMore =
    tasks && totalTasks
      ? tasks.length < totalTasks
      : totalTasks === 0
        ? false
        : true;

  const handleDeleteTask = async (taskId: number) => {
    try {
      const { error } = await deleteTask(taskId);

      if (error) {
        toast.error('Erreur lors de la suppression de la tâche');
        return;
      }

      toast.success('Tâche supprimée avec succès');
      loadTasks(true); // Recharge la liste des tâches
    } catch (error) {
      toast.error('Erreur lors de la suppression de la tâche');
      console.error('Error deleting task:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error: errorAssignedTo } = await handleUpdateAssignedTo();
    if (errorAssignedTo) {
      setIsSaving(false);
      toast.error("Erreur lors de l'enregistrement des tâches");
      return;
    } else {
      setNewAssignedToNotSaved([]);
    }
    const { error: errorStatus } = await handleUpdateStatus();
    if (errorStatus) {
      toast.error("Erreur lors de l'enregistrement des tâches");
      setIsSaving(false);
      return;
    }
    toast.success('Tâches enregistrées avec succès');
    loadTasks(true);
    setNewStatusNotSaved([]);
    setIsSaving(false);
  };

  return (
    <div
      className={cn(
        'flex size-full h-[calc(100vh_-_180px)] flex-col justify-between gap-4 overflow-hidden'
      )}
    >
      <div className="relative flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <CreateTaskDialog onTaskCreate={() => loadTasks(true)} />
          <Button
            disabled={!hasSomethingNotSaved || isSaving}
            className="text-white"
            onClick={handleSave}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        <div className="grid gap-3">
          {/* Header Row */}
          <div className="top-0 z-10 grid grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_50px_50px] gap-3">
            <Box className="flex h-full items-center bg-[#FDF6E9] font-[600]">
              Créé le
            </Box>
            <Box className="flex h-full items-center bg-[#FDF6E9] font-medium">
              <FilterButton
                options={adminOptions}
                selectedOption={
                  activeFilters.createdBy
                    ? {
                        label: activeFilters.createdBy,
                        value: activeFilters.createdBy,
                      }
                    : { label: '', value: '' }
                }
                onValueChange={(value) =>
                  handleFilterChange('createdBy', value)
                }
                placeholder="Par"
              />
            </Box>
            <Box className="flex h-full items-center bg-[#FDF6E9] font-medium">
              <FilterButton
                options={adminOptions}
                selectedOption={
                  activeFilters.assignedTo
                    ? {
                        label: activeFilters.assignedTo,
                        value: activeFilters.assignedTo,
                      }
                    : { label: '', value: '' }
                }
                onValueChange={(value) =>
                  handleFilterChange('assignedTo', value)
                }
                placeholder="À / Transférer à"
                className="flex flex-wrap"
              />
            </Box>
            <Box className="flex h-full items-center bg-[#FDF6E9] px-4 font-[600]">
              Référence
            </Box>
            <Box className="flex h-full items-center justify-center bg-[#FDF6E9] px-4 font-[600]">
              Détails
            </Box>
            <Box className="flex h-full items-center bg-[#FDF6E9] font-medium">
              <FilterButton
                options={statusOptions}
                coloredOptions
                selectedOption={{
                  value: activeFilters.status ?? '',
                  label:
                    statusOptions.find(
                      (opt) => opt.value === activeFilters.status
                    )?.label ?? '',
                }}
                onValueChange={(value) => handleFilterChange('status', value)}
                placeholder="État"
              />
            </Box>
            <div />
            <div className="col-span-7">
              {!loading ? (
                <div className="flex w-fit items-center gap-x-4">
                  <p className="whitespace-nowrap">{totalTasks} résultats</p>
                  {/* RESET */}
                  {(activeFilters.createdBy ||
                    activeFilters.assignedTo ||
                    activeFilters.status ||
                    activeFilters.subjectType) && (
                    <button
                      className="font-[600] text-primary"
                      onClick={resetTasks}
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              ) : (
                <Skeleton className="h-6 w-40" />
              )}
            </div>
          </div>
          <div className="h-[calc(100vh_-_350px)] overflow-auto pb-10">
            <div className="top-0 z-10 grid grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_50px_50px] gap-3">
              {!loading && tasks?.length === 0 ? (
                <div className="col-span-7 py-8 text-center text-gray-500">
                  Aucune tâche trouvée
                </div>
              ) : (
                tasks?.map((task) => {
                  return (
                    <React.Fragment key={task.id}>
                      <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
                        {formatDate(task.created_at)}
                      </Box>
                      <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
                        {task.created_by_profile.firstname}
                      </Box>
                      <SelectAssignedTo
                        newAssignedToNotSaved={newAssignedToNotSaved}
                        setNewAssignedToNotSaved={setNewAssignedToNotSaved}
                        task={task}
                        adminOptions={adminOptions}
                      />
                      <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
                        {getSubjectReference(task)}
                      </Box>
                      <Box className="line-clamp-3 flex h-[70px] items-center bg-[#E6E6E6] px-4">
                        {task.details}
                      </Box>
                      <SelectStatus
                        task={task}
                        newStatusNotSaved={newStatusNotSaved}
                        setNewStatusNotSaved={setNewStatusNotSaved}
                      />

                      <Box className="flex h-[70px] items-center justify-center bg-[#4A8B96]">
                        <DialogTaskHistory taskId={task.id} />
                      </Box>
                      <Box className="flex h-[70px] items-center justify-center bg-[#D75D5D]">
                        <DeleteTaskDialog
                          taskId={task.id}
                          onDelete={() => loadTasks(true)}
                        />
                      </Box>
                    </React.Fragment>
                  );
                })
              )}
            </div>
            <InfiniteScroll
              hasMore={hasMore}
              next={loadTasks}
              isLoading={false}
            >
              {hasMore && (
                <div className="mt-4 flex w-full items-center justify-center">
                  <Loader />
                </div>
              )}
              {!hasMore && loading && (
                <div className="mt-4 flex w-full items-center justify-center">
                  <Loader />
                </div>
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
}

const SelectAssignedTo = ({
  task,
  newAssignedToNotSaved,
  setNewAssignedToNotSaved,
  adminOptions,
}: {
  task: TaskWithRelations;
  newAssignedToNotSaved: NewAssignedToNotSaved[];
  adminOptions: { label: string; value: string }[];
  setNewAssignedToNotSaved: (newData: NewAssignedToNotSaved[]) => void;
}) => {
  const [assignedTo, setAssignedTo] = useState(task.assigned_to);

  const handleChange = (taskId: number, newAssignedTo: TaskSubjectType) => {
    setAssignedTo(newAssignedTo);
    const existingData = newAssignedToNotSaved.find(
      (data) => data.assignedTo.task_id === taskId
    );
    if (existingData) {
      if (newAssignedTo === task.assigned_to) {
        const newData = newAssignedToNotSaved.filter(
          (data) => data.assignedTo.task_id !== taskId
        );
        setNewAssignedToNotSaved(newData);
        return;
      }
      const newData = newAssignedToNotSaved.map((data) =>
        data.assignedTo.task_id === taskId
          ? { assignedTo: { assigned_to: newAssignedTo, task_id: taskId } }
          : data
      );
      setNewAssignedToNotSaved(newData);
    } else {
      setNewAssignedToNotSaved([
        ...newAssignedToNotSaved,
        { assignedTo: { assigned_to: newAssignedTo, task_id: taskId } },
      ]);
    }
  };

  return (
    <Box className="h-[70px] bg-[#D0DDE1] p-0">
      <Select
        value={assignedTo}
        onValueChange={(value) =>
          handleChange(task.id, value as TaskSubjectType)
        }
      >
        <SelectTrigger className="justify-center border-0 bg-transparent p-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {adminOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  );
};

const SelectStatus = ({
  task,
  newStatusNotSaved,
  setNewStatusNotSaved,
}: {
  task: TaskWithRelations;
  newStatusNotSaved: NewStatusNotSaved[];
  setNewStatusNotSaved: (newData: NewStatusNotSaved[]) => void;
}) => {
  const [status, setStatus] = useState(task.status);

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setStatus(newStatus);
    const existingData = newStatusNotSaved.find(
      (data) => data.status.task_id === taskId
    );
    if (existingData) {
      if (newStatus === task.status) {
        const newData = newStatusNotSaved.filter(
          (data) => data.status.task_id !== taskId
        );
        setNewStatusNotSaved(newData);
        return;
      }
      const newData = newStatusNotSaved.map((data) =>
        data.status.task_id === taskId
          ? { status: { status: newStatus, task_id: taskId } }
          : data
      );
      setNewStatusNotSaved(newData);
    } else {
      setNewStatusNotSaved([
        ...newStatusNotSaved,
        { status: { status: newStatus, task_id: taskId } },
      ]);
    }
  };

  const statusOptionsWithoutAll = statusOptions.filter(
    (option) => option.value !== ' '
  );

  return (
    <Box className="h-[70px] p-0">
      <Select
        value={status}
        onValueChange={(value) =>
          handleStatusChange(task.id, value as TaskStatus)
        }
      >
        <SelectTrigger
          className={`size-full justify-center border-0 text-white ${getStatusColor(status as TaskStatus)}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptionsWithoutAll.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  );
};
