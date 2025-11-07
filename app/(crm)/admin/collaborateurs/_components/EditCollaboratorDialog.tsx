'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import { toast } from 'sonner';
import type { Collaborator } from '@/types/collaborator';
import type { DBCollaboratorRole } from '@/types/typesDb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function EditCollaboratorDialog({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const { updateCollaborator, deleteCollaborator, sendPasswordResetLink } =
    useAdminCollaborators();
  const [formData, setFormData] = useState({
    email: collaborator.email,
    firstname: collaborator.firstname,
    lastname: collaborator.lastname,
    mobile: collaborator.mobile,
    role: collaborator.role as DBCollaboratorRole,
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await updateCollaborator(collaborator.id, formData);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success('Le collaborateur a été modifié avec succès');
    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteCollaborator(collaborator.id);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success('Le collaborateur a été supprimé avec succès');
    setOpen(false);
  };

  const handleSendPasswordReset = async () => {
    setIsLoading(true);
    const result = await sendPasswordResetLink(collaborator.email);

    if (result.error) {
      toast.error(result.error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Le lien de réinitialisation a été envoyé avec succès');
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Modifier le compte</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Modifier le collaborateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Adresse mail professionnelle
              </label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Statut</label>
              <Select
                value={formData.role}
                onValueChange={(value: DBCollaboratorRole) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">ADMIN</SelectItem>
                  <SelectItem value="project_manager">
                    Chargé d'affaire
                  </SelectItem>
                  <SelectItem value="intern">Stagiaire</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="adv">ADV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nom</label>
              <Input
                value={formData.lastname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastname: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Prénom</label>
              <Input
                value={formData.firstname}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstname: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Tél portable
              </label>
              <Input
                value={formData.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleSendPasswordReset}
              disabled={isLoading}
            >
              {isLoading
                ? 'Envoi en cours...'
                : 'Envoyer un lien de réinitialisation de mot de passe'}
            </Button>
          </div>
          <DialogFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  Supprimer le collaborateur
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le collaborateur sera
                    définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="text-white"
                    onClick={handleDelete}
                  >
                    Confirmer la suppression
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="submit"
              className="rounded-br-xxl bg-primary px-16 text-white"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
