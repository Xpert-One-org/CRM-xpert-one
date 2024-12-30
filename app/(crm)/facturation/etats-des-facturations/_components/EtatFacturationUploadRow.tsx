import React from 'react';
import UploadMultipleSalarySheetDialog from './UploadMultipleSalarySheetDialog';
import type { DBMission } from '@/types/typesDb';

export default function EtatFacturationUploadRow({
  missions,
  onUploadSuccess,
  isProjectManager,
}: {
  missions: DBMission[];
  onUploadSuccess?: () => void;
  isProjectManager: boolean;
}) {
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
      <UploadMultipleSalarySheetDialog
        missions={missions}
        onUploadSuccess={onUploadSuccess}
        isFournisseur={false}
      />
      <div className="col-span-2" />
      <UploadMultipleSalarySheetDialog
        missions={missions}
        onUploadSuccess={onUploadSuccess}
        isFournisseur={true}
      />
    </>
  );
}
