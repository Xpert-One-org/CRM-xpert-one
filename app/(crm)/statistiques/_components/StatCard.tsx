import React from 'react';
import { cn } from '@/lib/utils';
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';

type StatCardProps = {
  title: string;
  value: string | number;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function StatCard({
  title,
  value,
  modalTitle,
  modalContent,
  disabled = false,
  className,
}: StatCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className={cn(
          'flex h-[120px] w-full cursor-pointer items-center justify-center rounded-md bg-secondary p-4 text-center text-white transition hover:brightness-110',
          disabled && 'cursor-default bg-gray-400 hover:brightness-100',
          className
        )}
        onClick={() => !disabled && modalContent && setOpen(true)}
      >
        <div className="flex flex-col">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
      </div>

      {modalContent && (
        <Credenza open={open} onOpenChange={setOpen}>
          <CredenzaContent className="max-w-3xl p-6">
            <CredenzaTitle className="mb-6 text-2xl font-bold">
              {modalTitle || title}
            </CredenzaTitle>
            <div className="max-h-[70vh] overflow-auto">{modalContent}</div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setOpen(false)}>Fermer</Button>
            </div>
          </CredenzaContent>
        </Credenza>
      )}
    </>
  );
}
