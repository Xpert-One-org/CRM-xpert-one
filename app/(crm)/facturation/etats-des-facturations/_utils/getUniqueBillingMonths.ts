import { generateMonthsRange } from './generateMonthsRange';
import type { FileStatuses } from '@/types/mission';
import type { DBMission } from '@/types/typesDb';

export const getUniqueBillingMonths = (
  fileStatuses: FileStatuses,
  mission: DBMission
) => {
  const allMissionMonths = generateMonthsRange(
    mission.start_date || '',
    mission.end_date || ''
  );

  const fileMonths = new Set<string>();
  Object.values(fileStatuses).forEach((status: any) => {
    ['xpertFiles', 'fournisseurFiles'].forEach((fileType) => {
      status[fileType]?.forEach((file: any) => {
        fileMonths.add(`${file.year}-${file.month}`);
      });
    });
  });

  return allMissionMonths.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};
