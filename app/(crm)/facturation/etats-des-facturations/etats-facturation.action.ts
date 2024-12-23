'use server';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function updateMissionFacturationPayment(
  missionId: number,
  paymentData: { [key: string]: string | null }
) {
  const supabase = await createSupabaseAppServerClient();

  const { data: existingMission } = await supabase
    .from('mission')
    .select('facturation_fournisseur_payment')
    .eq('id', missionId)
    .single();

  const existingPayments = (existingMission?.facturation_fournisseur_payment ||
    []) as {
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
      facturation_fournisseur_payment: updatedPayments,
    })
    .eq('id', missionId);

  if (error) {
    throw new Error('Failed to update payment status');
  }

  return data;
}
