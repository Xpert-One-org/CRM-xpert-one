'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type { DBMission } from '@/types/typesDb';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getMissionDetails = async (missionId: string) => {
  const supabase = await createSupabaseAppServerClient();

  const formattedMissionId = missionId.replace(/-/g, ' ');

  const { data, error } = await supabase
    .from('mission')
    .select(
      `
      *,
      referent:profile!mission_affected_referent_id_fkey(id, firstname, lastname, mobile, fix, email),
      xpert:profile!mission_xpert_associated_id_fkey(*),
      supplier:profile!mission_created_by_fkey(*),
      finance:mission_finance(*)
    `
    )
    .eq('mission_number', formattedMissionId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Mission non trouvée');
  }

  const missionWithFinance = {
    ...data[0],
    finance: data[0].finance ? data[0].finance[0] : null,
  };

  return missionWithFinance;
};

type UpdateMissionData = Omit<Partial<DBMission>, 'id'> & {
  id?: never;
};

export const updateMission = async ({
  mission_id,
  newData,
}: {
  mission_id: number;
  newData: UpdateMissionData & { finance?: any };
}) => {
  const supabase = await createSupabaseAppServerClient();

  // Validation du state si présent dans newData
  if (
    newData.state &&
    ![
      'to_validate',
      'open_all_to_validate',
      'open',
      'open_all',
      'in_progress',
      'deleted',
      'finished',
      'in_process',
      'validated',
      'refused',
    ].includes(newData.state)
  ) {
    return { error: 'État de mission invalide' };
  }

  // Extract finance data and remove it from mission data
  const { finance, ...missionData } = newData;

  // Start a transaction to update both tables
  const { error: missionError } = await supabase
    .from('mission')
    .update(missionData)
    .eq('id', mission_id);

  if (missionError) {
    console.error('Error updating mission:', missionError);
    return { error: missionError.message };
  }

  // Update finance data if provided
  if (finance) {
    const { error: financeError } = await supabase
      .from('mission_finance')
      .upsert({
        ...finance,
        mission_id,
      })
      .eq('mission_id', mission_id);

    if (financeError) {
      console.error('Error updating mission finance:', financeError);
      return { error: financeError.message };
    }
  }

  return { error: null };
};

/**
 * Met à jour le fournisseur (created_by) d'une mission
 * @param missionId L'ID de la mission à mettre à jour
 * @param supplierId L'ID du nouveau fournisseur
 */
export const updateMissionSupplier = async (
  missionId: number,
  supplierId: string
) => {
  try {
    const supabase = await createSupabaseAppServerClient();

    // Vérifier les permissions de l'utilisateur
    const isAdmin = await checkAuthRole();
    if (!isAdmin) {
      return {
        success: false,
        error:
          "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
      };
    }

    // Vérifier que le fournisseur existe et a le rôle 'company'
    const { data: supplierData, error: supplierError } = await supabase
      .from('profile')
      .select('id, role')
      .eq('id', supplierId)
      .single();

    if (supplierError || !supplierData) {
      return {
        success: false,
        error: "Le fournisseur spécifié n'existe pas.",
      };
    }

    if (supplierData.role !== 'company') {
      return {
        success: false,
        error: "Le profil sélectionné n'est pas un fournisseur.",
      };
    }

    // Mettre à jour la mission
    const { error: updateError } = await supabase
      .from('mission')
      .update({ created_by: supplierId })
      .eq('id', missionId);

    if (updateError) {
      console.error(
        'Erreur lors de la mise à jour du fournisseur:',
        updateError
      );
      return {
        success: false,
        error: 'Une erreur est survenue lors de la mise à jour de la mission.',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return {
      success: false,
      error: 'Une erreur inattendue est survenue.',
    };
  }
};
