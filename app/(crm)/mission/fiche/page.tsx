import Combobox from '@/components/inputs/Combobox';
import Input from '@/components/inputs/Input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import React from 'react';
import MissionFichePage from './[slug]/page';
import ComboboxMission from './_components/ComboboxMission';

export default function page() {
  return (
    // <div className="relative w-fit">
    //   <input
    //     type="text"
    //     className="h-[57px] w-full rounded-md bg-primary px-4 pr-10 text-white placeholder:text-white"
    //     placeholder={'Rechercher'}
    //   />
    //   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    //     <Search className="h-5 w-5 text-white" />
    //   </div>
    // </div>
    <ComboboxMission />
  );
}
