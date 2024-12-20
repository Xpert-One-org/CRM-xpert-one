import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import type { FileStatuses } from '@/types/mission';

type XpertStatusBoxProps = {
  fileStatuses: FileStatuses;
  selectedMonthYear: { month: number; year: number };
  fileType: string;
  isFournisseur?: boolean;
  isCdiSide?: boolean;
  isFreelancePortageSide?: boolean;
  xpertAssociatedStatus: string;
};

export default function XpertStatusBox({
  fileStatuses,
  selectedMonthYear,
  fileType,
  isFournisseur = false,
  isCdiSide = false,
  isFreelancePortageSide = false,
  xpertAssociatedStatus,
}: XpertStatusBoxProps) {
  const fileStatus = checkFileStatusForDate(
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    isFournisseur,
    getFileTypeByStatusFacturation(fileType, xpertAssociatedStatus)
  );

  if (isFreelancePortageSide && fileStatus.noFilesFound) {
    if (xpertAssociatedStatus === 'cdi') {
      return <Box className="size-full bg-[#b1b1b1]">{''}</Box>;
    }
    return <Box className="size-full bg-[#D64242] text-white">{'NON'}</Box>;
  }

  if (isCdiSide && fileStatus.noFilesFound) {
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
