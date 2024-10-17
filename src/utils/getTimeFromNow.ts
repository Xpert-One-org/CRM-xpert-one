export const getTimeFromNow = (date: string) => {
  const dateNow = new Date();
  const dateMessage = new Date(date);
  const diff = dateNow.getTime() - dateMessage.getTime();
  const diffMinutes = diff / (1000 * 60);
  if (diffMinutes < 1) return "Il y a moins d'une minute";
  if (diffMinutes < 60) return `Il y a ${Math.floor(diffMinutes)} minutes`;
  const diffHours = diffMinutes / 60;
  if (diffHours < 24) return `Il y a ${Math.floor(diffHours)} heures`;
  const diffDays = diffHours / 24;
  if (diffDays < 7) return `Il y a ${Math.floor(diffDays)} jours`;
  const diffWeeks = diffDays / 7;
  if (diffWeeks < 4) return `Il y a ${Math.floor(diffWeeks)} semaines`;
  const diffMonths = diffWeeks / 4;
  if (diffMonths < 12) return `Il y a ${Math.floor(diffMonths)} mois`;
  const diffYears = diffMonths / 12;
  return `Il y a ${Math.floor(diffYears)} ans`;
};
