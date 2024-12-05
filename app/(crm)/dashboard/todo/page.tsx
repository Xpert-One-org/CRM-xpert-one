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
import { RotateCcw } from 'lucide-react';
import CreateTaskDialog from './CreateTaskDialog';
import {
  getTasks,
  updateTask,
  completeTask,
  getAdminUsers,
} from '../../../../functions/tasks';
import type { FilterTasks, TaskWithRelations } from '@/types/types';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import { useTasksStore } from '@/store/task';

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
      return 'bg-[#4A8B96]';
    default:
      return 'bg-[#6B7280]';
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

export default function TaskTable() {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);

  const { loadTasks, loading, activeFilters, setActiveFilters, totalTasks } =
    useTasksStore();

  const [adminOptions, setAdminOptions] = useState<
    { label: string; value: string }[]
  >([]);

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

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      let updatedTask: TaskWithRelations;

      if (newStatus === 'done') {
        updatedTask = await completeTask(taskId);
      } else {
        updatedTask = await updateTask(taskId, { status: newStatus });
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );

      toast.success('Statut de la tâche mis à jour');
    } catch (error) {
      toast.error('Impossible de mettre à jour le statut');
    }
  };

  const handleFilterChange = (key: keyof FilterTasks, value: string | null) => {
    const newValue = value === ' ' ? undefined : value;
    const newFilters = { ...activeFilters, [key]: newValue };
    setActiveFilters(newFilters);
  };

  const resetTasksFilters = () => {
    setActiveFilters({});
  };

  const hasMore =
    tasks && totalTasks
      ? tasks.length < totalTasks
      : totalTasks === 0
        ? false
        : true;

  return (
    <div className={cn('flex size-full flex-col justify-between gap-4')}>
      <div className="relative flex flex-col gap-4">
        <CreateTaskDialog onTaskCreate={() => loadTasks(true)} />

        <div className="grid gap-3">
          {/* Header Row */}
          <div className="top-0 z-10 grid grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_50px] gap-3">
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
                      onClick={resetTasksFilters}
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              ) : (
                <Skeleton className="h-6 w-40" />
              )}
            </div>

            {!loading && tasks.length === 0 ? (
              <div className="col-span-7 py-8 text-center text-gray-500">
                Aucune tâche trouvée
              </div>
            ) : (
              tasks.map((task) => (
                <React.Fragment key={task.id}>
                  <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
                    {formatDate(task.created_at)}
                  </Box>
                  <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
                    {task.created_by_profile.firstname}
                  </Box>
                  <Box className="flex h-[70px] items-center bg-[#D0DDE1] px-4">
                    <Select
                      value={task.assigned_to}
                      onValueChange={async (value) => {
                        try {
                          await updateTask(task.id, { assigned_to: value });
                          loadTasks();
                        } catch (error) {
                          toast.error('Impossible de réassigner la tâche');
                        }
                      }}
                    >
                      <SelectTrigger className="border-0 bg-transparent p-0">
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
                  <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
                    {getSubjectReference(task)}
                  </Box>
                  <Box className="line-clamp-3 flex h-[70px] items-center bg-[#E6E6E6] px-4">
                    {task.details}
                  </Box>
                  <Box className="h-[70px] p-0">
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        handleStatusChange(task.id, value as TaskStatus)
                      }
                    >
                      <SelectTrigger
                        className={`size-full border-0 text-white ${getStatusColor(task.status as TaskStatus)}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Box>
                  <Box className="flex h-[70px] items-center justify-center bg-[#4A8B96]">
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={loadTasks}
                      className="size-full text-white hover:bg-[#4A8B96]/90"
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  </Box>
                </React.Fragment>
              ))
            )}

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
