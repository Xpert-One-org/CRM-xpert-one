'use server';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type { PaymentType } from '@/types/mission';

export async function updateMissionFacturationPayment(
  missionId: number,
  paymentData: { [key: string]: string | null },
  paymentType: PaymentType
) {
  const supabase = await createSupabaseAppServerClient();

  const { data: existingMission } = await supabase
    .from('mission')
    .select(
      'facturation_fournisseur_payment, facturation_salary_payment, facturation_invoice_paid'
    )
    .eq('id', missionId)
    .single();

  const existingPayments = (existingMission?.[paymentType] || []) as {
    period: string;
    payment_date: string;
  }[];

  const updatedPayments = existingPayments
    .filter((payment) => !Object.keys(paymentData).includes(payment.period))
    .concat(
      Object.entries(paymentData)
        .filter(([_, value]) => value !== null)
        .map(([period, payment_date]) => ({
          period,
          payment_date: payment_date as string,
        }))
    );

  const { data, error } = await supabase
    .from('mission')
    .update({
      [paymentType]: updatedPayments,
    })
    .eq('id', missionId);

  if (error) {
    console.error(error);
    throw new Error(`Failed to update ${paymentType} status`);
  }

  return data;
}
