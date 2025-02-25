'use client';

import type { DBMission } from '@/types/typesDb';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { generateMonthsRange } from '../../facturation/etats-des-facturations/_utils/generateMonthsRange';
import { checkFileStatusForDate } from '../../facturation/etats-des-facturations/_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../facturation/gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import DashBoardCards from './DashBoardCards';
import FacturationLogo from '@/components/svg/Facturation';
import { useEffect } from 'react';

export default function FacturationCard({
  missions,
}: {
  missions: DBMission[];
}) {
  const { fileStatusesByMission, checkAllMissionsFiles } =
    useFileStatusFacturationStore();

  useEffect(() => {
    checkAllMissionsFiles(missions);
  }, [missions, checkAllMissionsFiles]);

  let delayedCount = 0;
  let totalCount = 0;

  missions.forEach((mission) => {
    if (!mission.start_date || !mission.end_date) return;

    const months = generateMonthsRange(mission.start_date, mission.end_date);
    const today = new Date();

    months.forEach(({ year, month }) => {
      const monthDate = new Date(year, month);

      // Ne vérifier que les mois passés (pas les mois en cours ou futurs)
      if (monthDate >= today) return;

      // Ajouter un délai de grâce (15 jours après la fin du mois)
      const graceDeadline = new Date(year, month + 1, 15);
      const isOverdue = today > graceDeadline;

      const monthKey = `${year}-${(month + 1).toString().padStart(2, '0')}`;
      const fileStatuses =
        fileStatusesByMission[mission.mission_number || ''] || {};

      // Vérification des fichiers côté XPERT
      const presenceStatus = checkFileStatusForDate(
        fileStatuses,
        year,
        month,
        false,
        getFileTypeByStatusFacturation(
          'presence_sheet_validated',
          mission.xpert_associated_status || ''
        )
      );

      const invoiceStatus = checkFileStatusForDate(
        fileStatuses,
        year,
        month,
        true,
        getFileTypeByStatusFacturation(
          'invoice',
          mission.xpert_associated_status || ''
        )
      );

      const fournisseurInvoiceStatus = checkFileStatusForDate(
        fileStatuses,
        year,
        month,
        true,
        getFileTypeByStatusFacturation(
          'invoice',
          mission.xpert_associated_status || ''
        )
      );

      // Vérification des paiements
      const xpertPaymentStatus = mission.facturation_salary_payment?.some(
        (payment) => (payment as { period: string })?.period === monthKey
      );

      const fournisseurPaymentStatus =
        mission.facturation_fournisseur_payment?.some(
          (payment) => (payment as { period: string })?.period === monthKey
        );

      const hasIncompleteDocuments =
        !presenceStatus.exists ||
        !invoiceStatus.exists ||
        !fournisseurInvoiceStatus.exists ||
        !xpertPaymentStatus ||
        !fournisseurPaymentStatus;

      // Compter comme en retard seulement si date dépassée ET documents manquants
      if (hasIncompleteDocuments) {
        totalCount++;

        if (isOverdue) {
          delayedCount++;
        }
      }
    });
  });

  return (
    <DashBoardCards
      count={totalCount}
      title="Gestion de facturations"
      urgentTitle="Retards"
      urgentCount={delayedCount}
      buttonTitle="Gestion de facturations"
      iconButton={
        <FacturationLogo className="fill-white" width={24} height={24} />
      }
      link="/facturation/etats-des-facturations"
    />
  );
}
