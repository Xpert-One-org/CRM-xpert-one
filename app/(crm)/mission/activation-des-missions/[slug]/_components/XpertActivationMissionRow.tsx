import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission, DBProfileStatus } from '@/types/typesDb';
import UploadFileDialog from './UploadFileDialog';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

import ViewFileDialog from './ViewFileDialog';
import { formatDate } from '@/utils/date';
import { toast } from 'sonner';
import { downloadMissionFile } from '../download-mission-file.action';

export type FileType =
  // cdi
  | 'recap_mission_cdi'
  | 'recap_mission_cdi_signed'
  | 'contrat_cdi'
  | 'contrat_signed_cdi'
  // freelance
  | 'recap_mission_freelance'
  | 'recap_mission_signed_freelance'
  | 'commande_societe_freelance'
  | 'commande_societe_signed_freelance'
  // portage
  | 'recap_mission_portage'
  | 'recap_mission_signed_portage'
  | 'devis_portage'
  | 'commande_portage'
  | 'fournisseur_devis_signed'
  | 'fournisseur_contrat_signed';

export default function XpertActivationMissionRow({
  status,
  missionData,
}: {
  status: DBProfileStatus['status'];
  missionData: DBMission;
}) {
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, { exists: boolean; createdAt?: string }>
  >({});

  const handleFileCheck = (
    type: string,
    exists: boolean,
    createdAt?: string
  ) => {
    setFileStatuses((prev) => ({
      ...prev,
      [type]: { exists, createdAt },
    }));
  };

  const getFileTypeByStatus = (baseType: string): FileType => {
    switch (missionData.xpert_associated_status) {
      case 'cdi':
        return `${baseType}_cdi` as FileType;
      case 'freelance':
        return `${baseType}_freelance` as FileType;
      case 'portage':
        return `${baseType}_portage` as FileType;
      default:
        return `${baseType}_cdi` as FileType;
    }
  };

  const handleDownloadTemplate = async ({ type }: { type: FileType }) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const { data: modelesData, error } = await supabase.storage
        .from('mission_files')
        .list(`modeles/${status}/${type}`);

      if (error || !modelesData || modelesData.length === 0) {
        toast.error('Aucun modèle disponible');
        return;
      }

      const lastModelesFile = modelesData[modelesData.length - 1];
      await downloadMissionFile(
        `modeles/${status}/${type}/${lastModelesFile.name}`,
        `${type}_${status}`
      );
    } catch (error) {
      console.error('Error handling template download:', error);
      toast.error('Erreur lors du téléchargement du modèle');
    }
  };

  const handledownloadMissionFile = async ({ type }: { type: FileType }) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const filePath = `${missionData.mission_number}/${missionData.xpert?.generated_id}/activation/${type}`;

      const { data: files, error: listError } = await supabase.storage
        .from('mission_files')
        .list(filePath);

      if (listError || !files || files.length === 0) {
        toast.error("Aucun fichier n'a été uploadé");
        return;
      }

      const lastFile = files[files.length - 1];
      await downloadMissionFile(`${filePath}/${lastFile.name}`, lastFile.name);
    } catch (error) {
      console.error('Error handling file download:', error);
      toast.error('Erreur lors du téléchargement du fichier');
    }
  };

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus('recap_mission')}
          title="Récapitulatif de mission"
          missionData={missionData}
          onFileCheck={(exists, createdAt) =>
            handleFileCheck(
              getFileTypeByStatus('recap_mission'),
              exists,
              createdAt
            )
          }
        />
        <UploadFileDialog
          type={getFileTypeByStatus('recap_mission')}
          title="Récapitulatif de mission"
          missionData={missionData}
        />
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadTemplate({
            type: getFileTypeByStatus('recap_mission'),
          })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[getFileTypeByStatus('recap_mission')]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[getFileTypeByStatus('recap_mission')]?.exists
            ? 'Envoyé le'
            : 'Non envoyé'}
        </p>
        <p>
          {fileStatuses[getFileTypeByStatus('recap_mission')]?.exists
            ? formatDate(
                fileStatuses[getFileTypeByStatus('recap_mission')]?.createdAt ??
                  ''
              )
            : ''}
        </p>
      </Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission signé
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus('recap_mission_signed')}
          title="Récapitulatif de mission signé"
          missionData={missionData}
          onFileCheck={(exists, createdAt) =>
            handleFileCheck(
              getFileTypeByStatus('recap_mission_signed'),
              exists,
              createdAt
            )
          }
        />
        <Button
          className="size-full text-white"
          onClick={() =>
            handledownloadMissionFile({
              type: getFileTypeByStatus('recap_mission_signed'),
            })
          }
        >
          <Download className="size-6" />
        </Button>
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <UploadFileDialog
        type={getFileTypeByStatus('recap_mission_signed')}
        title="Récapitulatif de mission signé"
        buttonText="Loader récap signé"
        missionData={missionData}
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[getFileTypeByStatus('recap_mission_signed')]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[getFileTypeByStatus('recap_mission_signed')]?.exists
            ? 'Reçu le'
            : 'Non reçu'}
        </p>
        <p>
          {fileStatuses[getFileTypeByStatus('recap_mission_signed')]?.exists
            ? formatDate(
                fileStatuses[getFileTypeByStatus('recap_mission_signed')]
                  ?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi'
          ? 'Contrat CDI'
          : status === 'freelance'
            ? 'Commande de société'
            : 'Devis de portage'}
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus(
            status === 'cdi'
              ? 'contrat'
              : status === 'freelance'
                ? 'commande_societe'
                : 'devis_portage'
          )}
          title={
            status === 'cdi'
              ? 'Contrat CDI'
              : status === 'freelance'
                ? 'Commande de société'
                : 'Devis de portage'
          }
          missionData={missionData}
          onFileCheck={(exists, createdAt) =>
            handleFileCheck(
              getFileTypeByStatus(
                status === 'cdi'
                  ? 'contrat'
                  : status === 'freelance'
                    ? 'commande_societe'
                    : 'devis_portage'
              ),
              exists,
              createdAt
            )
          }
        />
        {status !== 'portage' ? (
          <UploadFileDialog
            type={getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat'
                : status === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage'
            )}
            title={status === 'cdi' ? 'Contrat CDI' : 'Commande de société'}
            missionData={missionData}
          />
        ) : (
          <Button
            className="size-full text-white"
            onClick={() =>
              handleDownloadTemplate({ type: getFileTypeByStatus('contrat') })
            }
          >
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadTemplate({ type: getFileTypeByStatus('contrat') })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      {status === 'portage' ? (
        <UploadFileDialog
          type={getFileTypeByStatus('devis')}
          title="Devis de portage"
          buttonText="Loader devis portage"
          missionData={missionData}
        />
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat'
                : status === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage'
            )
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat'
                : status === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage'
            )
          ]?.exists
            ? 'Envoyé le'
            : 'Non envoyé'}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat'
                : status === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage'
            )
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus(
                    status === 'cdi'
                      ? 'contrat'
                      : status === 'freelance'
                        ? 'commande_societe'
                        : 'devis_portage'
                  )
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi'
          ? 'Contrat CDI signé'
          : status === 'freelance'
            ? 'Commande de société signé'
            : 'Commande de portage'}
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={
            status === 'cdi'
              ? 'contrat_signed_cdi'
              : status === 'freelance'
                ? 'commande_societe_signed_freelance'
                : 'commande_portage'
          }
          title={
            status === 'cdi'
              ? 'Contrat CDI signé'
              : status === 'freelance'
                ? 'Commande de société signé'
                : 'Commande de portage'
          }
          missionData={missionData}
          onFileCheck={(exists, createdAt) =>
            handleFileCheck(
              getFileTypeByStatus(
                status === 'cdi'
                  ? 'contrat_signed'
                  : status === 'freelance'
                    ? 'commande_societe_signed'
                    : 'commande_portage_signed'
              ),
              exists,
              createdAt
            )
          }
        />
        {status === 'portage' ? (
          <UploadFileDialog
            type={getFileTypeByStatus('commande')}
            title="Commande de portage"
            missionData={missionData}
          />
        ) : (
          <Button
            className="size-full text-white"
            onClick={() =>
              handledownloadMissionFile({
                type: getFileTypeByStatus(
                  status === 'cdi'
                    ? 'contrat_signed'
                    : status === 'freelance'
                      ? 'commande_societe_signed'
                      : 'commande_portage_signed'
                ),
              })
            }
          >
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      {status !== 'portage' ? (
        <>
          {status === 'cdi' ? (
            <UploadFileDialog
              type={getFileTypeByStatus('contrat_signed')}
              title="Contrat CDI"
              buttonText="Loader contrat CDI"
              missionData={missionData}
            />
          ) : (
            <UploadFileDialog
              type={getFileTypeByStatus('commande_signed')}
              title="Commande signée"
              buttonText="Loader commande signée"
              missionData={missionData}
            />
          )}
        </>
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat_signed'
                : status === 'freelance'
                  ? 'commande_societe_signed'
                  : 'devis_portage_signed'
            )
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat_signed'
                : status === 'freelance'
                  ? 'commande_societe_signed'
                  : 'devis_portage_signed'
            )
          ]?.exists
            ? status === 'portage'
              ? 'Envoyé le'
              : 'Reçu le'
            : status === 'portage'
              ? 'Non envoyé'
              : 'Non reçu'}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              status === 'cdi'
                ? 'contrat_signed'
                : status === 'freelance'
                  ? 'commande_societe_signed'
                  : 'devis_portage_signed'
            )
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus(
                    status === 'cdi'
                      ? 'contrat_signed'
                      : status === 'freelance'
                        ? 'commande_societe_signed'
                        : 'devis_portage_signed'
                  )
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
    </>
  );
}
