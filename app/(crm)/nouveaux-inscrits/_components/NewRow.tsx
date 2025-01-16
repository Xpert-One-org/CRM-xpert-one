import { Box } from '@/components/ui/box';
import type { DBProfile } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { EyeIcon, MessageSquare, ListTodo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTasksStore } from '@/store/task';
import { Button } from '@/components/ui/button';
import useChat from '@/store/chat/chat';
import useUser from '@/store/useUser';
import { cn } from '@/lib/utils';
import type { NewUserCalledNotSaved } from './NewTable';
import { useAdminCollaborators } from '@/store/adminCollaborators';

type Props = {
  isOpen: boolean;
  onClick: () => void;
  user: DBProfile;
  newUserCalledNotSaved: NewUserCalledNotSaved[];
  setNewUserCalledNotSaved: (value: NewUserCalledNotSaved[]) => void;
};

export default function NewRow({
  user,
  isOpen,
  onClick,
  newUserCalledNotSaved,
  setNewUserCalledNotSaved,
}: Props) {
  const router = useRouter();
  const { setSearchUserSelected } = useUser();
  const { setCreateTaskDialogOpen, setInitialTaskData } = useTasksStore();
  const { collaborators } = useAdminCollaborators();
  const { setPopupOpen } = useChat();
  const [isUserCalled, setIsUserCalled] = useState<boolean>(
    user.get_welcome_call ?? false
  );

  const handleMessageClick = () => {
    setSearchUserSelected({
      id: user.id,
      label: `${user.firstname ?? ''} ${user.lastname ?? ''} - ${user.generated_id}`,
    });
    setPopupOpen(true);
    router.push('/messagerie');
  };

  const handleTaskClick = () => {
    setInitialTaskData({
      subjectType: user.role as 'xpert' | 'supplier',
      subjectId: user.id,
    });
    setCreateTaskDialogOpen(true);
    router.push('/dashboard/todo');
  };

  const toggleUserCall = () => {
    setIsUserCalled(!isUserCalled);
    const existingData = newUserCalledNotSaved.find(
      (item) => item.user_id === user.id
    );
    if (existingData) {
      if (isUserCalled === user.get_welcome_call) {
        setNewUserCalledNotSaved(
          newUserCalledNotSaved.filter((item) => item.user_id !== user.id)
        );
        return;
      }
      const newData = newUserCalledNotSaved.map((data) =>
        data.user_id === user.id ? { ...data, value: isUserCalled } : data
      );
      setNewUserCalledNotSaved(newData);
    } else {
      setNewUserCalledNotSaved([
        ...newUserCalledNotSaved,
        { user_id: user.id, value: isUserCalled },
      ]);
    }
  };

  const referent = (() => {
    const referentData = collaborators.find(
      (c) => c.id === user.affected_referent_id
    );
    return referentData
      ? `${referentData.firstname} ${referentData.lastname}`
      : '';
  })();

  return (
    <>
      <div className="grid w-full grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_50px_50px] gap-4">
        <Box isSelected={isOpen} className="">
          <p>{formatDate(user.created_at) ?? 'Non renseigné'}</p>
        </Box>
        <Box
          isSelected={isOpen}
          primary
          className="cursor-pointer text-white"
          onClick={onClick}
        >
          <p>{user.generated_id ?? 'Non renseigné'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{user.role === 'company' ? 'F' : 'X'}</p>
        </Box>
        <Box isSelected={isOpen}>
          <p>{`${user.totale_progression ?? '0'}%`}</p>
        </Box>
        <Box
          isSelected={isOpen}
          className={cn('cursor-pointer bg-[#B1B1B1]', {
            'bg-primary': isUserCalled,
          })}
          onClick={toggleUserCall}
        >
          <p className="text-white">{isUserCalled ? 'Traité' : ''}</p>
        </Box>
        <Box isSelected={isOpen} primary className="text-white">
          <p>{'Ceci est un commentaire ...'}</p>
          <EyeIcon className="ml-1" />
        </Box>
        <Box isSelected={isOpen}>
          <p>{referent}</p>
        </Box>
        <Box className="flex items-center justify-center bg-[#4A8B96]">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMessageClick}
            className="size-full text-white hover:bg-[#4A8B96]/90"
          >
            <MessageSquare className="size-5" />
          </Button>
        </Box>
        <Box className="flex items-center justify-center bg-[#4A8B96]">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTaskClick}
            className="size-full text-white hover:bg-[#4A8B96]/90"
          >
            <ListTodo className="size-5" />
          </Button>
        </Box>
      </div>
    </>
  );
}
