export function formatPhoneNumber(
  phoneNumber: string | null | undefined
): string {
  if (!phoneNumber) return '';

  // Supprimer tous les caractères non numériques sauf le +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Si c'est un numéro français (+33)
  if (cleaned.startsWith('+33')) {
    const numbers = cleaned.slice(3); // Enlever le +33
    const groups = numbers.match(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/);

    if (groups) {
      return `+33 ${groups[1]} ${groups[2]} ${groups[3]} ${groups[4]} ${
        groups[5]
      }`;
    }
  }

  // Pour les autres formats, retourner le numéro tel quel
  return cleaned;
}
