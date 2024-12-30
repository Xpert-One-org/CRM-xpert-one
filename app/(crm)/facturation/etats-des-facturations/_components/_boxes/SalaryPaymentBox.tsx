import { Box } from '@/components/ui/box';
import type { PaymentType } from '@/types/mission';
import { formatDate } from '@/utils/date';
import React, { useState, useEffect } from 'react';

type SalaryPaymentBoxProps = {
  selectedMonthYear: {
    month: number;
    year: number;
  };
  xpertAssociatedStatus: string;
  onSalaryPaymentClick?: (isNull: boolean, paymentType: PaymentType) => void;
  isSelected?: boolean;
  isProjectManager: boolean;
};

export default function SalaryPaymentBox({
  selectedMonthYear,
  xpertAssociatedStatus,
  onSalaryPaymentClick,
  isSelected = false,
  isProjectManager,
}: SalaryPaymentBoxProps) {
  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    if (isSelected && !currentDate) {
      setCurrentDate(new Date().toISOString());
    }
    setLocalIsSelected(isSelected);
  }, [isSelected]);

  const handleClick = () => {
    if (isProjectManager || xpertAssociatedStatus !== 'cdi') return;

    setLocalIsSelected(!localIsSelected);
    if (!localIsSelected) {
      setCurrentDate(new Date().toISOString());
      onSalaryPaymentClick?.(false, 'facturation_salary_payment');
    } else {
      setCurrentDate(null);
      onSalaryPaymentClick?.(true, 'facturation_salary_payment');
    }
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

  return xpertAssociatedStatus !== 'cdi' ? (
    <Box className={`size-full bg-[#b1b1b1] text-white`}>{''}</Box>
  ) : (
    <Box
      className={`size-full ${!isProjectManager ? 'cursor-pointer' : ''} text-white ${getBackgroundColor()}`}
      onClick={!isProjectManager ? handleClick : undefined}
    >
      {!localIsSelected
        ? 'NON'
        : localIsSelected && currentDate
          ? formatDate(currentDate)
          : 'NON'}
    </Box>
  );
}
