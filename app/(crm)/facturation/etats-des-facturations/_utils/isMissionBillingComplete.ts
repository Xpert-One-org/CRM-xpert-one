import type { FileStatuses, PaymentStatus } from '@/types/mission';
import type { DBMission } from '@/types/typesDb';
import { checkFileStatusForDate } from './checkFileStatusForDate';
import { generateMonthsRange } from './generateMonthsRange';
import { getFileTypeByStatusFacturation } from '../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';

export function isMissionBillingComplete(
  mission: DBMission,
  fileStatuses: FileStatuses
): boolean {
  if (!mission.start_date) return false;

  // Generate all months from start to end (or current date if ongoing, but for archiving we care about end date)
  // If mission has no end date, it can't be archived anyway, but let's be safe.
  const months = generateMonthsRange(
    mission.start_date,
    mission.end_date || undefined
  );

  if (months.length === 0) return false;

  const missionStatus = mission.xpert_associated_status || '';
  const isCdi = missionStatus === 'cdi';

  for (const { year, month } of months) {
    const monthKey = `${year}-${(month + 1).toString().padStart(2, '0')}`;

    // 1. Check Presence Sheet Validated (Common)
    const presenceSheetType = getFileTypeByStatusFacturation(
      'presence_sheet_validated',
      missionStatus
    );
    if (presenceSheetType) {
      const { exists } = checkFileStatusForDate(
        fileStatuses,
        year,
        month,
        false,
        presenceSheetType
      );
      if (!exists) return false;
    }

    // 2. Check Invoice (Fournisseur) (Common)
    const invoiceType = getFileTypeByStatusFacturation(
      'invoice',
      missionStatus
    );
    if (invoiceType) {
      const { exists } = checkFileStatusForDate(
        fileStatuses,
        year,
        month,
        true, // isFournisseur
        invoiceType
      );
      if (!exists) return false;
    }

    // 3. Check Payment (Fournisseur) (Common)
    const fournisseurPayments = Array.isArray(
      mission.facturation_fournisseur_payment
    )
      ? (mission.facturation_fournisseur_payment as PaymentStatus[])
      : [];
    const hasFournisseurPayment = fournisseurPayments.some(
      (p) => p.period === monthKey
    );
    if (!hasFournisseurPayment) return false;

    if (isCdi) {
      // 4a. CDI: Check Salary Sheet
      const salarySheetType = getFileTypeByStatusFacturation(
        'salary_sheet',
        missionStatus
      );
      if (salarySheetType) {
        const { exists } = checkFileStatusForDate(
          fileStatuses,
          year,
          month,
          false,
          salarySheetType
        );
        if (!exists) return false;
      }

      // 5a. CDI: Check Salary Payment
      const salaryPayments = Array.isArray(mission.facturation_salary_payment)
        ? (mission.facturation_salary_payment as PaymentStatus[])
        : [];
      const hasSalaryPayment = salaryPayments.some(
        (p) => p.period === monthKey
      );
      if (!hasSalaryPayment) return false;
    } else {
      // 4b. Non-CDI: Check Invoice Validated
      const invoiceValidatedType = getFileTypeByStatusFacturation(
        'invoice_validated',
        missionStatus
      );
      if (invoiceValidatedType) {
        const { exists } = checkFileStatusForDate(
          fileStatuses,
          year,
          month,
          false,
          invoiceValidatedType
        );
        if (!exists) return false;
      }

      // 5b. Non-CDI: Check Invoice Paid (Payment)
      const invoicePaidPayments = Array.isArray(
        mission.facturation_invoice_paid
      )
        ? (mission.facturation_invoice_paid as PaymentStatus[])
        : [];
      const hasInvoicePaid = invoicePaidPayments.some(
        (p) => p.period === monthKey
      );
      if (!hasInvoicePaid) return false;
    }
  }

  return true;
}
