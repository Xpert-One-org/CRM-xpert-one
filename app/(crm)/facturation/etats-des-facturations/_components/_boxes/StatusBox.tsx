import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import type { FileStatuses } from '@/types/mission';

type StatusBoxProps = {
  fileStatuses: FileStatuses;
  selectedMonthYear: { month: number; year: number };
  fileType: string;
  isFournisseur?: boolean;
  xpertAssociatedStatus: string;
  isSalaryPayment?: boolean;
};

export default function StatusBox({
  fileStatuses,
  selectedMonthYear,
  fileType,
  isFournisseur = false,
  xpertAssociatedStatus,
  isSalaryPayment = false,
}: StatusBoxProps) {
  const fileStatus = checkFileStatusForDate(
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    isFournisseur,
    getFileTypeByStatusFacturation(fileType, xpertAssociatedStatus)
  );

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
