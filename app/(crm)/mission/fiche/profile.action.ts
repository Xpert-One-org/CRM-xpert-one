'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

/**
 * Met à jour les scores d'évaluation d'un expert
 * @param xpertId L'ID de l'expert à mettre à jour
 * @param evaluationScore Le score d'évaluation (1-10)
 * @param selfEvaluationScore Le score d'auto-évaluation (1-10)
 */
export const updateXpertEvaluation = async (
  xpertId: string,
  evaluationScore?: number | null,
  selfEvaluationScore?: number | null
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

    const updateData: Record<string, any> = {};

    if (evaluationScore !== undefined) {
      // Validation du score d'évaluation
      if (
        evaluationScore !== null &&
        (evaluationScore < 1 || evaluationScore > 10)
      ) {
        return {
          success: false,
          error: "Le score d'évaluation doit être entre 1 et 10.",
        };
      }
      updateData.evaluation_score = evaluationScore;
    }

    if (selfEvaluationScore !== undefined) {
      // Validation du score d'auto-évaluation
      if (
        selfEvaluationScore !== null &&
        (selfEvaluationScore < 1 || selfEvaluationScore > 10)
      ) {
        return {
          success: false,
          error: "Le score d'auto-évaluation doit être entre 1 et 10.",
        };
      }
      updateData.self_evaluation_score = selfEvaluationScore;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: true,
        error: null,
      };
    }

    // Mettre à jour le profil de l'expert
    const { error: updateError } = await supabase
      .from('profile')
      .update(updateData)
      .eq('id', xpertId);

    if (updateError) {
      console.error(
        "Erreur lors de la mise à jour de l'évaluation:",
        updateError
      );
      return {
        success: false,
        error:
          "Une erreur est survenue lors de la mise à jour de l'évaluation.",
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
