import { Box } from '@/components/ui/box';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import React from 'react';

export default function FournisseurActivationMissionRow() {
  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Devis</Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <Button className="size-full text-white">
          <Download className="size-6 -rotate-90" />
        </Button>
      </div>
      <Button className="size-full text-white">
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Button className="size-full text-white">
        Loader récap signé
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Devis signé</Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <Button className="size-full text-white">
          <Download className="size-6 -rotate-90" />
        </Button>
      </div>
      <Button className="size-full text-white">
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Button className="size-full text-white">
        Loader récap signé
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Contrat de mission / Commande
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <Button className="size-full text-white">
          <Download className="size-6 -rotate-90" />
        </Button>
      </div>
      <Button className="size-full text-white">
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Button className="size-full text-white">
        Loader récap signé
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1">{''}</Box>
    </>
  );
}
