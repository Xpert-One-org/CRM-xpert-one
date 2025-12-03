// app/(wherever)/XpertStatusBox.tsx
'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import type { FileStatuses, PaymentType } from '@/types/mission';
import { AuthContext } from '@/components/auth/AuthProvider';

type XpertStatusBoxProps = {
  fileStatuses: FileStatuses | undefined;
  selectedMonthYear: { month: number; year: number };
  fileType: string; // ex: 'salary_sheet' | 'invoice_validated' | 'invoice_paid' ...
  isFournisseur?: boolean;
  isCdiSide?: boolean;
  isFreelancePortageSide?: boolean;
  xpertAssociatedStatus: string; // ex: 'cdi' | 'freelance' ...
  onInvoicePaidClick?: (isNull: boolean, paymentType: PaymentType) => void;
  isSelected?: boolean; // pour le mode toggle invoice_paid (pilotage externe)
  paymentDate?: string | null;
};

export default function XpertStatusBox({
  fileStatuses,
  selectedMonthYear,
  fileType,
  isFournisseur = false,
  isFreelancePortageSide = false,
  xpertAssociatedStatus,
  onInvoicePaidClick,
  isSelected = false,
  paymentDate,
}: XpertStatusBoxProps) {
  const { isProjectManager, isHr, isAdv } = useContext(AuthContext);

  // --- État local pour le mode "toggle" (invoice_paid côté XPERT) ---
  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  // On synchronise uniquement l'état booléen depuis l'extérieur (AUCUNE date du jour au montage)
  useEffect(() => {
    setLocalIsSelected(isSelected);
    if (paymentDate) {
      setCurrentDate(paymentDate);
    } else {
      setCurrentDate(null);
    }
  }, [isSelected, paymentDate]);

  // --- Résolution du type de fichier/colonne à checker ---
  const resolvedType = useMemo(
    () => getFileTypeByStatusFacturation(fileType, xpertAssociatedStatus),
    [fileType, xpertAssociatedStatus]
  );

  // --- Calcul du statut fichier pour la période (si applicable) ---
  // On réserve l'état "pulse" uniquement à l’absence de fileStatuses (chargement réel).
  // Si pas de mapping (resolvedType falsy), on retourne un status "N/A" (noFilesFound) mais statique (gris).
  const fileStatus = useMemo(() => {
    if (!fileStatuses) return null; // chargement
    if (!resolvedType) {
      return {
        exists: false,
        noFilesFound: true,
        createdAt: null as string | null,
      };
    }
    return checkFileStatusForDate(
      fileStatuses,
      selectedMonthYear.year,
      selectedMonthYear.month,
      isFournisseur,
      resolvedType
    );
  }, [
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    isFournisseur,
    resolvedType,
  ]);

  // --- Cas particulier : colonne "invoice_paid" côté XPERT -> toggle cliquable ---
  const isXpertInvoicePaidToggle =
    isFreelancePortageSide &&
    fileType === 'invoice_paid' &&
    typeof onInvoicePaidClick === 'function';

  if (isXpertInvoicePaidToggle) {
    // Règle de permission (garde ta logique existante)
    const clickable = !isAdv && (isHr || !isProjectManager);

    const handleToggle = () => {
      if (!clickable) return;
      setLocalIsSelected((prev) => !prev);

      if (!localIsSelected) {
        // activation -> date du jour
        const now = new Date().toISOString();
        setCurrentDate(now);
        onInvoicePaidClick?.(false, 'facturation_invoice_paid');
      } else {
        // désactivation -> suppression date
        setCurrentDate(null);
        onInvoicePaidClick?.(true, 'facturation_invoice_paid');
      }
    };

    const label = !localIsSelected
      ? 'NON'
      : currentDate
        ? formatDate(currentDate)
        : 'OUI';

    return (
      <Box
        className={`size-full ${
          clickable ? 'cursor-pointer' : 'cursor-not-allowed'
        } text-white ${localIsSelected ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
        onClick={clickable ? handleToggle : undefined}
      >
        {label}
      </Box>
    );
  }

  // ==========================
  // Affichages génériques (non-toggle)
  // ==========================

  // 1) CHARGEMENT réel -> pulse
  if (!fileStatuses) {
    return (
      <Box className="size-full animate-pulse bg-gray-200">
        <></>
      </Box>
    );
  }

  // 2) Si pas de mapping -> N/A gris statique
  if (!resolvedType) {
    return (
      <Box className="size-full bg-gray-200">
        <></>
      </Box>
    );
  }

  // 3) Fallback de sécurité si jamais le mémo revient null
  const safeStatus =
    fileStatus ??
    ({ exists: false, noFilesFound: true, createdAt: null } as const);

  // 4) Aucun fichier trouvé
  if (safeStatus.noFilesFound) {
    // Cas particulier CDI: tu affiches "NON" en rouge
    if (xpertAssociatedStatus === 'cdi' && fileType === 'salary_sheet') {
      return <Box className="size-full bg-[#D64242] text-white">NON</Box>;
    }
    // Sinon, case grise (statique)
    return (
      <Box className="size-full bg-[#b1b1b1]">
        <></>
      </Box>
    );
  }

  // 5) Fichier trouvé
  const clickable =
    !isAdv &&
    (resolvedType === 'salary_sheet' ? isHr || !isProjectManager : false);

  const handleClickSalary = () => {
    /* ajoute ici ta logique si tu veux un handler */
  };

  return (
    <Box
      className={`size-full ${
        clickable
          ? 'cursor-pointer'
          : resolvedType === 'salary_sheet'
            ? 'cursor-not-allowed'
            : 'cursor-default'
      } text-white ${safeStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
      onClick={clickable ? handleClickSalary : undefined}
    >
      {safeStatus.exists ? formatDate(safeStatus.createdAt!) : 'NON'}
    </Box>
  );
}
