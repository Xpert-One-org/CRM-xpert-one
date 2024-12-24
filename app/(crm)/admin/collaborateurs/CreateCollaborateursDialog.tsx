'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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

type CollaboratorData = {
  status: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  absence: string;
  replacement: string;
};

type CreateCollaboratorDialogProps = {
  mode?: 'create' | 'edit';
  initialData?: CollaboratorData;
}

export default function CreateCollaboratorDialog({
  mode = 'create',
  initialData,
}: CreateCollaboratorDialogProps) {
  const [formData, setFormData] = useState<CollaboratorData>(
    initialData || {
      status: 'admin',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      absence: 'no',
      replacement: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission selon le mode
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'edit' ? (
          <Button className="bg-primary text-white">Modifier le compte</Button>
        ) : (
          <Button className="bg-primary text-white">
            Créer un nouveau collaborateur
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogTitle className="sr-only">
          {mode === 'edit'
            ? 'Modifier le collaborateur'
            : 'Créer un nouveau collaborateur'}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-2 items-end gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Adresse mail professionnelle
                <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Adresse mail"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-[47px] w-full bg-white">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">SUPER ADMIN</SelectItem>
                  <SelectItem value="admin">ADMIN</SelectItem>
                  <SelectItem value="manager">Chargé d'affaire</SelectItem>
                  <SelectItem value="intern">Stagiaire</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nom<span className="text-red-500">*</span>
              </label>
              <Input placeholder="Votre nom" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Prénom<span className="text-red-500">*</span>
              </label>
              <Input placeholder="Votre prénom" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Tél portable<span className="text-red-500">*</span>
              </label>
              <Input placeholder="Telephone portable" type="tel" required />
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer le compte
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="px-8">
                Réinitialiser le mot de passe
              </Button>
              <Button type="submit" className="bg-primary px-8 text-white">
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
