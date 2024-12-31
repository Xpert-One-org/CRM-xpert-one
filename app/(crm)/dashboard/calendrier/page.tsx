'use client';

import React from 'react';
import OutlookButton from '@/components/OutlookButton';

export default function DashboardCalendrierPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <OutlookButton type="calendar" />
    </div>
  );
}
