'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
} from '@/components/ui/credenza';

type StatCardProps = {
  title: string;
  value: string | number;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  chartType?: string;
};

export default function StatCard({
  title,
  value,
  modalTitle,
  modalContent,
  disabled = false,
  className,
  chartType,
}: StatCardProps) {
  const [open, setOpen] = React.useState(false);

  // Détermine la taille du modal en fonction du type de graphique
  const getModalClasses = () => {
    if (chartType === 'map') {
      return 'max-w-5xl w-full';
    }
    return 'max-w-4xl';
  };

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
          <CredenzaContent
            className={cn(
              'max-h-[95vh] overflow-scroll p-6',
              getModalClasses()
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <CredenzaTitle className="text-2xl font-bold">
                {modalTitle || title}
              </CredenzaTitle>
            </div>

            <div
              className={cn(
                'overflow-auto',
                chartType === 'map' ? 'max-h-[80vh]' : 'max-h-[70vh]'
              )}
            >
              {modalContent}
            </div>
          </CredenzaContent>
        </Credenza>
      )}
    </>
  );
}
