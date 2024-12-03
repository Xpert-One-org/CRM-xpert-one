// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   Credenza,
//   CredenzaContent,
//   CredenzaClose,
// } from '@/components/ui/credenza';
// import SelectComponent from '@/components/SelectComponent';
// import TextArea from '@/components/inputs/TextArea';
// import Image from 'next/image';
// import { toast } from 'sonner';
// import Button from '@/components/Button';
// import { cn } from '@/lib/utils';
// import { Checkbox } from '@/components/ui/checkbox';
// import { createTask } from '../../../../functions/tasks';

// type SubjectType = 'xpert' | 'supplier' | 'mission' | 'other';

// // Mise à jour des types pour supporter les valeurs nullables
// type Profile = {
//   id: string;
//   firstname: string | null;
//   lastname: string | null;
// };

// type Mission = {
//   id: number;
//   title: string | null;
// };

// type Props = {
//   onTaskCreate?: (task: any) => void;
// };

// export default function CreateTaskDialog({ onTaskCreate }: Props) {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [missions, setMissions] = useState<Mission[]>([]);

//   const [formData, setFormData] = useState({
//     assignedTo: '',
//     subjectType: '' as SubjectType | '',
//     subjectId: '',
//     details: '',
//   });
//   const [isUrgent, setIsUrgent] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       const supabase = await createSupabaseAppServerClient();

//       // Charger et filtrer les profils non-null
//       const { data: profilesData } = await supabase
//         .from('profile')
//         .select('id, firstname, lastname')
//         .not('firstname', 'is', null)
//         .not('lastname', 'is', null);

//       if (profilesData) {
//         setProfiles(profilesData);
//       }

//       // Charger et filtrer les missions non-null
//       const { data: missionsData } = await supabase
//         .from('mission')
//         .select('id, title')
//         .not('title', 'is', null);

//       if (missionsData) {
//         setMissions(missionsData);
//       }
//     };

//     loadData();
//   }, []);

//   const userOptions = profiles
//     .filter((profile) => profile.firstname && profile.lastname) // Filtre supplémentaire pour la sécurité
//     .map((profile) => ({
//       label: `${profile.firstname} ${profile.lastname}`,
//       value: profile.id,
//     }));

//   const subjectTypeOptions = [
//     { label: 'Expert', value: 'xpert' },
//     { label: 'Fournisseur', value: 'supplier' },
//     { label: 'Mission', value: 'mission' },
//     { label: 'Autre', value: 'other' },
//   ];

//   const getSubjectOptions = () => {
//     switch (formData.subjectType) {
//       case 'xpert':
//       case 'supplier':
//         return profiles
//           .filter((profile) => profile.firstname && profile.lastname)
//           .map((profile) => ({
//             label: `${profile.firstname} ${profile.lastname}`,
//             value: profile.id,
//           }));
//       case 'mission':
//         return missions
//           .filter((mission) => mission.title)
//           .map((mission) => ({
//             label: `M${mission.id} - ${mission.title}`,
//             value: mission.id.toString(),
//           }));
//       default:
//         return [];
//     }
//   };

//   const handleChangeAssignTo = (value: string) => {
//     setFormData((prev) => ({ ...prev, assignedTo: value }));
//   };

//   const handleChangeSubjectType = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       subjectType: value as SubjectType,
//       subjectId: '',
//     }));
//   };

//   const handleChangeSubjectId = (value: string) => {
//     setFormData((prev) => ({ ...prev, subjectId: value }));
//   };

//   const handleChangeDetails = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setFormData((prev) => ({ ...prev, details: e.target.value }));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       const supabase = await createSupabaseAppServerClient();
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         throw new Error('User not authenticated');
//       }

//       const taskData = {
//         created_by: user.id,
//         assigned_to: formData.assignedTo,
//         subject_type: formData.subjectType as SubjectType,
//         details: formData.details,
//         status: isUrgent ? 'urgent' : 'pending',
//         xpert_id: formData.subjectType === 'xpert' ? formData.subjectId : null,
//         supplier_id:
//           formData.subjectType === 'supplier' ? formData.subjectId : null,
//         mission_id:
//           formData.subjectType === 'mission'
//             ? parseInt(formData.subjectId)
//             : null,
//       };

