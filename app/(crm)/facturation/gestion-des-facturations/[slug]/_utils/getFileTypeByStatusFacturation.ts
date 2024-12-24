import type { FileType } from '@/types/mission';

export const getFileTypeByStatusFacturation = (
  fileType: string,
  status: string
): FileType => {
  switch (status) {
    case 'cdi':
      return `${fileType}_cdi` as FileType;
    case 'freelance':
      return `${fileType}_freelance_portage` as FileType;
    case 'portage':
      return `${fileType}_freelance_portage` as FileType;
    default:
      return `${fileType}_cdi` as FileType;
  }
};
