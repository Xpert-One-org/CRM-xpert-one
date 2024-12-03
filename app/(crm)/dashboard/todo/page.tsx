// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { FilterButton } from '@/components/FilterButton';
// import { Box } from '@/components/ui/box';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { RotateCcw } from 'lucide-react';
// import CreateTaskDialog from './CreateTaskDialog';
// import {
//   getTasks,
//   updateTask,
//   completeTask,
// } from '../../../../functions/tasks';
// import { TaskWithRelations } from '@/types/types';
// import { toast } from 'sonner';

// type TaskStatus = 'urgent' | 'pending' | 'done';
// type SubjectType = 'xpert' | 'supplier' | 'mission' | 'other';

// interface FilterState {
//   createdBy?: string;
//   assignedTo?: string;
//   status?: TaskStatus;
//   subjectType?: SubjectType;
// }

// const statusOptions = [
//   { label: 'Urgent', value: 'urgent' },
//   { label: 'À traiter', value: 'pending' },
//   { label: 'Traité', value: 'done' },
// ];

// const getStatusColor = (status: TaskStatus) => {
//   switch (status) {
//     case 'urgent':
//       return 'bg-[#D75D5D]';
//     case 'done':
//       return 'bg-[#4A8B96]';
//     default:
//       return 'bg-[#6B7280]';
//   }
// };

// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString('fr-FR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// const getSubjectReference = (task: TaskWithRelations) => {
//   switch (task.subject_type) {
//     case 'xpert':
//       return task.xpert?.id ? `X ${task.xpert.id}` : '-';
//     case 'supplier':
//       return task.supplier?.id ? `F ${task.supplier.id}` : '-';
//     case 'mission':
//       return task.mission?.id ? `M ${task.mission.id}` : '-';
//     default:
//       return 'Autre';
//   }
// };

// export default function TaskTable() {
//   const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<FilterState>({});

//   // Liste des utilisateurs pour les filtres (à récupérer depuis la base)
//   const [filterOptions, setFilterOptions] = useState<
//     Array<{ label: string; value: string }>
//   >([]);

//   useEffect(() => {
//     loadTasks();
//     loadFilterOptions();
//   }, [filters]);

//   const loadFilterOptions = async () => {
//     // TODO: Charger les utilisateurs depuis la base
//     // Pour l'instant on utilise les utilisateurs des tâches existantes
//     const uniqueUsers = new Set();
//     tasks.forEach((task) => {
//       uniqueUsers.add(task.created_by_profile.id);
//       uniqueUsers.add(task.assigned_to_profile.id);
//     });

//     const options = Array.from(uniqueUsers).map((userId) => {
//       const user = tasks.find(
//         (task) =>
//           task.created_by_profile.id === userId ||
//           task.assigned_to_profile.id === userId
//       )?.created_by_profile;
//       return {
//         label: user?.firstname || 'Unknown',
//         value: userId as string,
//       };
//     });

//     setFilterOptions(options);
//   };

//   const loadTasks = async () => {
//     try {
//       setLoading(true);
//       const tasksData = await getTasks(filters);
//       setTasks(tasksData);
//     } catch (error) {
//       toast.error('Impossible de charger les tâches');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
//     try {
//       let updatedTask: TaskWithRelations;

//       if (newStatus === 'done') {
//         updatedTask = await completeTask(taskId);
//       } else {
//         updatedTask = await updateTask(taskId, { status: newStatus });
//       }

//       setTasks((prevTasks) =>
//         prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
//       );

//       toast.success('Statut de la tâche mis à jour');
//     } catch (error) {
//       toast.error('Impossible de mettre à jour le statut');
//     }
//   };

//   const handleFilterChange = (key: keyof FilterState, value: string | null) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value || undefined,
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex h-[65vh] items-center justify-center">
//         <div className="text-lg">Chargement...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex size-full flex-col justify-between gap-4">
//       <div className="relative flex flex-col gap-4">
//         <CreateTaskDialog onTaskCreate={loadTasks} />

