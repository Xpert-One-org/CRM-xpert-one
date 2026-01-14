'use client';
import { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@/components/ui/box';
import { formatDate } from '@/utils/date';
import { AuthContext } from '@/components/auth/AuthProvider';
import type { PaymentStatus, PaymentType, FileStatuses } from '@/types/mission';
import { checkFileStatusForDate } from '../../_utils/checkFileStatusForDate';
import { getFileTypeByStatusFacturation } from '../../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type StatusBoxProps = {
  fileStatuses: FileStatuses;
  missionNumber?: string;
  selectedMonthYear: { month: number; year: number };
  fileType: string;
  isFournisseur?: boolean;
  xpertAssociatedStatus: string;
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateValue, setSelectedDateValue] = useState('');

  const handleSetPaid = (date: string) => {
    setLocalIsSelected(true);
    setCurrentDate(date);
    onSalaryPaymentClick?.(false, 'facturation_fournisseur_payment', {
      payment_date: date,
      period: periodKey,
    });
    setPopoverOpen(false);
  };

  const handleClearPaid = () => {
    setLocalIsSelected(false);
    setCurrentDate(null);
    onSalaryPaymentClick?.(true, 'facturation_fournisseur_payment', {
      period: periodKey,
    });
    setPopoverOpen(false);
  };

  // ----- Rendu salaire -----
  if (isSalaryPayment) {
    // Privilégier la date DB, sinon la date locale optimiste
    const displayIso = paymentForPeriod?.payment_date ?? currentDate ?? null;

    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="size-full">
            <Box
              className={`size-full ${clickDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-white ${
                localIsSelected ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
              }`}
            >
              {localIsSelected && displayIso
                ? formatDate(displayIso)
                : 'NON REÇU'}
            </Box>
          </div>
        </PopoverTrigger>
        {!clickDisabled && (
          <PopoverContent className="w-60">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Marquer comme reçu :</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetPaid(new Date().toISOString())}
              >
                Aujourd'hui
              </Button>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">
                  Autre date :
                </span>
                <div className="flex gap-1">
                  <Input
                    type="date"
                    className="h-8 flex-1 p-1 text-xs"
                    value={selectedDateValue}
                    onChange={(e) => setSelectedDateValue(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="h-8 px-2"
                    disabled={!selectedDateValue}
                    onClick={() => {
                      if (selectedDateValue) {
                        handleSetPaid(
                          new Date(selectedDateValue).toISOString()
                        );
                        setSelectedDateValue('');
                      }
                    }}
                  >
                    OK
                  </Button>
                </div>
              </div>
              {localIsSelected && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearPaid}
                  className="mt-2"
                >
                  Annuler le paiement
                </Button>
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>
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
