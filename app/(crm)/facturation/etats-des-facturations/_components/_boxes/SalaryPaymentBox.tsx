import { AuthContext } from '@/components/auth/AuthProvider';
import { Box } from '@/components/ui/box';
import type { PaymentType } from '@/types/mission';
import { formatDate } from '@/utils/date';
import React, { useState, useEffect, useContext } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SalaryPaymentBoxProps = {
  selectedMonthYear: {
    month: number;
    year: number;
  };
  xpertAssociatedStatus: string;
  isSelected?: boolean;
  onSalaryPaymentClick?: (
    isNull: boolean,
    paymentType: PaymentType,
    payload?: { payment_date?: string; period?: string }
  ) => void;
};

export default function SalaryPaymentBox({
  selectedMonthYear,
  xpertAssociatedStatus,
  onSalaryPaymentClick,
  isSelected = false,
}: SalaryPaymentBoxProps) {
  const { isProjectManager, isHr, isAdv, isAdmin } = useContext(AuthContext);
  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateValue, setSelectedDateValue] = useState('');

  useEffect(() => {
    setLocalIsSelected(isSelected);
  }, [isSelected]);

  const handleSetPaid = (date: string) => {
    setLocalIsSelected(true);
    setCurrentDate(date);
    onSalaryPaymentClick?.(false, 'facturation_salary_payment', {
      payment_date: date,
    });
    setPopoverOpen(false);
  };

  const handleClearPaid = () => {
    setLocalIsSelected(false);
    setCurrentDate(null);
    onSalaryPaymentClick?.(true, 'facturation_salary_payment');
    setPopoverOpen(false);
  };

  const getBackgroundColor = () => {
    if (localIsSelected) {
      return 'bg-[#92C6B0]';
    }

    const today = new Date();
    const selectedDate = new Date(
      selectedMonthYear.year,
      selectedMonthYear.month
    );

    const diffInDays = Math.ceil(
      (today.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 15) {
      return 'bg-accent';
    } else if (diffInDays <= 10) {
      return 'bg-[#D64242]';
    }
    return 'bg-[#D64242]';
  };

  const clickDisabled = ((!isHr && isProjectManager) || isAdv) && !isAdmin;

  if (xpertAssociatedStatus !== 'cdi') {
    return <Box className={`size-full bg-[#b1b1b1] text-white`}>{''}</Box>;
  }

  const displayIso = currentDate ?? null;

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="size-full">
          <Box
            className={`size-full ${
              clickDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } text-white ${getBackgroundColor()}`}
          >
            {localIsSelected && displayIso
              ? formatDate(displayIso)
              : localIsSelected
                ? 'PAYÉ'
                : 'NON'}
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
                      handleSetPaid(new Date(selectedDateValue).toISOString());
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
