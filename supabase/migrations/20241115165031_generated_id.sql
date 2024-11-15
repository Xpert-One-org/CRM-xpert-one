set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$DECLARE
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
        CASE
            WHEN new.raw_user_meta_data->>'role' = 'xpert' THEN public.generate_unique_id()::text
            ELSE public.generate_unique_id_f()::text
        END,  
        NEW.raw_user_meta_data->>'username'
    );

    RETURN NEW;
END;$function$
;


