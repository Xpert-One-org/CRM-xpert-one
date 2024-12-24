import { checkFileExistsForDate } from './checkFileExistsForDate';
import type { FileStatuses } from '@/types/mission';
import { getFileTypeByStatusFacturation } from './getFileTypeByStatusFacturation';
import { checkPaymentStatusForDate } from './checkPaymentStatusForDate';
import type { DBMission } from '@/types/typesDb';

export function checkMonthFilesStatus(
  fileStatuses: FileStatuses,
  year: number,
  month: number,
  missionData: DBMission | undefined
): boolean {
  const missionXpertAssociatedStatus =
    missionData?.xpert_associated_status ?? '';

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
        missionXpertAssociatedStatus === 'cdi'
          ? 'salary_sheet'
          : 'invoice_received',
        missionXpertAssociatedStatus
      )
    ]?.xpertFiles || [],
    year,
    month
  );

  const paymentStatusXpert = checkPaymentStatusForDate(
    missionXpertAssociatedStatus === 'cdi'
      ? (missionData?.facturation_salary_payment ?? [])
      : (missionData?.facturation_invoice_paid ?? []),
    year,
    month
  );

  const paymentStatusFournisseur = checkPaymentStatusForDate(
    missionData?.facturation_fournisseur_payment ?? [],
    year,
    month
  );

  return (
    invoiceStatus.exists &&
    presenceSheetStatus.exists &&
    salaryOrInvoiceStatus.exists &&
    paymentStatusXpert.exists &&
    paymentStatusFournisseur.exists
  );
}
