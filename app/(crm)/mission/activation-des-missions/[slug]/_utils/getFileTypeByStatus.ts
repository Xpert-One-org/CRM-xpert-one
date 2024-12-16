import type { FileType } from '@/types/mission';

export const getFileTypeByStatus = (
  baseType: string,
  status: string
): FileType => {
  switch (status) {
    case 'cdi':
      return `${baseType}_cdi` as FileType;
    case 'freelance':
      return `${baseType}_freelance` as FileType;
    case 'portage':
      return `${baseType}_portage` as FileType;
    default:
      return `${baseType}_cdi` as FileType;
  }
};
