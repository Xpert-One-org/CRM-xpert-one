'use client';
import { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { AuthContext } from '@/components/auth/AuthProvider';
import type { PaymentStatus, PaymentType, FileStatuses } from '@/types/mission';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';

type StatusBoxProps = {
  fileStatuses: FileStatuses;
  missionNumber?: string;
  selectedMonthYear: { month: number; year: number };
  fileType: string;
  isFournisseur?: boolean;
  xpertAssociatedStatus: string;
  isSelected?: boolean;
  isSalaryPayment?: boolean;
  onSalaryPaymentClick?: (
    isNull: boolean,
    paymentType: PaymentType,
    payload?: { payment_date?: string; period?: string }
  ) => void;
  mission_fournisseur_payment_date?: PaymentStatus[];
};

export default function StatusBox(props: StatusBoxProps) {
  const {
    fileStatuses,
    missionNumber,
    selectedMonthYear,
    mission_fournisseur_payment_date,
    fileType,
    isFournisseur = false,
    xpertAssociatedStatus,
    isSelected = false,
    isSalaryPayment = false,
    onSalaryPaymentClick,
  } = props;

  const { isProjectManager, isAdv, isAdmin } = useContext(AuthContext);

  // état local pour UI optimiste
  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  // clé période normalisée
  const periodKey = useMemo(
    () =>
      `${selectedMonthYear.year}-${String(selectedMonthYear.month + 1).padStart(2, '0')}`,
    [selectedMonthYear.year, selectedMonthYear.month]
  );

  // entrée DB pour la période
  const paymentForPeriod = useMemo(
    () =>
      mission_fournisseur_payment_date?.find((p) => p.period === periodKey) ??
      null,
    [mission_fournisseur_payment_date, periodKey]
  );

  // Sync depuis la DB - FIX: dépendances correctes
  useEffect(() => {
    if (!isSalaryPayment) return;

    if (paymentForPeriod?.payment_date) {
      setLocalIsSelected(true);
      setCurrentDate(paymentForPeriod.payment_date);
    } else {
      setLocalIsSelected(false);
      setCurrentDate(null);
    }
  }, [
    isSalaryPayment,
    paymentForPeriod?.payment_date,
    periodKey, // Important: si la période change, on resync
    missionNumber, // Important: si la mission change, on resync
  ]);

  const clickDisabled = (isProjectManager || !isAdv) && !isAdmin;

  const handleSalaryClick = () => {
    if (clickDisabled) return;

    // Si déjà payé, on annule (optimiste)
    if (localIsSelected) {
      setLocalIsSelected(false);
      setCurrentDate(null);
      onSalaryPaymentClick?.(true, 'facturation_fournisseur_payment', {
        period: periodKey,
      });
      return;
    }

    // Sinon, on active avec la date du jour (optimiste)
    const nowIso = new Date().toISOString();
    setLocalIsSelected(true);
    setCurrentDate(nowIso);
    onSalaryPaymentClick?.(false, 'facturation_fournisseur_payment', {
      payment_date: nowIso,
      period: periodKey,
    });
  };

  // ----- Rendu salaire -----
  if (isSalaryPayment) {
    // Privilégier la date DB, sinon la date locale optimiste
    const displayIso = paymentForPeriod?.payment_date ?? currentDate ?? null;

    return (
      <Box
        className={`size-full ${clickDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-white ${
          localIsSelected ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
        onClick={clickDisabled ? undefined : handleSalaryClick}
      >
        {localIsSelected && displayIso ? formatDate(displayIso) : 'NON REÇU'}
      </Box>
    );
  }

  // ----- Rendu non-salaire (inchangé) -----
  const fileStatus = checkFileStatusForDate(
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    isFournisseur,
    getFileTypeByStatusFacturation(fileType, xpertAssociatedStatus)
  );

  if (fileStatus.noFilesFound) {
    return <Box className="size-full bg-[#D64242] text-white">NON</Box>;
  }

  return (
    <Box
      className={`size-full text-white ${fileStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
    >
      {fileStatus.exists
        ? formatDate(fileStatus.createdAt!)
        : fileStatus.noFilesFound
          ? ''
          : 'NON'}
    </Box>
  );
}
