export const convertStatusXpertValue = (value: string) => {
  console.log(value);
  switch (value) {
    case 'cdi':
      return 'CDI DE MISSION';
    case 'auto-entrepreneur':
      return 'FREELANCE';
    case 'portage':
      return 'PORTAGE';
    default:
      return value;
  }
};
