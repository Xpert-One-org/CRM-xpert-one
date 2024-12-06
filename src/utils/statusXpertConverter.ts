import type { DBProfileStatus } from '@/types/typesDb';

export const convertStatusXpertValue = (value: DBProfileStatus['status']) => {
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
