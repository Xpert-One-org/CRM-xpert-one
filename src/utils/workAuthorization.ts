const EU_EEA_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO', // EEA
  'CH', // Switzerland
];

export function isAuthorizedToWorkInFrance(
  countryCode: string | null | undefined
): boolean | null {
  if (!countryCode) return null;
  return EU_EEA_COUNTRIES.includes(countryCode.toUpperCase());
}
