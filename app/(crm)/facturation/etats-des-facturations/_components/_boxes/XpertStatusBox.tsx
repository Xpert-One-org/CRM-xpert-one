import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import type { FileStatuses, PaymentType } from '@/types/mission';
import { useState, useEffect } from 'react';
import {
  useIsProjectManager,
  useIsHr,
  useIsAdv,
  useIsAdmin,
} from '@/hooks/useRoles';
import Loader from '@/components/Loader';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';

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
}: XpertStatusBoxProps) {
  const isProjectManager = useIsProjectManager();
  const isHr = useIsHr();
  const isAdv = useIsAdv();
  const isAdmin = useIsAdmin();

  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const { isLoadingFiles } = useFileStatusFacturationStore();
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
    if (((!isHr && isProjectManager) || isAdv) && !isAdmin) return;
    setLocalIsSelected(!localIsSelected);
    if (!localIsSelected) {
      setCurrentDate(new Date().toISOString());
      onInvoicePaidClick?.(false, 'facturation_invoice_paid');
    } else {
      setCurrentDate(null);
      onInvoicePaidClick?.(true, 'facturation_invoice_paid');
    }
  };

  if (isLoadingFiles) {
    return (
      <Box className="size-full animate-pulse bg-gray-200">
        <></>
      </Box>
    );
  }

  if (isFreelancePortageSide && fileStatus.noFilesFound) {
    if (xpertAssociatedStatus === 'cdi') {
      return <Box className="size-full bg-[#b1b1b1]">{''}</Box>;
    }
    if (onInvoicePaidClick && fileType !== 'salary_sheet') {
      return (
        <Box
          className={`size-full ${
            isAdv
              ? 'cursor-not-allowed'
              : fileType === 'salary_sheet'
                ? 'cursor-default'
                : isHr || !isProjectManager
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
          } text-white ${localIsSelected ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
          onClick={
            isAdv || fileType === 'salary_sheet'
              ? undefined
              : isHr || !isProjectManager
                ? handleClick
                : undefined
          }
        >
          {!localIsSelected
            ? 'NON'
            : localIsSelected && currentDate
              ? formatDate(currentDate)
              : 'NON'}
        </Box>
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
      className={`size-full ${
        isAdv
          ? 'cursor-not-allowed'
          : fileType !== 'salary_sheet'
            ? 'cursor-default'
            : isHr || !isProjectManager
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
      } text-white ${fileStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
      onClick={
        isAdv || fileType === 'salary_sheet'
          ? undefined
          : isHr || !isProjectManager
            ? handleClick
            : undefined
      }
    >
      {fileStatus.exists
        ? formatDate(fileStatus.createdAt!)
        : fileStatus.noFilesFound
          ? ''
          : 'NON'}
    </Box>
  );
}