//         <div className="grid h-[65vh] gap-3 overflow-auto">
//           {/* Header Row */}
//           <div className="sticky top-0 z-10 grid grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_50px] gap-3">
//             <Box className="flex h-[42px] items-center bg-[#FDF6E9] font-medium">
//               <div className="flex w-full items-center justify-between px-4">
//                 Créé le
//               </div>
//             </Box>
//             <Box className="flex h-[42px] items-center bg-[#FDF6E9] font-medium">
//               <div className="flex w-full items-center justify-between px-4">
//                 Par
//                 <FilterButton
//                   options={filterOptions}
//                   defaultSelectedKeys={filters.createdBy}
//                   onValueChange={(value) =>
//                     handleFilterChange('createdBy', value)
//                   }
//                   placeholder=""
//                   className="size-6 min-w-0 border-0 p-0"
//                 />
//               </div>
//             </Box>
//             <Box className="flex h-[42px] items-center bg-[#FDF6E9] font-medium">
//               <div className="flex w-full items-center justify-between whitespace-nowrap px-4">
//                 À / Transférer à
//                 <FilterButton
//                   options={filterOptions}
//                   defaultSelectedKeys={filters.assignedTo}
//                   onValueChange={(value) =>
//                     handleFilterChange('assignedTo', value)
//                   }
//                   placeholder=""
//                   className="size-6 min-w-0 border-0 p-0"
//                 />
//               </div>
//             </Box>
//             <Box className="flex h-[42px] items-center bg-[#FDF6E9] px-4 font-medium">
//               Référence
//             </Box>
//             <Box className="flex h-[42px] items-center justify-center bg-[#FDF6E9] px-4 font-medium">
//               Détails
//             </Box>
//             <Box className="flex h-[42px] items-center bg-[#FDF6E9] font-medium">
//               <div className="flex w-full items-center justify-between px-4">
//                 État
//                 <FilterButton
//                   options={statusOptions}
//                   defaultSelectedKeys={filters.status}
//                   onValueChange={(value) => handleFilterChange('status', value)}
//                   placeholder=""
//                   className="size-6 min-w-0 border-0 p-0"
//                 />
//               </div>
//             </Box>
//             <Box className="h-[42px] bg-[#FDF6E9]">&nbsp;</Box>
//           </div>

//           {/* Task Rows */}
//           {tasks.length === 0 ? (
//             <div className="col-span-7 py-8 text-center text-gray-500">
//               Aucune tâche trouvée
//             </div>
//           ) : (
//             tasks.map((task) => (
//               <div
//                 key={task.id}
//                 className="grid grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_50px] gap-3"
//               >
//                 <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
//                   {formatDate(task.created_at)}
//                 </Box>
//                 <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
//                   {task.created_by_profile.firstname}
//                 </Box>
//                 <Box className="flex h-[70px] items-center bg-[#D0DDE1] px-4">
//                   <Select
//                     value={task.assigned_to}
//                     onValueChange={async (value) => {
//                       try {
//                         await updateTask(task.id, { assigned_to: value });
//                         loadTasks();
//                       } catch (error) {
//                         toast.error('Impossible de réassigner la tâche');
//                       }
//                     }}
//                   >
//                     <SelectTrigger className="border-0 bg-transparent p-0">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {filterOptions.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </Box>
//                 <Box className="flex h-[70px] items-center bg-[#E6E6E6] px-4">
//                   {getSubjectReference(task)}
//                 </Box>
//                 <Box className="line-clamp-3 flex h-[70px] items-center bg-[#E6E6E6] px-4">
//                   {task.details}
//                 </Box>
//                 <Box className="h-[70px] p-0">
//                   <Select
//                     value={task.status}
//                     onValueChange={(value) =>
//                       handleStatusChange(task.id, value as TaskStatus)
//                     }
//                   >
//                     <SelectTrigger
//                       className={`size-full border-0 text-white ${getStatusColor(task.status as TaskStatus)}`}
//                     >
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statusOptions.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </Box>
//                 <Box className="flex h-[70px] items-center justify-center bg-[#4A8B96]">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => loadTasks()}
//                     className="size-full text-white hover:bg-[#4A8B96]/90"
//                   >
//                     <RotateCcw className="size-4" />
//                   </Button>
//                 </Box>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
