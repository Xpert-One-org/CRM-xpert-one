import { useDebouncedCallback } from 'use-debounce';
import { useXpertStore } from '@/store/xpert';
import type { DBXpert } from '@/types/typesDb';

export type NestedTableKey =
  | 'profile_expertise'
  | 'profile_mission'
  | 'profile_status';

export function useXpertDebounce() {
  const {
    keyDBProfileExpertiseChanged,
    keyDBProfileStatusChanged,
    keyDBProfileMissionChanged,
    keyDBProfileChanged,
    setKeyDBProfileChanged,
    setKeyDBProfileExpertiseChanged,
    setKeyDBProfileStatusChanged,
    setKeyDBProfileMissionChanged,
    setOpenedXpertNotSaved,
  } = useXpertStore();

  const handleKeyChangesDebounced = useDebouncedCallback(
    (table: NestedTableKey | undefined, name: string) => {
      if (table === 'profile_expertise') {
        const prevKeys = keyDBProfileExpertiseChanged as string[];
        const newKeys = prevKeys.includes(name)
          ? prevKeys
          : [...prevKeys, name];
        setKeyDBProfileExpertiseChanged(newKeys as any);
      } else if (table === 'profile_status') {
        const prevKeys = keyDBProfileStatusChanged as string[];
        const newKeys = prevKeys.includes(name)
          ? prevKeys
          : [...prevKeys, name];
        setKeyDBProfileStatusChanged(newKeys as any);
      } else if (table === 'profile_mission') {
        const prevKeys = keyDBProfileMissionChanged as string[];
        const newKeys = prevKeys.includes(name)
          ? prevKeys
          : [...prevKeys, name];
        setKeyDBProfileMissionChanged(newKeys as any);
      } else {
        const prevKeys = keyDBProfileChanged as string[];
        const newKeys = prevKeys.includes(name)
          ? prevKeys
          : [...prevKeys, name];
        setKeyDBProfileChanged(newKeys as any);
      }
    },
    500
  );

  const handleUIChange = (xpert: DBXpert | null) => {
    setOpenedXpertNotSaved(xpert);
  };

  return {
    handleKeyChangesDebounced,
    handleUIChange,
  };
}
