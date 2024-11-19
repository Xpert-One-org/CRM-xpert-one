alter table "public"."mission" alter column "state" drop default;

alter type "public"."mission_state" rename to "mission_state__old_version_to_be_dropped";

create type "public"."mission_state" as enum ('to_validate', 'open_all_to_validate', 'open', 'open_all', 'in_progress', 'deleted', 'finished', 'in_process', 'validated', 'refused');

alter table "public"."mission" alter column state type "public"."mission_state" using state::text::"public"."mission_state";

alter table "public"."mission" alter column "state" set default 'to_validate'::mission_state;

drop type "public"."mission_state__old_version_to_be_dropped";

alter table "public"."article" drop column "type";

alter table "public"."article" drop column "url";

drop type "public"."article_type";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_role TEXT;
    v_is_student BOOLEAN;
BEGIN
    -- Déterminer le rôle
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'NULL');
    
    -- Déterminer si c'est un étudiant
    v_is_student := (NEW.raw_user_meta_data->>'is_student')::boolean;

    -- Insérer dans public.profile avec toutes les métadonnées pertinentes
    INSERT INTO public.profile (
        id, firstname, lastname, email, mobile, role, 
        company_role, company_name, referent_id, 
        generated_id, username
    )
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'firstname',
        NEW.raw_user_meta_data->>'lastname',
        NEW.email,
        NEW.raw_user_meta_data->>'default_phone',
        CASE 
            WHEN v_is_student THEN 'xpert'
            ELSE v_role
        END,
        CASE 
            WHEN v_role = 'company' THEN NEW.raw_user_meta_data->>'company_role'
            ELSE NULL
        END,
        CASE 
            WHEN v_role = 'company' THEN NEW.raw_user_meta_data->>'company_name'
            ELSE NULL
        END,
        NEW.raw_user_meta_data->>'referent_generated_id',
        gen_random_uuid()::text, -- Utilise gen_random_uuid() au lieu de uuid_generate_v4()
        NEW.raw_user_meta_data->>'username'
    );

    RETURN NEW;
END;
$function$
;


