import React from 'react';
import UploadMultipleSalarySheetDialog from './UploadMultipleSalarySheetDialog';
import type { DBMission } from '@/types/typesDb';

export default function EtatFacturationUploadRow({
  missions,
  onUploadSuccess,
}: {
  missions: DBMission[];
  onUploadSuccess?: () => void;
}) {
  return (
    <>
      <div className="col-span-5" />
      <UploadMultipleSalarySheetDialog
        missions={missions}
        onUploadSuccess={onUploadSuccess}
      />
      <div className="col-span-2" />
      <UploadMultipleSalarySheetDialog
        missions={missions}
        onUploadSuccess={onUploadSuccess}
      />
    </>
  );
}
