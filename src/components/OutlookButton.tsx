'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import OutlookMailLogo from './svg/OutlookMailLogo';
import OutlookCalendarLogo from './svg/OutlookCalendarLogo';

type OutlookButtonProps = {
  type: 'calendar' | 'mail';
};

export default function OutlookButton({ type }: OutlookButtonProps) {
  const config = {
    calendar: {
      url: 'https://outlook.office.com/calendar/view/month',
      text: 'Ouvrir le calendrier Outlook',
    },
    mail: {
      url: 'https://outlook.office.com/mail/',
      text: 'Ouvrir la boite mail Outlook',
    },
  };

  const handleClick = () => {
    window.open(config[type].url, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className="flex w-full items-center gap-2 border border-[#014EA4] bg-[white] text-[#1493DF] hover:bg-[#014EA4]/10"
    >
      {type === 'mail' ? <OutlookMailLogo /> : <OutlookCalendarLogo />}
      {config[type].text}
    </Button>
  );
}
