'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useXpertStore } from '@/store/xpert';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { DBProfileBan } from '@/types/typesDb';
import Loader from '@/components/Loader';

type XpertBansProps = {
  xpertId: string;
  onUnbanSuccess?: () => void;
};

export function XpertBans({ xpertId, onUnbanSuccess }: XpertBansProps) {
  const [bans, setBans] = useState<DBProfileBan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { unbanXpert } = useXpertStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (xpertId) {
      fetchBans(xpertId);
    }
  }, [xpertId]);

  // Écouter l'événement de rafraîchissement
  useEffect(() => {
    const parentElement = containerRef.current?.parentElement;

    if (!parentElement) return;

    const handleRefresh = () => {
      fetchBans(xpertId);
    };

    parentElement.addEventListener('refresh-bans', handleRefresh);

    return () => {
      parentElement.removeEventListener('refresh-bans', handleRefresh);
    };
  }, [xpertId]);

  const fetchBans = async (profileId: string) => {
    setIsLoading(true);
    const supabase = createSupabaseFrontendClient();

    const { data, error } = await supabase
      .from('profile_bans')
      .select(
        `
        id,
        profile_id,
        banned_by,
        reason,
        banned_at,
        is_active,
        unbanned_at,
        unbanned_by,
        banned_by_profile:banned_by(firstname, lastname),
        unbanned_by_profile:unbanned_by(firstname, lastname)
      `
      )
      .eq('profile_id', profileId)
      .order('banned_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des bannissements');
      console.error(error);
    } else {
      setBans(data as unknown as DBProfileBan[]);
    }

    setIsLoading(false);
  };

  const handleUnban = async (banId: string) => {
    try {
      await unbanXpert({ xpertId, banId });

      // Mettre à jour la liste des bannissements
      fetchBans(xpertId);

      // Notifier le parent que l'utilisateur a été débanni
      if (onUnbanSuccess) {
        onUnbanSuccess();
      }

      // Notifier tous les composants BanXpertDialog qu'ils doivent se mettre à jour
      const event = new CustomEvent('xpert-unbanned', {
        detail: { xpertId },
      });
      document.dispatchEvent(event);

      toast.success("L'XPERT a été débanni avec succès");
    } catch (error) {
      console.error('Erreur lors du débannissement:', error);
      toast.error("Une erreur est survenue lors du débannissement de l'XPERT");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center" ref={containerRef}>
        <Loader />
      </div>
    );
  }

  if (bans.length === 0) {
    return (
      <div
        className="col-span-full rounded-lg bg-[#D0DDE1] p-4"
        ref={containerRef}
      >
        <h3 className="mb-2 text-lg font-medium">
          Historique des bannissements
        </h3>
        <p className="text-gray-600">
          Aucun bannissement trouvé pour cet XPERT.
        </p>
      </div>
    );
  }

  return (
    <div
      className="col-span-full rounded-lg bg-[#D0DDE1] p-4"
      ref={containerRef}
    >
      <h3 className="mb-4 text-lg font-medium">Historique des bannissements</h3>

      <div className="space-y-4">
        {bans.map((ban) => (
          <div key={ban.id} className="rounded-md bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">
                    {ban.is_active ? (
                      <Badge variant="destructive">Banni</Badge>
                    ) : (
                      <Badge variant="default">Débanni</Badge>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(ban.banned_at)}
                  </span>
                </div>
                <p className="mb-2">{ban.reason}</p>
                <p className="text-sm text-gray-600">
                  Par: {ban.banned_by_profile?.firstname}{' '}
                  {ban.banned_by_profile?.lastname}
                </p>

                {!ban.is_active && ban.unbanned_at && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Débanni le: {formatDate(ban.unbanned_at)}
                    </p>
                    {ban.unbanned_by_profile && (
                      <p className="text-sm text-gray-600">
                        Par: {ban.unbanned_by_profile.firstname}{' '}
                        {ban.unbanned_by_profile.lastname}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {ban.is_active && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnban(ban.id)}
                >
                  Débannir
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
