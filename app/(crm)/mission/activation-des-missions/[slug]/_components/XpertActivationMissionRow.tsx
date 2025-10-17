import React, { useContext } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getFileStatus } from '../_utils/fileStatus';
import { getDocumentLabel } from '../_utils/documentLabel';
import { getFileTypeByStatus } from '../_utils/getFileTypeByStatus';
import DownloadOff from '@/components/svg/DownloadOff';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { DownloadType } from '@/types/mission';
import { toast } from 'sonner';
import { downloadMissionFile } from '@functions/download-file-mission';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import { AuthContext } from '@/components/auth/AuthProvider';

export default function XpertActivationMissionRow({
  missionData,
  fileStatuses,
  onFileUpload,
}: {
  missionData: DBMission;
  fileStatuses: Record<string, { exists: boolean; createdAt?: string }>;
  onFileUpload: () => Promise<void>;
}) {
  const { isIntern } = useContext(AuthContext);

  const missionXpertStatus = missionData.xpert_associated_status;
  const handleDownloadFile = async ({
    type,
    isTemplate = false,
  }: DownloadType) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const basePath = isTemplate
        ? `modeles/${missionXpertStatus}/${type}`
        : `${missionData.mission_number}/${missionData.xpert?.generated_id}/activation/${type}`;

      const { data: files, error: listError } = await supabase.storage
        .from('mission_files')
        .list(basePath);

      if (listError || !files || files.length === 0) {
        toast.error(
          isTemplate
            ? 'Aucun modèle disponible'
            : "Aucun fichier n'a été uploadé"
        );
        return;
      }

      const sortedFiles = files.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const mostRecentFile = sortedFiles[0];
      const filePath = `${basePath}/${mostRecentFile.name}`;
      const fileName = isTemplate
        ? `${type}_${missionXpertStatus}`
        : mostRecentFile.name;

      await downloadMissionFile(filePath, fileName);
    } catch (error) {
      console.error('Error handling file download:', error);
      toast.error(
        isTemplate
          ? 'Erreur lors du téléchargement du modèle'
          : 'Erreur lors du téléchargement du fichier'
      );
    }
  };

  return (
    <>
      {/* Ligne 1 */}
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')}
          title="Récapitulatif de mission"
          missionData={missionData}
          hasFile={
            fileStatuses[
              getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')
            ]?.exists
          }
        />
        <UploadFileDialog
          type={getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')}
          title="Récapitulatif de mission"
          missionData={missionData}
          onUploadSuccess={isIntern ? () => {} : onFileUpload}
          disabled={isIntern}
        />
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadFile({ type: 'recap_mission', isTemplate: true })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')
          ]?.exists
            ? getFileStatus('recap_mission', missionXpertStatus ?? '').sentLabel
            : getFileStatus('recap_mission', missionXpertStatus ?? '')
                .notSentLabel}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus('recap_mission', missionXpertStatus ?? '')
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
      {/* ---------------------------- */}
      {/* Ligne 2 */}
      {/* ---------------------------- */}
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Récapitulatif de mission signé
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus(
            'recap_mission_signed',
            missionXpertStatus ?? ''
          )}
          title="Récapitulatif de mission signé"
          missionData={missionData}
          hasFile={
            fileStatuses[
              getFileTypeByStatus(
                'recap_mission_signed',
                missionXpertStatus ?? ''
              )
            ]?.exists
          }
        />
        <Button
          className="size-full text-white"
          onClick={() =>
            handleDownloadFile({
              type: getFileTypeByStatus(
                'recap_mission_signed',
                missionXpertStatus ?? ''
              ),
            })
          }
          disabled={
            !fileStatuses[
              getFileTypeByStatus(
                'recap_mission_signed',
                missionXpertStatus ?? ''
              )
            ]?.exists
          }
        >
          {fileStatuses[
            getFileTypeByStatus(
              'recap_mission_signed',
              missionXpertStatus ?? ''
            )
          ]?.exists ? (
            <Download className="size-6" />
          ) : (
            <DownloadOff className="size-6" />
          )}
        </Button>
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <UploadFileDialog
        type={getFileTypeByStatus(
          'recap_mission_signed',
          missionXpertStatus ?? ''
        )}
        title="Récapitulatif de mission signé"
        buttonText="Loader récap signé"
        missionData={missionData}
        onUploadSuccess={isIntern ? () => {} : onFileUpload}
        disabled={isIntern}
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus(
              'recap_mission_signed',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              'recap_mission_signed',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? getFileStatus('recap_mission_signed', missionXpertStatus ?? '')
                .sentLabel
            : getFileStatus('recap_mission_signed', missionXpertStatus ?? '')
                .notSentLabel}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              'recap_mission_signed',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus(
                    'recap_mission_signed',
                    missionXpertStatus ?? ''
                  )
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
      {/* ---------------------------- */}
      {/* Ligne 3 */}
      {/* ---------------------------- */}
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {getDocumentLabel('contrat', missionXpertStatus ?? '')}
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus(
            missionXpertStatus === 'cdi'
              ? 'contrat'
              : missionXpertStatus === 'freelance'
                ? 'commande_societe'
                : 'devis_portage',
            missionXpertStatus ?? ''
          )}
          title={getDocumentLabel('contrat', missionXpertStatus ?? '')}
          missionData={missionData}
          hasFile={
            fileStatuses[
              getFileTypeByStatus(
                missionXpertStatus === 'cdi'
                  ? 'contrat'
                  : missionXpertStatus === 'freelance'
                    ? 'commande_societe'
                    : 'devis_portage',
                missionXpertStatus ?? ''
              )
            ]?.exists
          }
        />
        {missionXpertStatus !== 'portage' ? (
          <UploadFileDialog
            type={getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage',
              missionXpertStatus ?? ''
            )}
            title={getDocumentLabel('contrat', missionXpertStatus ?? '')}
            missionData={missionData}
            onUploadSuccess={isIntern ? () => {} : onFileUpload}
            disabled={isIntern}
          />
        ) : (
          <Button
            className="size-full text-white"
            onClick={() =>
              handleDownloadFile({
                type: getFileTypeByStatus(
                  'devis_portage',
                  missionXpertStatus ?? ''
                ),
              })
            }
            disabled={
              !fileStatuses[
                getFileTypeByStatus('devis_portage', missionXpertStatus ?? '')
              ]?.exists
            }
          >
            {fileStatuses[
              getFileTypeByStatus('devis_portage', missionXpertStatus ?? '')
            ]?.exists ? (
              <Download className="size-6" />
            ) : (
              <DownloadOff className="size-6" />
            )}
          </Button>
        )}
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadFile({
            type:
              missionXpertStatus === 'freelance'
                ? 'commande_societe'
                : missionXpertStatus === 'cdi'
                  ? 'contrat'
                  : 'devis_portage',
            isTemplate: true,
          })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      {missionXpertStatus === 'portage' ? (
        <UploadFileDialog
          type={getFileTypeByStatus('devis_portage', missionXpertStatus ?? '')}
          title="Devis de portage"
          buttonText="Loader devis portage"
          missionData={missionData}
          onUploadSuccess={isIntern ? () => {} : onFileUpload}
          disabled={isIntern}
        />
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? getFileStatus(
                missionXpertStatus === 'portage' ? 'devis_portage' : 'contrat',
                missionXpertStatus ?? ''
              ).sentLabel
            : getFileStatus(
                missionXpertStatus === 'portage' ? 'devis_portage' : 'contrat',
                missionXpertStatus ?? ''
              ).notSentLabel}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe'
                  : 'devis_portage',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus(
                    missionXpertStatus === 'cdi'
                      ? 'contrat'
                      : missionXpertStatus === 'freelance'
                        ? 'commande_societe'
                        : 'devis_portage',
                    missionXpertStatus ?? ''
                  )
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
      {/* ---------------------------- */}
      {/* Ligne 4 */}
      {/* ---------------------------- */}
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        {getDocumentLabel('contrat_signed', missionXpertStatus ?? '')}
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={
            missionXpertStatus === 'cdi'
              ? 'contrat_signed_cdi'
              : missionXpertStatus === 'freelance'
                ? 'commande_societe_signed_freelance'
                : 'commande_portage'
          }
          title={getDocumentLabel('contrat_signed', missionXpertStatus ?? '')}
          missionData={missionData}
          hasFile={
            fileStatuses[
              getFileTypeByStatus(
                missionXpertStatus === 'cdi'
                  ? 'contrat_signed'
                  : missionXpertStatus === 'freelance'
                    ? 'commande_societe_signed'
                    : 'commande',
                missionXpertStatus ?? ''
              )
            ]?.exists
          }
        />
        {missionXpertStatus === 'portage' ? (
          <UploadFileDialog
            type={getFileTypeByStatus('commande', missionXpertStatus ?? '')}
            title="Commande de portage"
            missionData={missionData}
            onUploadSuccess={isIntern ? () => {} : onFileUpload}
            disabled={isIntern}
          />
        ) : (
          <Button
            className="size-full text-white"
            onClick={() =>
              handleDownloadFile({
                type: getFileTypeByStatus(
                  missionXpertStatus === 'cdi'
                    ? 'contrat_signed'
                    : missionXpertStatus === 'freelance'
                      ? 'commande_societe_signed'
                      : 'commande',
                  missionXpertStatus ?? ''
                ),
              })
            }
            disabled={
              !fileStatuses[
                getFileTypeByStatus(
                  missionXpertStatus === 'cdi'
                    ? 'contrat_signed'
                    : missionXpertStatus === 'freelance'
                      ? 'commande_societe_signed'
                      : 'commande',
                  missionXpertStatus ?? ''
                )
              ]?.exists
            }
          >
            {fileStatuses[
              getFileTypeByStatus(
                missionXpertStatus === 'cdi'
                  ? 'contrat_signed'
                  : missionXpertStatus === 'freelance'
                    ? 'commande_societe_signed'
                    : 'commande',
                missionXpertStatus ?? ''
              )
            ]?.exists ? (
              <Download className="size-6" />
            ) : (
              <DownloadOff className="size-6" />
            )}
          </Button>
        )}
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      {missionXpertStatus !== 'portage' ? (
        <>
          {missionXpertStatus === 'cdi' ? (
            <UploadFileDialog
              type={getFileTypeByStatus(
                'contrat_signed',
                missionXpertStatus ?? ''
              )}
              title="Contrat CDI"
              buttonText="Loader contrat CDI"
              missionData={missionData}
              onUploadSuccess={isIntern ? () => {} : onFileUpload}
              disabled={isIntern}
            />
          ) : (
            <UploadFileDialog
              type={getFileTypeByStatus(
                'commande_societe_signed',
                missionXpertStatus ?? ''
              )}
              title="Commande signée"
              buttonText="Loader commande signée"
              missionData={missionData}
              onUploadSuccess={isIntern ? () => {} : onFileUpload}
              disabled={isIntern}
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
              missionXpertStatus === 'cdi'
                ? 'contrat_signed'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe_signed'
                  : 'commande',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat_signed'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe_signed'
                  : 'commande',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? getFileStatus(
                missionXpertStatus === 'portage'
                  ? 'commande'
                  : 'contrat_signed',
                missionXpertStatus ?? ''
              ).sentLabel
            : getFileStatus(
                missionXpertStatus === 'portage'
                  ? 'commande'
                  : 'contrat_signed',
                missionXpertStatus ?? ''
              ).notSentLabel}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat_signed'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe_signed'
                  : 'commande',
              missionXpertStatus ?? ''
            )
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus(
                    missionXpertStatus === 'cdi'
                      ? 'contrat_signed'
                      : missionXpertStatus === 'freelance'
                        ? 'commande_societe_signed'
                        : 'commande',
                    missionXpertStatus ?? ''
                  )
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
    </>
  );
}
