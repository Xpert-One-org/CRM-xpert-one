drop trigger if exists "trigger_assign_referent" on "public"."profile";

alter table "public"."mission" add column "affected_referent_id" uuid;

alter table "public"."mission" add column "detail_deletion" text;

alter table "public"."mission" add constraint "mission_affected_referent_id_fkey" FOREIGN KEY (affected_referent_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."mission" validate constraint "mission_affected_referent_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_referent_mission()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    selected_referent_id UUID;
BEGIN
    -- Vérifie si aucun référent n'est affecté
    IF NEW.affected_referent_id IS NULL THEN
        -- Trouve un référent parmi les admins et chefs de projet autorisés
        SELECT id
        INTO selected_referent_id
        FROM public.profile
        WHERE role IN ('admin', 'project_manager')
          AND is_authorized_referent = TRUE
        ORDER BY (
            -- Compte le nombre de missions déjà affectées à chaque référent
            SELECT COUNT(*)
            FROM public.mission AS m
            WHERE m.affected_referent_id = public.profile.id
        ) ASC
        LIMIT 1;

        -- Affecte le référent sélectionné à la nouvelle mission
        NEW.affected_referent_id := selected_referent_id;
    END IF;

    -- Retourne la ligne modifiée
    RETURN NEW;
END;$function$
;

CREATE TRIGGER assign_referent_mission_trigger BEFORE INSERT ON public.mission FOR EACH ROW EXECUTE FUNCTION assign_referent_mission();

CREATE TRIGGER assign_referent_trigger BEFORE INSERT ON public.profile FOR EACH ROW EXECUTE FUNCTION assign_referent();


