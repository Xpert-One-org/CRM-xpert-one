import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission, DBProfileStatus } from '@/types/typesDb';
import UploadFileDialog from './UploadFileDialog';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

export type FileType =
  | 'recap_mission'
  | 'contrat'
  | 'devis'
  | 'commande_societe'
  | 'devis_portage'
  | 'commande_portage'
  | 'devis'
  | 'salary'
  | 'invoice';

export default function XpertActivationMissionRow({
  status,
  missionData,
}: {
  status: DBProfileStatus['status'];
  missionData: DBMission;
}) {
  const handleDownloadTemplate = async ({ type }: { type: FileType }) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const { data: modelesData, error } = await supabase.storage
        .from('mission_files')
        .list(`modeles/${status}/${type}`);

      if (error) {
        console.error('Error downloading file:', error);
        return;
      }

      if (modelesData && modelesData.length > 0) {
        const lastModelesFile = modelesData[modelesData.length - 1];
        const { data } = await supabase.storage
          .from('mission_files')
          .download(`modeles/${status}/${type}/${lastModelesFile.name}`);

        if (data) {
          const blob = new Blob([data], { type: data.type });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${type}_${status}`;
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
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        <UploadFileDialog
          type="recap_mission"
          title="Récapitulatif de mission"
          missionData={missionData}
        />
      </div>
      <Button
        className="size-full text-white"
        onClick={() => handleDownloadTemplate({ type: 'recap_mission' })}
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission signé
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
        Loader récap signé
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi'
          ? 'Contrat CDI'
          : status === 'freelance'
            ? 'Commande de société'
            : 'Devis de portage'}
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        {status !== 'portage' ? (
          <UploadFileDialog
            type={status === 'cdi' ? 'contrat' : 'commande_societe'}
            title={status === 'cdi' ? 'Contrat CDI' : 'Commande de société'}
            missionData={missionData}
          />
        ) : (
          <Button className="size-full text-white">
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadTemplate({
            type: status === 'cdi' ? 'contrat' : 'devis',
          })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      {status === 'portage' ? (
        <Button className="size-full text-white">
          Loader devis portage
          <Download className="ml-2 size-6" />
        </Button>
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi'
          ? 'Contrat CDI signé'
          : status === 'freelance'
            ? 'Commande de société signé'
            : 'Commande de portage'}
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <Button className="size-full text-white">
          <Eye className="size-6" />
        </Button>
        {status === 'portage' ? (
          <UploadFileDialog
            type="commande_portage"
            title="Commande de portage"
            missionData={missionData}
          />
        ) : (
          <Button className="size-full text-white">
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      {status !== 'portage' ? (
        <Button className="size-full text-white">
          {status === 'cdi' ? 'Loader contrat signé' : 'Loader commande signée'}
          <Download className="ml-2 size-6" />
        </Button>
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box className="col-span-1 bg-[#D64242] text-white">{'Non reçu'}</Box>
    </>
  );
}
