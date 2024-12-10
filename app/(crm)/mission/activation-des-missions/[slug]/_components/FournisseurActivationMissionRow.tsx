import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import UploadFileDialog from './UploadFileDialog';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

export type FournisseurFileType = 'devis';

export default function FournisseurActivationMissionRow({
  missionData,
}: {
  missionData: DBMission;
}) {
  const handleDownloadTemplate = async ({
    type,
  }: {
    type: FournisseurFileType;
  }) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const { data: modelesData, error } = await supabase.storage
        .from('mission_files')
        .list(`modeles/fournisseur/${type}`);

      if (error) {
        console.error('Error downloading file:', error);
        return;
      }

      if (modelesData && modelesData.length > 0) {
        const lastModelesFile = modelesData[modelesData.length - 1];
        const { data } = await supabase.storage
          .from('mission_files')
          .download(`modeles/fournisseur/${type}/${lastModelesFile.name}`);

        if (data) {
          const blob = new Blob([data], { type: data.type });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${type}_fournisseur`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Error handling download:', error);
    }
  };

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Devis</Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <UploadFileDialog
          type="devis"
          title="Devis"
          missionData={missionData}
        />
      </div>
      <Button
        className="size-full text-white"
        onClick={() => handleDownloadTemplate({ type: 'devis' })}
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>

      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Devis signé</Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <Button className="size-full text-white">
          <Download className="size-6" />
        </Button>
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Button className="size-full text-white">
        Loader devis signé
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>

      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Contrat de mission / Commande
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <Button className="size-full text-white">
          <Download className="size-6" />
        </Button>
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Button className="size-full text-white">
        Loader contrat signé
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>
    </>
  );
}
