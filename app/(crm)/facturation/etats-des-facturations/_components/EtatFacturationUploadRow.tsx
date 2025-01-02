import React from 'react';
import UploadMultipleSalarySheetDialog from './UploadMultipleSalarySheetDialog';
import type { DBMission } from '@/types/typesDb';
import { useIsProjectManager, useIsHr, useIsAdv } from '@/hooks/useRoles';

export default function EtatFacturationUploadRow({
  missions,
  onUploadSuccess,
}: {
  missions: DBMission[];
  onUploadSuccess?: () => void;
}) {
  const isProjectManager = useIsProjectManager();
  const isHr = useIsHr();
  const isAdv = useIsAdv();

  if (isProjectManager) {
    return (
      <>
        <div className="col-span-5" />
        <div className="col-span-1" />
        <div className="col-span-2" />
        <div className="col-span-1" />
      </>
    );
  }

  return (
    <>
      <div className="col-span-5" />
      {isAdv ? <div className="col-span-1" /> : null}
      {!isAdv && (
        <UploadMultipleSalarySheetDialog
          missions={missions}
          onUploadSuccess={onUploadSuccess}
          isFournisseur={false}
        />
      )}
      <div className="col-span-2" />
      {!isHr && (
        <UploadMultipleSalarySheetDialog
          missions={missions}
          onUploadSuccess={onUploadSuccess}
          isFournisseur={true}
        />
      )}
    </>
  );
}
