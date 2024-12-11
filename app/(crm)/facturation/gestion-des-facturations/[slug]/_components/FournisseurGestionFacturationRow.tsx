import React from 'react';
import { Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import UploadFileDialog from '../../../../mission/activation-des-missions/[slug]/_components/UploadFileDialog';

export default function FournisseurGestionFacturationRow({
  missionData,
}: {
  missionData: DBMission;
}) {
  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Facture</Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <Button className="size-full text-white">
          <Download className="ml-2 size-6" />
        </Button>
      </div>
      <Button className="size-full text-white">
        Loader facture signée
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1 bg-[#D64242] text-white">{'À envoyer'}</Box>
      <Box className="col-span-1 bg-primary text-white">
        {missionData.mission_number}
      </Box>
      <Box className="col-span-2 h-[70px] w-full bg-[#F5F5F5]">Paiement</Box>
      <div className="col-span-1 flex gap-2">
        {status !== 'cdi' ? (
          <Button className="size-full text-white">
            <Eye className="size-6" />
          </Button>
        ) : null}
        {status === 'cdi' ? (
          <UploadFileDialog
            type="salary"
            title="Feuille de salaire"
            missionData={missionData}
          />
        ) : (
          <Button className="size-full text-white">
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non effectué'}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
    </>
  );
}
