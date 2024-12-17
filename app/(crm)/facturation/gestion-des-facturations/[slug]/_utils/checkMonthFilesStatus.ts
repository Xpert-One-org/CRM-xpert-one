import { checkFileExistsForDate } from './checkFileExistsForDate';
import type { FileStatuses } from '@/types/mission';

export function checkMonthFilesStatus(
  fileStatuses: FileStatuses,
  year: number,
  month: number,
  status: string
): boolean {
  const invoiceStatus = checkFileExistsForDate(
    fileStatuses['invoice']?.fournisseurFiles || [],
    year,
    month
  );

  const presenceSheetStatus = checkFileExistsForDate(
    fileStatuses['presence_sheet_signed']?.xpertFiles || [],
    year,
    month
  );

  const salaryOrInvoiceStatus = checkFileExistsForDate(
    fileStatuses[status === 'cdi' ? 'salary_sheet' : 'invoice_received']
      ?.xpertFiles || [],
    year,
    month
  );

  return (
    invoiceStatus.exists &&
    presenceSheetStatus.exists &&
    salaryOrInvoiceStatus.exists
  );
}
