export const convertStatusXpertValue = (value: string) => {
  switch (value) {
    case 'cdi':
      return 'CDI DE MISSION';
    case 'freelance':
      return 'FREELANCE';
    case 'portage':
      return 'PORTAGE';
    default:
      return value;
  }
};
