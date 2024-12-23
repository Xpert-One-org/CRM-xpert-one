import { Box } from '@/components/ui/box';
import React from 'react';

type SalaryPaymentBoxProps = {
  selectedMonthYear: {
    month: number;
    year: number;
  };
  xpertAssociatedStatus: string;
};

export default function SalaryPaymentBox({
  selectedMonthYear,
  xpertAssociatedStatus,
}: SalaryPaymentBoxProps) {
  const getBackgroundColor = () => {
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
    <Box className={`size-full text-white ${getBackgroundColor()}`}>
      {'NON'}
    </Box>
  );
}
