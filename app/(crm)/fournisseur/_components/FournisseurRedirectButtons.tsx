import { Button } from '@/components/ui/button';
import { MessageSquare, ListTodo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTasksStore } from '@/store/task';
import useChat from '@/store/chat/chat';
import useUser from '@/store/useUser';
import type { DBFournisseur } from '@/types/typesDb';

type Props = {
  user: DBFournisseur;
};

export default function FournisseurRedirectButtons({ user }: Props) {
  const router = useRouter();
  const { setSearchUserSelected } = useUser();
  const { setCreateTaskDialogOpen, setInitialTaskData } = useTasksStore();
  const { setPopupOpen } = useChat();

  const handleMessageClick = async () => {
    setSearchUserSelected({
      id: user.id,
      label: `${user.firstname ?? ''} ${user.lastname ?? ''} - ${user.generated_id}`,
    });
    setPopupOpen(true);
    router.push('/messagerie');
  };

  const handleTaskClick = () => {
    setInitialTaskData({
      subjectType: 'supplier',
      subjectId: user.id,
    });
    setCreateTaskDialogOpen(true);
    router.push('/dashboard/todo');
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMessageClick}
        className="h-[70px] w-[45px] bg-[#4A8B96] text-white hover:bg-[#4A8B96]/90"
      >
        <MessageSquare className="size-[30px]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleTaskClick}
        className="h-[70px] w-[45px] bg-[#4A8B96] text-white hover:bg-[#4A8B96]/90"
      >
        <ListTodo className="size-[30px]" />
      </Button>
    </div>
  );
}
