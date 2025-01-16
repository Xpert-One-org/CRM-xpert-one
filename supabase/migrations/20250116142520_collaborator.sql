drop view if exists "public"."unique_posts_with_referents";

drop view if exists "public"."unique_last_jobs";

alter table "public"."profile" add column "is_authorized_referent" boolean not null default true;

CREATE INDEX idx_affected_referent_id ON public.profile USING btree (affected_referent_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_referent()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    selected_referent_id UUID;
BEGIN
    IF NEW.role IN ('xpert', 'company') THEN
        SELECT id
        INTO selected_referent_id
        FROM public.profile
        WHERE role IN ('admin', 'project_manager')
          AND is_authorized_referent = TRUE
        ORDER BY (
        
            SELECT COUNT(*)
            FROM public.profile AS p
            WHERE p.affected_referent_id = public.profile.id
        ) ASC
        LIMIT 1;

        NEW.affected_referent_id := selected_referent_id;
    END IF;

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.do_nothing()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- La fonction ne fait rien
END;
$function$
;

CREATE OR REPLACE FUNCTION public.do_nothing_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- La fonction ne fait rien
    RETURN NEW; -- Retourne la ligne modifiée (nécessaire pour les triggers BEFORE)
END;
$function$
;

CREATE OR REPLACE FUNCTION public.enforce_is_authorized_referent()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.role IN ('xpert', 'company') THEN
        NEW.is_authorized_referent := FALSE;
    END IF;
    RETURN NEW;
END;
$function$
;

create or replace view "public"."unique_posts" as  SELECT DISTINCT pe.post
   FROM (profile_experience pe
     LEFT JOIN profile p ON (((p.id = pe.profile_id) AND (p.role = 'xpert'::profile_roles))))
  WHERE ((pe.post IS NOT NULL) AND (p.role = 'xpert'::profile_roles) AND (pe.is_last = 'true'::text))
  ORDER BY pe.post;


CREATE OR REPLACE FUNCTION public.notify_new_conversation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
BEGIN
    IF NEW.type <> 'chat' THEN
        RETURN NEW; 
    END IF;

    SELECT new_message_alert INTO alert_status
    FROM user_alerts
    WHERE user_id = NEW.receiver_id;

    IF alert_status IS NOT TRUE THEN
        RETURN NEW;
    END IF;

    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            p.firstname,
            p.lastname,
            p.generated_id
        FROM chat c
        JOIN profile p ON p.id = c.created_by
        WHERE c.created_by = NEW.created_by
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for created_by = %', NEW.created_by;
    END IF;

    -- Création de la notification
    PERFORM create_notification(
        NEW.receiver_id,
        'messagerie',
        '',
        'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
        ' (' || sender_info.generated_id || ') a démarré une nouvelle conversation avec vous',
        'info'::notification_status
    );
    
    RETURN NEW;
END;$function$
;

create or replace view "public"."unique_posts_with_referents" as  SELECT u.post,
    count(pe.id) AS post_count,
    array_agg(DISTINCT ROW(pr.id, pr.firstname, pr.lastname)::referent_type) FILTER (WHERE (pr.id IS NOT NULL)) AS referents
   FROM (((unique_posts u
     LEFT JOIN profile_experience pe ON (((u.post = pe.post) AND (pe.is_last = 'true'::text))))
     LEFT JOIN profile p ON ((pe.profile_id = p.id)))
     LEFT JOIN profile pr ON ((p.affected_referent_id = pr.id)))
  GROUP BY u.post
  ORDER BY u.post;


CREATE TRIGGER trigger_assign_referent BEFORE INSERT ON public.profile FOR EACH ROW EXECUTE FUNCTION assign_referent();

CREATE TRIGGER trigger_enforce_is_authorized_referent BEFORE INSERT OR UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION enforce_is_authorized_referent();


