'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { collaboratorSchema } from '@/types/collaborator';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import { toast } from 'sonner';
import { z } from 'zod';

export default function CreateCollaboratorDialog() {
  const { addCollaborator } = useAdminCollaborators();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: '',
    role: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = collaboratorSchema.parse(formData);
      const result = await addCollaborator(validatedData);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success('Le collaborateur a été créé avec succès');
      setFormData({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: '',
        role: '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white">
          Créer un nouveau collaborateur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Créer un nouveau collaborateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-2 items-end gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Adresse mail professionnelle
                <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Adresse mail du collaborateur"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Mot de passe
                <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Mot de passe du collaborateur"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Statut</label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="h-[47px] w-full bg-white">
                  <SelectValue placeholder="Sélectionner un statut" />
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
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nom<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nom du collaborateur"
                required
                value={formData.lastname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastname: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Prénom<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Prénom du collaborateur"
                required
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
                Tél portable<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Tél du collaborateur"
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              className="rounded-br-xxl bg-primary px-8 text-white"
            >
              Créer le collaborateur
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
