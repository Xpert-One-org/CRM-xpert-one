import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBProfileStatus } from '@/types/typesDb';

export default function XpertActivationMissionRow({
  status,
}: {
  status: DBProfileStatus['status'];
}) {
  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission
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
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission signé
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
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi'
          ? 'Contrat CDI'
          : status === 'auto-entreprise'
            ? 'Commande de société'
            : 'Devis de portage'}
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
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi'
          ? 'Contrat CDI signé'
          : status === 'auto-entreprise'
            ? 'Commande de société signé'
            : 'Commande de portage'}
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
