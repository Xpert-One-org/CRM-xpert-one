import type { calculateDaysInfo } from './day.actions';

// Fonction pour déterminer la couleur de la case pour les J-
export const getBeforeStartColor = (
  daysInfo: ReturnType<typeof calculateDaysInfo>
): string => {
  if (daysInfo.daysUntilStart === null) return '';
  if (daysInfo.isPastStart) return 'bg-[#D64242] text-white'; // Rouge si la date est passée
  if (daysInfo.daysUntilStart <= 0) return 'bg-[#D64242] text-white'; // Rouge à partir de J-5
  if (daysInfo.daysUntilStart <= 10) return 'bg-[#F9A800BF] text-white'; // Orange à partir de J-10
  return '';
};

// Fonction pour déterminer la couleur de la case pour les J+10
export const getAfterStartColor = (
  daysInfo: ReturnType<typeof calculateDaysInfo>
): string => {
  if (daysInfo.daysUntilJPlus10 === null) return '';
  if (daysInfo.isPastJPlus10) return 'bg-[#D64242] text-white'; // Rouge si J+10 est passé
  if (!daysInfo.isPastStart) return ''; // Pas de couleur si la mission n'a pas commencé
  if (daysInfo.daysUntilJPlus10 <= 5) return 'bg-[#F9A800BF] text-white'; // Orange si proche de J+10
  return '';
};

// Fonction pour déterminer la couleur de la case pour les points de fin de mission
export const getEndMissionColor = (
  daysInfo: ReturnType<typeof calculateDaysInfo>,
  stage: 'endPlus10' | 'endMinus30'
): string => {
  switch (stage) {
    case 'endPlus10':
      if (daysInfo.daysUntilEndPlus10 === null) return '';
      if (daysInfo.isPastEndPlus10) return 'bg-[#D64242] text-white'; // Rouge si J+10 est passé
      if (daysInfo.daysUntilEndPlus10 <= 5) return 'bg-[#F9A800BF] text-white'; // Orange si proche de J+10
      return '';
    case 'endMinus30':
      if (daysInfo.daysUntilEndMinus30 === null) return '';
      if (daysInfo.isPastEndMinus30) return 'bg-[#D64242] text-white'; // Rouge si J-30 est passé
      if (daysInfo.daysUntilEndMinus30 <= 10)
        return 'bg-[#F9A800BF] text-white'; // Orange si proche de J-30
      return '';
    default:
      return '';
  }
};
