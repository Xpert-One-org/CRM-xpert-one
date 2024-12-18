import { checkFileExistsForDate } from './checkFileExistsForDate';
import type { FileStatuses } from '@/types/mission';
import { getFileTypeByStatusFacturation } from './getFileTypeByStatusFacturation';

export function checkMonthFilesStatus(
  fileStatuses: FileStatuses,
  year: number,
  month: number,
  status: string,
  missionXpertAssociatedStatus: string
): boolean {
  const invoiceStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation('invoice', missionXpertAssociatedStatus)
    ]?.fournisseurFiles || [],
    year,
    month
  );

  const presenceSheetStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation(
        'presence_sheet_validated',
        missionXpertAssociatedStatus
      )
    ]?.xpertFiles || [],
    year,
    month
  );

  const salaryOrInvoiceStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation(
        status === 'cdi' ? 'salary_sheet' : 'invoice_received',
        missionXpertAssociatedStatus
      )
    ]?.xpertFiles || [],
    year,
    month
  );

  return (
    invoiceStatus.exists &&
    presenceSheetStatus.exists &&
    salaryOrInvoiceStatus.exists
  );
}
