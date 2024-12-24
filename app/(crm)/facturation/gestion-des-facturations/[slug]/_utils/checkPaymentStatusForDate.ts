import type { PaymentStatus } from '@/types/mission';
import type { Json } from '@/types/supabase';

export function checkPaymentStatusForDate(
  payments: Json[] | string | null,
  selectedYear: number,
  selectedMonth: number
) {
  if (!payments || typeof payments === 'string') {
    return {
      exists: false,
      paymentDate: null,
    };
  }

  // Format the period to "YYYY-MM"
  const period = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;

  // Search the payment corresponding to the period
  const payment = payments.find(
    (p) =>
      typeof p === 'object' &&
      p !== null &&
      'period' in p &&
      p.period === period
  ) as PaymentStatus | undefined;

  return {
    exists: !!payment,
    paymentDate: payment?.payment_date || null,
  };
}
