'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-primary">Accès non autorisé</h1>
        <p className="text-lg text-gray-600">
          Vous n'avez pas les permissions et les droits nécessaires pour accéder
          à cette page.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-primary px-6 py-2 text-white"
        >
          Retour au tableau de bord
        </Button>
        <Button
          onClick={() => router.back()}
          className="border border-primary bg-white px-6 py-2 text-primary hover:bg-primary/20"
        >
          Page précédente
        </Button>
      </div>
    </div>
  );
}
