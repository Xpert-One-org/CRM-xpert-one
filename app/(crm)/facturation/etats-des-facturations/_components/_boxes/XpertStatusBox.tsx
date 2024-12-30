import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import type { FileStatuses, PaymentType } from '@/types/mission';
import { useState, useEffect } from 'react';

type XpertStatusBoxProps = {
  fileStatuses: FileStatuses;
  selectedMonthYear: { month: number; year: number };
  fileType: string;
  isFournisseur?: boolean;
  isCdiSide?: boolean;
  isFreelancePortageSide?: boolean;
  xpertAssociatedStatus: string;
  onInvoicePaidClick?: (isNull: boolean, paymentType: PaymentType) => void;
  isSelected?: boolean;
  isProjectManager?: boolean;
};

export default function XpertStatusBox({
  fileStatuses,
  selectedMonthYear,
  fileType,
  isFournisseur = false,
  isFreelancePortageSide = false,
  xpertAssociatedStatus,
  onInvoicePaidClick,
  isSelected = false,
  isProjectManager = false,
}: XpertStatusBoxProps) {
  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    if (isSelected && !currentDate) {
      setCurrentDate(new Date().toISOString());
    }
    setLocalIsSelected(isSelected);
  }, [isSelected]);

  const fileStatus = checkFileStatusForDate(
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    isFournisseur,
    getFileTypeByStatusFacturation(fileType, xpertAssociatedStatus)
  );

  const handleClick = () => {
    if (isProjectManager) return;

    setLocalIsSelected(!localIsSelected);
    if (!localIsSelected) {
      setCurrentDate(new Date().toISOString());
      onInvoicePaidClick?.(false, 'facturation_invoice_paid');
    } else {
      setCurrentDate(null);
      onInvoicePaidClick?.(true, 'facturation_invoice_paid');
    }
  };

  if (isFreelancePortageSide && fileStatus.noFilesFound) {
    if (xpertAssociatedStatus === 'cdi') {
      return <Box className="size-full bg-[#b1b1b1]">{''}</Box>;
    }
    if (onInvoicePaidClick) {
      return (
        <>
          <Box
            className={`size-full ${!isProjectManager ? 'cursor-pointer' : ''} text-white ${
              localIsSelected ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
            }`}
            onClick={!isProjectManager ? handleClick : undefined}
          >
            {!localIsSelected
              ? 'NON'
              : localIsSelected && currentDate
                ? formatDate(currentDate)
                : 'NON'}
          </Box>
        </>
      );
    } else {
      return <Box className="size-full bg-[#D64242] text-white">{'NON'}</Box>;
    }
  }

  if (fileStatus.noFilesFound) {
    if (xpertAssociatedStatus !== 'cdi') {
      return <Box className="size-full bg-[#b1b1b1]">{''}</Box>;
    }
    return <Box className="size-full bg-[#D64242] text-white">{'NON'}</Box>;
  }

  return (
    <Box
      className={`size-full text-white ${
        fileStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
      }`}
    >
      {fileStatus.exists
        ? formatDate(fileStatus.createdAt!)
        : fileStatus.noFilesFound
          ? ''
          : 'NON'}
    </Box>
  );
}
