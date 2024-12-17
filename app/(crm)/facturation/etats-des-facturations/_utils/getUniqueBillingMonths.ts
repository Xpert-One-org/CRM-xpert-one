import type { FileStatuses } from '@/types/mission';

export const getUniqueBillingMonths = (fileStatuses: FileStatuses) => {
  const months = new Set<string>();

  Object.values(fileStatuses).forEach((status: any) => {
    ['xpertFiles', 'fournisseurFiles'].forEach((fileType) => {
      status[fileType]?.forEach((file: any) => {
        months.add(`${file.year}-${file.month}`);
      });
    });
  });

  return Array.from(months)
    .map((monthStr) => {
      const [year, month] = monthStr.split('-').map(Number);
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
};
