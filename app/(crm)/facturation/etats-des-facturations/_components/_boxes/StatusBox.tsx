import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import type { FileStatuses, PaymentType } from '@/types/mission';
import { useState, useEffect } from 'react';
import { useIsProjectManager, useIsAdv, useIsAdmin } from '@/hooks/useRoles';

type StatusBoxProps = {
  fileStatuses: FileStatuses;
  selectedMonthYear: { month: number; year: number };
  fileType: string;
  isFournisseur?: boolean;
  xpertAssociatedStatus: string;
  isSalaryPayment?: boolean;
  onSalaryPaymentClick?: (isNull: boolean, paymentType: PaymentType) => void;
  isSelected?: boolean;
};

export default function StatusBox({
  fileStatuses,
  selectedMonthYear,
  fileType,
  isFournisseur = false,
  xpertAssociatedStatus,
  isSalaryPayment = false,
  onSalaryPaymentClick,
  isSelected = false,
}: StatusBoxProps) {
  const isProjectManager = useIsProjectManager();
  const isAdv = useIsAdv();
  const isAdmin = useIsAdmin();

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

  if (isSalaryPayment) {
    const handleClick = () => {
      if ((isProjectManager || !isAdv) && !isAdmin) return;
      setLocalIsSelected(!localIsSelected);
      if (!localIsSelected) {
        setCurrentDate(new Date().toISOString());
        onSalaryPaymentClick?.(false, 'facturation_fournisseur_payment');
      } else {
        setCurrentDate(null);
        onSalaryPaymentClick?.(true, 'facturation_fournisseur_payment');
      }
    };

    return (
      <Box
        className={`size-full ${
          (isProjectManager || !isAdv) && !isAdmin
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        } text-white ${localIsSelected ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
        onClick={
          (isProjectManager || !isAdv) && !isAdmin ? undefined : handleClick
        }
      >
        {!localIsSelected
          ? 'NON REÇU'
          : localIsSelected && currentDate
            ? formatDate(currentDate)
            : 'NON REÇU'}
      </Box>
    );
  }

  if (fileStatus.noFilesFound) {
    return (
      <Box className="size-full bg-[#D64242] text-white">
        {isSalaryPayment ? 'NON REÇU' : 'NON'}
      </Box>
    );
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
