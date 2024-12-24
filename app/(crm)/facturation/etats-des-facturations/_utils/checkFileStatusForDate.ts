import type { FileStatuses, FileType } from '@/types/mission';

export function checkFileStatusForDate(
  fileStatuses: FileStatuses,
  year: number,
  month: number,
  isFournisseur: boolean,
  fileType: FileType
) {
  const files = isFournisseur
    ? fileStatuses[fileType]?.fournisseurFiles || []
    : fileStatuses[fileType]?.xpertFiles || [];

  const file = files.find((f) => f.year === year && f.month === month);

  return {
    exists: !!file,
    createdAt: file?.createdAt,
    noFilesFound: files.length === 0,
  };
}
