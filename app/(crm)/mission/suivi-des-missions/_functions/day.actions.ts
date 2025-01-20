export const calculateDaysInfo = (
  startDate: string | null,
  endDate: string | null
): {
  daysUntilStart: number | null;
  isPastStart: boolean;
  daysUntilJPlus10: number | null;
  isPastJPlus10: boolean;
  daysUntilEndPlus10: number | null;
  isPastEndPlus10: boolean;
  daysUntilEndMinus30: number | null;
  isPastEndMinus30: boolean;
} => {
  if (!startDate)
    return {
      daysUntilStart: null,
      isPastStart: false,
      daysUntilJPlus10: null,
      isPastJPlus10: false,
      daysUntilEndPlus10: null,
      isPastEndPlus10: false,
      daysUntilEndMinus30: null,
      isPastEndMinus30: false,
    };

  const start = new Date(startDate);
  const jPlus10 = new Date(start);
  jPlus10.setDate(jPlus10.getDate() + 10);
  const today = new Date();

  const diffTimeStart = start.getTime() - today.getTime();
  const diffTimeJPlus10 = jPlus10.getTime() - today.getTime();

  let endPlus10Info = {
    daysUntilEndPlus10: null as number | null,
    isPastEndPlus10: false,
  };
  let endMinus30Info = {
    daysUntilEndMinus30: null as number | null,
    isPastEndMinus30: false,
  };

  if (endDate) {
    const end = new Date(endDate);
    const endPlus10 = new Date(end);
    endPlus10.setDate(endPlus10.getDate() + 10);
    const endMinus30 = new Date(end);
    endMinus30.setDate(endMinus30.getDate() - 30);

    const diffTimeEndPlus10 = endPlus10.getTime() - today.getTime();
    const diffTimeEndMinus30 = endMinus30.getTime() - today.getTime();

    endPlus10Info = {
      daysUntilEndPlus10: Math.abs(
        Math.ceil(diffTimeEndPlus10 / (1000 * 60 * 60 * 24))
      ),
      isPastEndPlus10: diffTimeEndPlus10 < 0,
    };

    endMinus30Info = {
      daysUntilEndMinus30: Math.abs(
        Math.ceil(diffTimeEndMinus30 / (1000 * 60 * 60 * 24))
      ),
      isPastEndMinus30: diffTimeEndMinus30 < 0,
    };
  }

  return {
    daysUntilStart: Math.abs(Math.ceil(diffTimeStart / (1000 * 60 * 60 * 24))),
    isPastStart: diffTimeStart < 0,
    daysUntilJPlus10: Math.abs(
      Math.ceil(diffTimeJPlus10 / (1000 * 60 * 60 * 24))
    ),
    isPastJPlus10: diffTimeJPlus10 < 0,
    ...endPlus10Info,
    ...endMinus30Info,
  };
};

export const formatEndMissionDisplay = (
  daysInfo: ReturnType<typeof calculateDaysInfo>,
  stage: 'endPlus10' | 'endMinus30'
): string => {
  switch (stage) {
    case 'endPlus10':
      return formatEndPlus10Display(daysInfo);
    case 'endMinus30':
      return formatEndMinus30Display(daysInfo);
    default:
      return '';
  }
};

export const formatDaysDisplay = (
  daysInfo: ReturnType<typeof calculateDaysInfo>,
  isJPlus: boolean
): string => {
  if (daysInfo.daysUntilStart === null) return '';

  // Pour les points J-
  if (!isJPlus) {
    if (daysInfo.daysUntilStart === 0) {
      return "C'est aujourd'hui !";
    }
    if (daysInfo.isPastStart) {
      return `Date passée (${daysInfo.daysUntilStart}j)`;
    }
    return `J-${daysInfo.daysUntilStart}`;
  }

  // Pour les points J+10
  if (daysInfo.daysUntilJPlus10 === 0) {
    return "C'est aujourd'hui !";
  }
  if (daysInfo.isPastJPlus10) {
    return `Date passée (${daysInfo.daysUntilJPlus10}j)`;
  }
  return `J-${daysInfo.daysUntilJPlus10}`;
};

// Format display for End+10 stage
export const formatEndPlus10Display = (
  daysInfo: ReturnType<typeof calculateDaysInfo>
): string => {
  if (daysInfo.daysUntilEndPlus10 === null) return '';
  if (daysInfo.daysUntilEndPlus10 === 0) return "C'est aujourd'hui !";
  if (daysInfo.isPastEndPlus10) {
    return `Point passé (${daysInfo.daysUntilEndPlus10}j)`;
  }
  return `J-${daysInfo.daysUntilEndPlus10}`;
};

// Format display for End-30 stage
export const formatEndMinus30Display = (
  daysInfo: ReturnType<typeof calculateDaysInfo>
): string => {
  if (daysInfo.daysUntilEndMinus30 === null) return '';
  if (daysInfo.daysUntilEndMinus30 === 0) return "C'est aujourd'hui !";
  if (daysInfo.isPastEndMinus30) {
    return `Point passé (${daysInfo.daysUntilEndMinus30}j)`;
  }
  return `J-${daysInfo.daysUntilEndMinus30}`;
};