//       await createTask(taskData);
//       onTaskCreate?.(taskData);
//       toast.success('Tâche créée avec succès');
//       setOpen(false);
//       setFormData({
//         assignedTo: '',
//         subjectType: '',
//         subjectId: '',
//         details: '',
//       });
//       setIsUrgent(false);
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Erreur lors de la création de la tâche');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isDisabled =
//     !formData.assignedTo ||
//     !formData.subjectType ||
//     (!formData.subjectId && formData.subjectType !== 'other') ||
//     !formData.details;

//   return (
//     <>
//       <Button
//         onClick={() => setOpen(true)}
//         className="w-fit bg-[#4A8B96] text-white hover:bg-[#4A8B96]/90 sm:w-full sm:max-w-[178px]"
//       >
//         Créer une tâche
//       </Button>

//       <Credenza open={open} onOpenChange={setOpen}>
//         <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white/70 p-0 backdrop-blur-sm">
//           <div className="relative h-[175px] w-full">
//             <Image
//               src="/static/confirm-email.jpg"
//               fill
//               objectFit="cover"
//               alt="confirm-popup"
//             />
//           </div>

//           <div className="space-y-8 px-spaceContainer pt-spaceSmall">
//             <div className="flex flex-col items-end gap-4 lg:flex-row">
//               <SelectComponent
//                 name="assignTo"
//                 required
//                 label="Attribuer à"
//                 placeholder="Sélectionnez un utilisateur"
//                 options={userOptions}
//                 defaultSelectedKeys={formData.assignedTo}
//                 onValueChange={handleChangeAssignTo}
//               />

//               <SelectComponent
//                 name="subjectType"
//                 required
//                 label="Type de sujet"
//                 placeholder="Sélectionnez un type"
//                 options={subjectTypeOptions}
//                 defaultSelectedKeys={formData.subjectType}
//                 onValueChange={handleChangeSubjectType}
//               />

//               {formData.subjectType && formData.subjectType !== 'other' && (
//                 <SelectComponent
//                   name="subjectId"
//                   required
//                   label="Référence"
//                   placeholder="Sélectionnez une référence"
//                   options={getSubjectOptions()}
//                   defaultSelectedKeys={formData.subjectId}
//                   onValueChange={handleChangeSubjectId}
//                   className="flex-1"
//                 />
//               )}

//               <div className="mb-[10px] flex items-center space-x-2">
//                 <label
//                   htmlFor="urgent"
//                   className="whitespace-nowrap text-sm font-medium text-black"
//                 >
//                   Tâche urgente ?
//                 </label>
//                 <Checkbox
//                   id="urgent"
//                   checked={isUrgent}
//                   onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
//                 />
//               </div>
//             </div>

//             <TextArea
//               required
//               label="Détails de la note"
//               placeholder="Entrez les détails de la tâche..."
//               name="details"
//               defaultValue={formData.details}
//               onChange={handleChangeDetails}
//             />
//           </div>

//           <div className="flex justify-end gap-x-spaceSmall p-spaceContainer">
//             <CredenzaClose>
//               <Button
//                 variant="previous"
//                 hover="only_brightness"
//                 className="border-[1px] border-black bg-[#BEBEC0] text-black"
//               >
//                 Annuler la tâche
//               </Button>
//             </CredenzaClose>
//             <Button
//               onClick={handleSubmit}
//               hover="only_brightness"
//               className={cn('w-fit self-end px-spaceContainer', {
//                 'bg-colors-important': !isLoading && !isDisabled,
//               })}
//               variant={isLoading || isDisabled ? 'disabled' : 'secondary'}
//             >
//               {isLoading ? 'Chargement...' : 'Valider la tâche'}
//             </Button>
//           </div>
//         </CredenzaContent>
//       </Credenza>
//     </>
//   );
// }
