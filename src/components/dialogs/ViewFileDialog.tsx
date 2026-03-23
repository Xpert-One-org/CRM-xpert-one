'use client';

import React, { useState } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/utils/date';
import { downloadMissionFile } from '@functions/download-file-mission';
import type { DBMission } from '@/types/typesDb';
import type { FileType } from '@/types/mission';

type StorageFile = {
  name: string;
  created_at: string;
};

type ViewFileDialogProps = {
  type: FileType;
  title: string;
  missionData: DBMission;
  hasFile?: boolean;
  isFournisseurSide?: boolean;
  isFacturation?: boolean;
  selectedYear?: number;
  selectedMonth?: number;
  onDeleteSuccess?: () => void;
};

export default function ViewFileDialog({
  type,
  title,
  missionData,
  hasFile = false,
  isFournisseurSide = false,
  isFacturation = false,
  selectedYear,
  selectedMonth,
  onDeleteSuccess,
}: ViewFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  const getFilePath = () => {
    const dateFolder =
      isFacturation && selectedYear && selectedMonth !== undefined
        ? `${selectedYear}/${(selectedMonth + 1).toString().padStart(2, '0')}`
        : '';

    return `${missionData.mission_number}/${
      isFournisseurSide
        ? missionData.supplier?.generated_id
        : missionData.xpert?.generated_id
    }/${isFacturation ? `facturation/${dateFolder}` : 'activation'}/${type}`;
  };

  const loadSignedUrl = async (folderPath: string, fileName: string) => {
    const supabase = createSupabaseFrontendClient();
    const { data, error } = await supabase.storage
      .from('mission_files')
      .createSignedUrl(`${folderPath}/${fileName}`, 3600);

    if (error || !data) return null;
    return data.signedUrl;
  };

  const handleViewFile = async () => {
    const supabase = createSupabaseFrontendClient();
    setIsLoading(true);

    try {
      const filePath = getFilePath();
      const { data: fileList } = await supabase.storage
        .from('mission_files')
        .list(filePath);

      if (!fileList || fileList.length === 0) {
        toast.error('Aucun fichier trouvé');
        setIsLoading(false);
        return;
      }

      const sortedFiles = fileList
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      if (sortedFiles.length === 0) {
        toast.error('Aucun fichier trouvé');
        setIsLoading(false);
        return;
      }

      setFiles(sortedFiles);
      setSelectedIndex(0);

      const url = await loadSignedUrl(filePath, sortedFiles[0].name);
      if (!url) {
        toast.error('Erreur lors de la récupération du fichier');
        setIsLoading(false);
        return;
      }

      setFileUrl(url);
      setOpen(true);
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Erreur lors de la récupération du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFile = async (index: number) => {
    if (index === selectedIndex || index < 0 || index >= files.length) return;

    setIsLoading(true);
    try {
      const filePath = getFilePath();
      const url = await loadSignedUrl(filePath, files[index].name);
      if (url) {
        setFileUrl(url);
        setSelectedIndex(index);
      }
    } catch {
      toast.error('Erreur lors du chargement du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCurrent = async () => {
    if (!files[selectedIndex]) return;
    const filePath = getFilePath();
    await downloadMissionFile(
      `${filePath}/${files[selectedIndex].name}`,
      files[selectedIndex].name
    );
  };

  const handleDeleteFile = async () => {
    if (fileToDelete === null) return;

    const supabase = createSupabaseFrontendClient();
    const filePath = getFilePath();
    const fileName = files[fileToDelete].name;

    const { error } = await supabase.storage
      .from('mission_files')
      .remove([`${filePath}/${fileName}`]);

    if (error) {
      toast.error('Erreur lors de la suppression du fichier');
      console.error(error);
      setFileToDelete(null);
      return;
    }

    toast.success('Fichier supprimé');
    const newFiles = files.filter((_, i) => i !== fileToDelete);
    setFiles(newFiles);
    setFileToDelete(null);

    if (newFiles.length === 0) {
      handleClose(false);
      onDeleteSuccess?.();
      return;
    }

    const newIndex = Math.min(selectedIndex, newFiles.length - 1);
    setSelectedIndex(newIndex);

    const url = await loadSignedUrl(filePath, newFiles[newIndex].name);
    if (url) setFileUrl(url);

    onDeleteSuccess?.();
  };

  const handleClose = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setFiles([]);
      setSelectedIndex(0);
      setFileUrl(null);
    }
  };

  const hasMultipleFiles = files.length > 1;

  return (
    <>
      <Button
        className="size-full text-white"
        onClick={handleViewFile}
        disabled={!hasFile}
      >
        {hasFile ? <Eye className="size-6" /> : <EyeOff className="size-6" />}
      </Button>

      <Credenza open={open} onOpenChange={handleClose}>
        <CredenzaContent className="my-2 h-[90vh] max-w-[90vw] overflow-hidden rounded-sm border-0 bg-white p-0">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="flex items-center gap-2">
                {hasMultipleFiles && (
                  <span className="rounded-full bg-primary px-3 py-1 text-sm text-white">
                    {selectedIndex + 1} / {files.length}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCurrent}
                  disabled={!files[selectedIndex]}
                >
                  <Download className="mr-1 size-4" />
                  Télécharger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setFileToDelete(selectedIndex)}
                  disabled={!files[selectedIndex]}
                >
                  <Trash2 className="mr-1 size-4" />
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1">
              {/* Sidebar - file list (only when multiple files) */}
              {hasMultipleFiles && (
                <div className="flex w-64 flex-col border-r bg-gray-50">
                  <div className="border-b p-3">
                    <p className="text-sm font-medium text-gray-600">
                      {files.length} documents
                    </p>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                      {files.map((file, index) => (
                        <div
                          key={file.name}
                          className={`flex items-center justify-between rounded-md p-3 transition-colors ${
                            index === selectedIndex
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <button
                            onClick={() => handleSelectFile(index)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <p className="truncate text-sm font-medium">
                              {file.name}
                            </p>
                            <p
                              className={`text-xs ${
                                index === selectedIndex
                                  ? 'text-white/80'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatDate(file.created_at)}
                            </p>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFileToDelete(index);
                            }}
                            className={`ml-2 shrink-0 rounded p-1 transition-colors ${
                              index === selectedIndex
                                ? 'hover:bg-white/20'
                                : 'hover:bg-red-100'
                            }`}
                            title="Supprimer"
                          >
                            <Trash2
                              className={`size-4 ${
                                index === selectedIndex
                                  ? 'text-white/80'
                                  : 'text-red-500'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Main content - file preview */}
              <div className="min-h-0 flex-1">
                {isLoading ? (
                  <div className="flex size-full items-center justify-center">
                    <p className="text-gray-500">Chargement...</p>
                  </div>
                ) : fileUrl ? (
                  <iframe
                    src={fileUrl}
                    className="size-full border-0"
                    title="Document preview"
                  />
                ) : null}
              </div>
            </div>

            {/* Bottom navigation for multiple files */}
            {hasMultipleFiles && (
              <div className="flex items-center justify-center gap-4 border-t p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectFile(selectedIndex - 1)}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectFile(selectedIndex + 1)}
                  disabled={selectedIndex === files.length - 1}
                >
                  Suivant
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            )}
          </div>
        </CredenzaContent>
      </Credenza>

      {/* Confirmation de suppression */}
      <AlertDialog
        open={fileToDelete !== null}
        onOpenChange={(v) => {
          if (!v) setFileToDelete(null);
        }}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le fichier</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong>
                {fileToDelete !== null && files[fileToDelete]?.name}
              </strong>{' '}
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
