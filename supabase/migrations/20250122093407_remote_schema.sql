

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."admin_opinion" AS ENUM (
    'positive',
    'neutral',
    'negative'
);


ALTER TYPE "public"."admin_opinion" OWNER TO "postgres";


CREATE TYPE "public"."article_status" AS ENUM (
    'published',
    'draft'
);


ALTER TYPE "public"."article_status" OWNER TO "postgres";


CREATE TYPE "public"."article_type" AS ENUM (
    'web',
    'link',
    'press'
);


ALTER TYPE "public"."article_type" OWNER TO "postgres";


CREATE TYPE "public"."categories" AS ENUM (
    'energy_and_nuclear',
    'renewable_energy',
    'waste_treatment',
    'process_industry',
    'water',
    'infrastructure',
    'entrepreneurship',
    'other',
    'relation_presse'
);


ALTER TYPE "public"."categories" OWNER TO "postgres";


CREATE TYPE "public"."chat_files" AS (
	"name" "text",
	"type" "text",
	"url" "text"
);


ALTER TYPE "public"."chat_files" OWNER TO "postgres";


CREATE TYPE "public"."chat_type" AS ENUM (
    'chat',
    'echo_community',
    'forum',
    'xpert_to_xpert'
);


ALTER TYPE "public"."chat_type" OWNER TO "postgres";


CREATE TYPE "public"."habilitation_detail" AS (
	"expiration_date" "date",
	"file_name" "text",
	"habilitation_name" "text"
);


ALTER TYPE "public"."habilitation_detail" OWNER TO "postgres";


CREATE TYPE "public"."mission_state" AS ENUM (
    'to_validate',
    'open_all_to_validate',
    'open',
    'open_all',
    'in_progress',
    'deleted',
    'finished',
    'in_process',
    'validated',
    'refused'
);


ALTER TYPE "public"."mission_state" OWNER TO "postgres";


CREATE TYPE "public"."msg_files" AS (
	"name" "text",
	"type" "text",
	"url" "text"
);


ALTER TYPE "public"."msg_files" OWNER TO "postgres";


CREATE TYPE "public"."notification_status" AS ENUM (
    'urgent',
    'info',
    'standard'
);


ALTER TYPE "public"."notification_status" OWNER TO "postgres";


CREATE TYPE "public"."profile_roles" AS ENUM (
    'xpert',
    'company',
    'admin',
    'project_manager',
    'intern',
    'hr',
    'adv'
);


ALTER TYPE "public"."profile_roles" OWNER TO "postgres";


CREATE TYPE "public"."reason_mission_deletion" AS ENUM (
    'status_candidate_not_found',
    'won_competition',
    'mission_suspended_by_supplier',
    'other'
);


ALTER TYPE "public"."reason_mission_deletion" OWNER TO "postgres";


CREATE TYPE "public"."referent_type" AS (
	"id" "uuid",
	"firstname" "text",
	"lastname" "text"
);


ALTER TYPE "public"."referent_type" OWNER TO "postgres";


CREATE TYPE "public"."revenu_type" AS ENUM (
    'tjm',
    'brut'
);


ALTER TYPE "public"."revenu_type" OWNER TO "postgres";


CREATE TYPE "public"."selection_column_type" AS ENUM (
    'postulant',
    'matching',
    'etude',
    'non-retenu',
    'discussions',
    'proposes',
    'refuses',
    'valides'
);


ALTER TYPE "public"."selection_column_type" OWNER TO "postgres";


CREATE TYPE "public"."task_history_action" AS ENUM (
    'created',
    'updated',
    'completed',
    'deleted'
);


ALTER TYPE "public"."task_history_action" OWNER TO "postgres";


CREATE TYPE "public"."task_status" AS ENUM (
    'urgent',
    'pending',
    'done'
);


ALTER TYPE "public"."task_status" OWNER TO "postgres";


CREATE TYPE "public"."task_subject_type" AS ENUM (
    'xpert',
    'supplier',
    'mission',
    'other'
);


ALTER TYPE "public"."task_subject_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_referent"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
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
END;$$;


ALTER FUNCTION "public"."assign_referent"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_referent_mission"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
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
END;$$;


ALTER FUNCTION "public"."assign_referent_mission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_matching_score"("p_mission_id" bigint, "p_xpert_id" "uuid") RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_score numeric;
    v_mission mission;
    v_profile_mission profile_mission;
    v_profile_expertise profile_expertise;
    v_profile_experience profile_experience;
    v_total_criteria integer := 0;
    v_matching_criteria numeric := 0;
    v_partial_matches numeric := 0;
    v_points_per_criteria numeric;
BEGIN
    -- Get mission and profile data
    SELECT * INTO v_mission FROM mission WHERE id = p_mission_id;
    SELECT * INTO v_profile_mission FROM profile_mission WHERE profile_id = p_xpert_id;
    SELECT * INTO v_profile_expertise FROM profile_expertise WHERE profile_id = p_xpert_id;
    SELECT * INTO v_profile_experience FROM profile_experience WHERE profile_id = p_xpert_id ORDER BY id DESC LIMIT 1;

    -- Count total criteria
    v_total_criteria := (
        CASE WHEN v_mission.job_title IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN v_mission.post_type IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN v_mission.sector IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN v_mission.specialties IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN v_mission.expertises IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN v_mission.languages IS NOT NULL THEN 1 ELSE 0 END +
        -- New criteria
        CASE WHEN v_mission.start_date IS NOT NULL THEN 1 ELSE 0 END + -- Availability
        1 + -- Management (always counted as it's a boolean state)
        CASE WHEN v_mission.open_to_disabled IS NOT NULL THEN 1 ELSE 0 END -- Handicap
    );
    
    -- Handle division by zero
    IF v_total_criteria = 0 THEN
        RETURN 0;
    END IF;

    v_points_per_criteria := 100.0 / v_total_criteria;

    -- Previous criteria checks...
    -- Job Title
    IF v_mission.job_title IS NOT NULL THEN
        IF v_profile_mission.job_titles @> ARRAY[v_mission.job_title] THEN
            v_matching_criteria := v_matching_criteria + 1;
        END IF;
    END IF;

    -- Post Type with partial matching
    IF v_mission.post_type IS NOT NULL THEN
        SELECT COALESCE(
            ARRAY_LENGTH(ARRAY(
                SELECT UNNEST(v_mission.post_type) 
                INTERSECT 
                SELECT UNNEST(v_profile_experience.post_type)
            ), 1)::numeric / ARRAY_LENGTH(v_mission.post_type, 1), 
            0
        ) * v_points_per_criteria * 0.5
        INTO v_partial_matches;
        
        IF v_profile_experience.post_type && v_mission.post_type THEN
            v_matching_criteria := v_matching_criteria + 1;
        ELSE
            v_matching_criteria := v_matching_criteria + (v_partial_matches / v_points_per_criteria);
        END IF;
    END IF;

    -- Sector
    IF v_mission.sector IS NOT NULL THEN
        IF v_profile_experience.sector = v_mission.sector THEN
            v_matching_criteria := v_matching_criteria + 1;
        END IF;
    END IF;

    -- Specialties with partial matching
    IF v_mission.specialties IS NOT NULL THEN
        SELECT COALESCE(
            ARRAY_LENGTH(ARRAY(
                SELECT UNNEST(v_mission.specialties) 
                INTERSECT 
                SELECT UNNEST(v_profile_mission.specialties)
            ), 1)::numeric / ARRAY_LENGTH(v_mission.specialties, 1),
            0
        ) * v_points_per_criteria * 0.5
        INTO v_partial_matches;
        
        IF v_profile_mission.specialties && v_mission.specialties THEN
            v_matching_criteria := v_matching_criteria + 1;
        ELSE
            v_matching_criteria := v_matching_criteria + (v_partial_matches / v_points_per_criteria);
        END IF;
    END IF;

    -- Expertises with partial matching
    IF v_mission.expertises IS NOT NULL THEN
        SELECT COALESCE(
            ARRAY_LENGTH(ARRAY(
                SELECT UNNEST(v_mission.expertises) 
                INTERSECT 
                SELECT UNNEST(v_profile_expertise.expertises)
            ), 1)::numeric / ARRAY_LENGTH(v_mission.expertises, 1),
            0
        ) * v_points_per_criteria * 0.5
        INTO v_partial_matches;
        
        IF v_profile_expertise.expertises && v_mission.expertises THEN
            v_matching_criteria := v_matching_criteria + 1;
        ELSE
            v_matching_criteria := v_matching_criteria + (v_partial_matches / v_points_per_criteria);
        END IF;
    END IF;

    -- Languages
    IF v_mission.languages IS NOT NULL THEN
        IF v_profile_expertise.maternal_language = ANY(v_mission.languages) THEN
            v_matching_criteria := v_matching_criteria + 1;
        END IF;
    END IF;

    -- New criteria checks...
    -- Availability
    IF v_mission.start_date IS NOT NULL AND v_profile_mission.availability IS NOT NULL THEN
        IF v_profile_mission.availability::timestamp <= v_mission.start_date THEN
            v_matching_criteria := v_matching_criteria + 1;
        ELSE
            -- Partial match if available within 1 month of start date
            IF v_profile_mission.availability::timestamp <= v_mission.start_date + interval '1 month' THEN
                v_matching_criteria := v_matching_criteria + 0.5;
            END IF;
        END IF;
    END IF;

    -- Management (has_led_team)
    SELECT 
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM profile_experience 
                WHERE profile_id = p_xpert_id 
                AND has_led_team = 'true'
            ) THEN 1
            ELSE 0
        END 
    INTO v_partial_matches;
    v_matching_criteria := v_matching_criteria + v_partial_matches;

    -- Handicap (workstation_needed)
    IF v_mission.open_to_disabled IS NOT NULL THEN
        IF (v_mission.open_to_disabled = 'true' AND v_profile_mission.workstation_needed = 'true') OR
           (v_mission.open_to_disabled = 'false' AND v_profile_mission.workstation_needed = 'false') THEN
            v_matching_criteria := v_matching_criteria + 1;
        END IF;
    END IF;

    -- Calculate final score
    v_score := (v_matching_criteria / v_total_criteria) * 100;
    
    -- Round to one decimal place and ensure score is between 0 and 100
    RETURN GREATEST(0, LEAST(100, ROUND(v_score::numeric, 1)));
END;
$$;


ALTER FUNCTION "public"."calculate_matching_score"("p_mission_id" bigint, "p_xpert_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_mission_checkpoints"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO mission_checkpoints (
    mission_id,
    created_at,
    updated_at,
    point_j_moins_10_f,
    point_j_moins_10_x,
    point_j_plus_10_f,
    point_j_plus_10_x,
    point_j_plus_10_referent,
    point_rh_fin_j_plus_10_f,
    point_fin_j_moins_30
  ) VALUES (
    NEW.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_mission_checkpoints"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_notification"("user_id" "uuid", "link" "text", "message" "text", "subject" "text", "status" "public"."notification_status" DEFAULT 'standard'::"public"."notification_status", "is_global" boolean DEFAULT false, "category" "text" DEFAULT ''::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO notification (
        user_id,
        link,
        message,
        subject,
        status,
        is_global,
        category,
        created_at
    ) VALUES (
        user_id,
        link,
        message,
        subject,
        status,
        is_global,
        category,
        NOW()
    );
END;
$$;


ALTER FUNCTION "public"."create_notification"("user_id" "uuid", "link" "text", "message" "text", "subject" "text", "status" "public"."notification_status", "is_global" boolean, "category" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_selection_matching"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Insert into selection_matching
  INSERT INTO selection_matching (
    mission_id,
    xpert_id,
    matching_score,
    column_status,
    is_matched,
    is_candidate
  )
  VALUES (
    NEW.mission_id,
    NEW.candidate_id,
    calculate_matching_score(NEW.mission_id, NEW.candidate_id),
    'postulant',
    false,
    true
  )
  ON CONFLICT (mission_id, xpert_id) DO UPDATE
  SET 
    matching_score = EXCLUDED.matching_score,
    column_status = EXCLUDED.column_status,
    is_matched = EXCLUDED.is_matched,
    is_candidate = EXCLUDED.is_candidate;

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."create_selection_matching"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."do_nothing"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- La fonction ne fait rien
END;
$$;


ALTER FUNCTION "public"."do_nothing"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."do_nothing_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- La fonction ne fait rien
    RETURN NEW; -- Retourne la ligne modifiée (nécessaire pour les triggers BEFORE)
END;
$$;


ALTER FUNCTION "public"."do_nothing_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_is_authorized_referent"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.role IN ('xpert', 'company') THEN
        NEW.is_authorized_referent := FALSE;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."enforce_is_authorized_referent"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_mission_unique_id"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  new_mission_number TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Génère un numéro aléatoire entre 1000 et 9999
    new_mission_number := 'M ' || TO_CHAR((1000 + floor(random() * 9000)::int), 'FM0000');
    
    -- Vérifie si ce numéro existe déjà
    SELECT EXISTS (
      SELECT 1 
      FROM public.mission 
      WHERE mission_number = new_mission_number
    ) INTO id_exists;
    
    -- Sort de la boucle si le numéro n'existe pas
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_mission_number;
END;$$;


ALTER FUNCTION "public"."generate_mission_unique_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_new_mission_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  new_mission_number TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Génère un numéro aléatoire entre 1000 et 9999
    new_mission_number := 'M ' || TO_CHAR((1000 + floor(random() * 9000)::int), 'FM0000');
    
    -- Vérifie si ce numéro existe déjà
    SELECT EXISTS (
      SELECT 1 
      FROM public.mission 
      WHERE mission_number = new_mission_number
    ) INTO id_exists;
    
    -- Sort de la boucle si le numéro n'existe pas
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_mission_number;
END;$$;


ALTER FUNCTION "public"."generate_new_mission_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_id"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_generated_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_generated_id := 'X ' || (1000 + floor(random() * 9000)::int);
    SELECT EXISTS (SELECT 1 FROM public.profile WHERE generated_id = new_generated_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_generated_id;
END;
$$;


ALTER FUNCTION "public"."generate_unique_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_id_f"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_generated_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_generated_id := 'F ' || (1000 + floor(random() * 9000)::int);
    SELECT EXISTS (SELECT 1 FROM public.profile WHERE generated_id = new_generated_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_generated_id;
END;
$$;


ALTER FUNCTION "public"."generate_unique_id_f"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_slug"("input_text" "text", "table_name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    base_slug TEXT;
    new_slug TEXT;
    slug_count INT;
BEGIN
    -- Generate the base slug with unaccent function
    base_slug := LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                unaccent(input_text),  -- Remove accents
                '[^\w\s]+', '', 'g'    -- Remove special characters
            ),
            '\s+', '-', 'g'          -- Replace spaces with hyphens
        )
    );

    -- Check if the slug is unique
    SELECT COUNT(*) INTO slug_count 
    FROM (
        SELECT slug FROM public.article WHERE slug = base_slug
        UNION
        SELECT slug FROM public.article WHERE slug LIKE base_slug || '-%'
    ) AS temp;

    -- If it's unique, return the base slug
    IF slug_count = 0 THEN
        RETURN base_slug;
    ELSE
        -- If not, append a number to make it unique
        new_slug := base_slug || '-' || (slug_count + 1)::TEXT;
        RETURN new_slug;
    END IF;
END;$$;


ALTER FUNCTION "public"."generate_unique_slug"("input_text" "text", "table_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_combined_data"() RETURNS TABLE("company_roles" "text", "diplomas" "text", "expertises" "text", "habilitations" "text", "infrastructures" "text", "job_titles" "text", "juridic_status" "text", "languages" "text", "posts" "text", "sectors" "text", "specialties" "text", "subjects" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.company_roles,
    d.diplomas,
    e.expertises,
    h.habilitations,
    i.infrastructures,
    j.job_titles,
    js.juridic_status,
    l.languages,
    p.posts,
    s.sectors,
    sp.specialties,
    sub.subjects
  FROM 
    company_roles_table c,
    diplomas_table d,
    expertises_table e,
    habilitations_table h,
    infrastructures_table i,
    job_titles_table j,
    juridic_status_table js,
    languages_table l,
    posts_table p,
    sectors_table s,
    specialties_table sp,
    subjects_table sub;
END;
$$;


ALTER FUNCTION "public"."get_combined_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_full_profile"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN jsonb_agg(
        jsonb_build_object(
            'profile', profile,
            'profile_status', profile_status,
            'profile_education', profile_education,
            'profile_expertise', profile_expertise,
            'profile_experience', profile_experience,
            'profile_mission', profile_mission
        )
    )
    FROM 
        profile
    LEFT JOIN 
        profile_status ON profile.id = profile_status.profile_id
    LEFT JOIN 
        profile_education ON profile.id = profile_education.profile_id
    LEFT JOIN 
        profile_expertise ON profile.id = profile_expertise.profile_id
    LEFT JOIN 
        profile_experience ON profile.id = profile_experience.profile_id
    LEFT JOIN 
        profile_mission ON profile.id = profile_mission.profile_id;
END;
$$;


ALTER FUNCTION "public"."get_full_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_job_titles_search"("titles" "text"[]) RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
    RETURN array_to_string(titles, ',');
END;
$$;


ALTER FUNCTION "public"."get_job_titles_search"("titles" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profile_other_languages"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
begin
  return (
    select jsonb_agg(other_language)
    from profile_expertise
  );
end;
$$;


ALTER FUNCTION "public"."get_profile_other_languages"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
    v_role text;
    v_generated_id TEXT;
BEGIN
    -- Log pour debug
    RAISE NOTICE 'Raw user meta data: %', NEW.raw_user_meta_data;
    
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'xpert');
    
    v_generated_id := CASE 
        WHEN v_role = 'xpert' THEN public.generate_unique_id()::text
        ELSE public.generate_unique_id_f()::text
    END;

    -- Log pour debug
    RAISE NOTICE 'Attempting to insert with role: %, generated_id: %', v_role, v_generated_id;

    INSERT INTO public.profile (
        id,
        email,
        role,
        firstname,
        lastname,
        mobile,
        company_role,
        company_name,
        referent_id,
        generated_id
    )
    VALUES (
        NEW.id,
        NEW.email,
        (v_role)::public.profile_roles,
        NEW.raw_user_meta_data->>'firstname',
        NEW.raw_user_meta_data->>'lastname',
        NEW.raw_user_meta_data->>'mobile',
        CASE WHEN v_role = 'company' THEN NEW.raw_user_meta_data->>'company_role' ELSE NULL END,
        CASE WHEN v_role = 'company' THEN NEW.raw_user_meta_data->>'company_name' ELSE NULL END,
        NEW.raw_user_meta_data->>'referent_id',
        v_generated_id
    );

    RETURN NEW;

END;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_email_confirmation"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$begin
    PERFORM net.http_post(
      url := 'https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/new-user',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4am5yamFrandqaHZzaXdoZWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MDU1NDYsImV4cCI6MjAzNzM4MTU0Nn0.G7kFgQpJHGhLNcCDlbcv9-DjVFmzDtwZGVAemuLS7W8"}'::jsonb,
      body:=concat('{"email": "', NEW.email, '"}')::jsonb
    );
    return new;
end;$$;


ALTER FUNCTION "public"."notify_email_confirmation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_conversation"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    display_name TEXT;
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
            p.role,
            p.generated_id
        FROM chat c
        JOIN profile p ON p.id = c.created_by
        WHERE c.created_by = NEW.created_by
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for created_by = %', NEW.created_by;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    -- Création de la notification
    PERFORM create_notification(
        NEW.receiver_id,
        'messagerie',
        display_name || ' a démarré une nouvelle conversation avec vous',
        'Messagerie',
        'info'::notification_status
    );
    
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_new_conversation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_echo_message"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    chat_type TEXT;
    notification_receiver_id UUID; 
    display_name TEXT;
BEGIN
    SELECT c.type INTO chat_type
    FROM chat c
    WHERE c.id = NEW.chat_id;

    IF chat_type <> 'echo_community' THEN
        RETURN NEW;
    END IF;

    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            c.created_by,
            c.title,
            c.receiver_id,
            p.firstname,
            p.lastname,
            p.generated_id,
            p.role
        FROM chat c
        JOIN profile p ON p.id = NEW.send_by 
        WHERE c.id = NEW.chat_id 
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for chat_id = %', NEW.chat_id;
    END IF;

    IF NEW.send_by = sender_info.created_by THEN
        notification_receiver_id := sender_info.receiver_id;
    ELSE
        notification_receiver_id := sender_info.created_by;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    PERFORM create_notification(
        notification_receiver_id,
        'communaute/echo-de-la-communaute',
        display_name || ' a envoyé un message',
        'Echo de la communauté : '||sender_info.title,
        'info'::notification_status,
        true
    );
    
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_new_echo_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_forum_message"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    chat_type TEXT;
    notification_receiver_id UUID; 
    display_name TEXT;
BEGIN
    SELECT c.type INTO chat_type
    FROM chat c
    WHERE c.id = NEW.chat_id;

    IF chat_type <> 'forum' THEN
        RETURN NEW;
    END IF;

    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            c.created_by,
            c.title,
            c.receiver_id,
            c.category,
            p.firstname,
            p.lastname,
            p.generated_id,
            p.role
        FROM chat c
        JOIN profile p ON p.id = NEW.send_by 
        WHERE c.id = NEW.chat_id 
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for chat_id = %', NEW.chat_id;
    END IF;

    IF NEW.send_by = sender_info.created_by THEN
        notification_receiver_id := sender_info.receiver_id;
    ELSE
        notification_receiver_id := sender_info.created_by;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    PERFORM create_notification(
        notification_receiver_id,
        'communaute/forum',
        display_name || ' a envoyé un message',
        'Forum : '||sender_info.title,
        'info'::notification_status,
        true,
        sender_info.category
    );
    
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_new_forum_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_message"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    chat_type TEXT;
    notification_receiver_id UUID; 
    display_name TEXT;

BEGIN
    SELECT c.type INTO chat_type
    FROM chat c
    WHERE c.id = NEW.chat_id;

    IF chat_type <> 'chat' THEN
        RETURN NEW;
    END IF;

   
    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            c.created_by,
            c.receiver_id,
            p.firstname,
            p.lastname,
            p.generated_id,
            p.role

        FROM chat c
        JOIN profile p ON p.id = NEW.send_by 
        WHERE c.id = NEW.chat_id 
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for chat_id = %', NEW.chat_id;
    END IF;

    IF NEW.send_by = sender_info.created_by THEN
       
        notification_receiver_id := sender_info.receiver_id;
    ELSE
       
        notification_receiver_id := sender_info.created_by;
    END IF;

    SELECT new_message_alert INTO alert_status
    FROM user_alerts
    WHERE user_id = notification_receiver_id;

    IF alert_status IS NOT TRUE THEN
        RETURN NEW;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    PERFORM create_notification(
        notification_receiver_id,
        'messagerie',
        display_name || ' vous a envoyé un message',
        'Messagerie'
        'info'::notification_status
    );
    
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_new_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_task"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    PERFORM create_notification(
        NEW.assigned_to,
        'dashboard/todo'::text,
        'Nouvelle tâche créée : '::text || NEW.details::text,
        'Todolist'::text,
        CASE 
            WHEN NEW.status = 'urgent' THEN 'urgent'::notification_status
            ELSE 'standard'::notification_status
        END
    );
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_new_task"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_task_done"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    IF NEW.status = 'done' AND OLD.status != 'done' THEN
        PERFORM create_notification(
            NEW.assigned_to, 
            'dashboard/todo'::text,
            'La tâche n°' || NEW.id || ' a été traitée'::text,
            'Todolist'
            'info'::notification_status 
        );
    END IF;
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_task_done"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_unique_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.slug := generate_unique_slug(NEW.title, TG_TABLE_NAME);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_unique_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_chat_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Update the updated_at column in the related chat
  UPDATE public.chat
  SET updated_at = NOW()
  WHERE id = NEW.chat_id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_chat_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_mission_checkpoints_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_mission_checkpoints_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_progression"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
        NEW.totale_progression := NEW.profile_progression / 4 + NEW.expertise_progression / 4 + NEW.mission_progression / 4 + NEW.status_progression / 4;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_progression"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_task_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.last_updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_task_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_xpert_notes_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_xpert_notes_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."article" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "content" "text",
    "author_id" "uuid",
    "image" "text",
    "description" "text",
    "slug" "text",
    "category" "text",
    "categories" "public"."categories"[],
    "status" "public"."article_status" DEFAULT 'published'::"public"."article_status" NOT NULL,
    "type" "public"."article_type" DEFAULT 'web'::"public"."article_type",
    "url" "text"
);


ALTER TABLE "public"."article" OWNER TO "postgres";


ALTER TABLE "public"."article" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."article_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."chat" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "title" "text" NOT NULL,
    "topic" "text" NOT NULL,
    "mission_id" bigint,
    "category" "text",
    "type" "public"."chat_type" DEFAULT 'chat'::"public"."chat_type" NOT NULL,
    "receiver_id" "uuid",
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "chk_xpert_recipient_id" CHECK ((("type" <> 'xpert_to_xpert'::"public"."chat_type") OR ("receiver_id" IS NOT NULL)))
);


ALTER TABLE "public"."chat" OWNER TO "postgres";


ALTER TABLE "public"."chat" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chat_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."chat_notes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "chat_id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."chat_notes" OWNER TO "postgres";


ALTER TABLE "public"."chat_notes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chat_notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."company_roles" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."company_roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."company_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_roles_id_seq" OWNED BY "public"."company_roles"."id";



CREATE TABLE IF NOT EXISTS "public"."contact_xpert_demands" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "state" "text",
    "sent_by" "uuid",
    "message" "text",
    "asked_xpert" "text"
);


ALTER TABLE "public"."contact_xpert_demands" OWNER TO "postgres";


ALTER TABLE "public"."contact_xpert_demands" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."contact_xpert_demands_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."diplomas" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."diplomas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."diplomas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."diplomas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."diplomas_id_seq" OWNED BY "public"."diplomas"."id";



CREATE TABLE IF NOT EXISTS "public"."profile_expertise" (
    "id" integer NOT NULL,
    "seniority" integer,
    "specialties" "text"[],
    "expertises" "text"[],
    "diploma" "text",
    "degree" "text",
    "others" "text",
    "maternal_language" "text",
    "cv_name" "text",
    "profile_id" "uuid" DEFAULT "auth"."uid"(),
    "other_language" "jsonb"[],
    "specialties_other" "text",
    "expertises_other" "text",
    "habilitations_other" "text",
    "other_language_detail" "text",
    "maternal_language_other" "text",
    "degree_other" "text",
    "habilitations" "text"[],
    "habilitations_details" "jsonb"[]
);


ALTER TABLE "public"."profile_expertise" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."expertise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."expertise_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."expertise_id_seq" OWNED BY "public"."profile_expertise"."id";



CREATE TABLE IF NOT EXISTS "public"."expertises" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."expertises" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."expertises_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."expertises_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."expertises_id_seq" OWNED BY "public"."expertises"."id";



CREATE TABLE IF NOT EXISTS "public"."habilitations" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."habilitations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."habilitations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."habilitations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."habilitations_id_seq" OWNED BY "public"."habilitations"."id";



CREATE TABLE IF NOT EXISTS "public"."infrastructures" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."infrastructures" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."infrastructures_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."infrastructures_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."infrastructures_id_seq" OWNED BY "public"."infrastructures"."id";



CREATE TABLE IF NOT EXISTS "public"."job_titles" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "image" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."job_titles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."job_titles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."job_titles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."job_titles_id_seq" OWNED BY "public"."job_titles"."id";



CREATE TABLE IF NOT EXISTS "public"."juridic_status" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."juridic_status" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."juridic_status_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."juridic_status_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."juridic_status_id_seq" OWNED BY "public"."juridic_status"."id";



CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."languages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."languages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."languages_id_seq" OWNED BY "public"."languages"."id";



CREATE TABLE IF NOT EXISTS "public"."message" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "chat_id" bigint,
    "content" "text",
    "reactions" "jsonb"[],
    "send_by" "uuid" DEFAULT "auth"."uid"(),
    "read_by" "uuid"[] DEFAULT ARRAY["auth"."uid"()] NOT NULL,
    "answer_to" bigint,
    "is_pinned" boolean DEFAULT false,
    "files" "public"."msg_files"[]
);


ALTER TABLE "public"."message" OWNER TO "postgres";


ALTER TABLE "public"."message" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mission" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mission_number" "text" DEFAULT "public"."generate_new_mission_number"(),
    "job_title" "text",
    "description" "text",
    "post_type" "text"[],
    "sector" "text",
    "specialties" "text"[],
    "expertises" "text"[],
    "languages" "text"[],
    "diplomas" "text"[],
    "advantages_company" "text",
    "profile_searched" "text",
    "tjm" "text",
    "open_to_disabled" "text",
    "city" "text",
    "street_number" smallint,
    "address" "text",
    "postal_code" "text",
    "country" "text",
    "needed" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "referent_name" "text",
    "referent_mobile" "text",
    "referent_fix" "text",
    "referent_mail" "text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "deadline_application" timestamp with time zone,
    "xpert_associated_id" "uuid",
    "job_title_other" "text",
    "sector_energy" "text",
    "sector_renewable_energy" "text",
    "sector_waste_treatment" "text",
    "sector_infrastructure" "text",
    "specialties_other" "text",
    "expertises_other" "text",
    "diplomas_other" "text",
    "languages_other" "text",
    "sector_other" "text",
    "sector_infrastructure_other" "text",
    "sector_renewable_energy_other" "text",
    "signed_quote_file_name" "text",
    "contract_file_name" "text",
    "state" "public"."mission_state" DEFAULT 'in_process'::"public"."mission_state" NOT NULL,
    "image_url" "text",
    "reason_deletion" "public"."reason_mission_deletion",
    "deleted_at" timestamp with time zone,
    "xpert_associated_status" "text",
    "facturation_fournisseur_payment" "jsonb"[],
    "facturation_salary_payment" "jsonb"[],
    "facturation_invoice_paid" "jsonb"[],
    "show_on_website" boolean DEFAULT false,
    "affected_referent_id" "uuid",
    "detail_deletion" "text"
);


ALTER TABLE "public"."mission" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mission_application" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "candidate_id" "uuid",
    "mission_id" bigint
);


ALTER TABLE "public"."mission_application" OWNER TO "postgres";


ALTER TABLE "public"."mission_application" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mission_application_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mission_canceled" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mission" bigint,
    "reason" "text"
);


ALTER TABLE "public"."mission_canceled" OWNER TO "postgres";


ALTER TABLE "public"."mission_canceled" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mission_canceled_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mission_checkpoints" (
    "id" bigint NOT NULL,
    "mission_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "point_j_moins_10_f" boolean DEFAULT false NOT NULL,
    "point_j_moins_10_x" boolean DEFAULT false NOT NULL,
    "point_j_plus_10_f" boolean DEFAULT false NOT NULL,
    "point_j_plus_10_x" boolean DEFAULT false NOT NULL,
    "point_j_plus_10_referent" boolean DEFAULT false NOT NULL,
    "point_rh_fin_j_plus_10_f" boolean DEFAULT false NOT NULL,
    "point_fin_j_moins_30" boolean DEFAULT false NOT NULL,
    "point_trimestre_x" boolean DEFAULT false
);


ALTER TABLE "public"."mission_checkpoints" OWNER TO "postgres";


ALTER TABLE "public"."mission_checkpoints" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mission_checkpoints_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."mission" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."mission_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mission_notes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "mission_id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."mission_notes" OWNER TO "postgres";


ALTER TABLE "public"."mission_notes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mission_notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notification" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "link" "text",
    "message" "text" NOT NULL,
    "status" "public"."notification_status" DEFAULT 'standard'::"public"."notification_status" NOT NULL,
    "subject" "text",
    "user_id" "uuid",
    "category" "text",
    "is_global" boolean DEFAULT false
);


ALTER TABLE "public"."notification" OWNER TO "postgres";


ALTER TABLE "public"."notification" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."posts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."posts_id_seq" OWNED BY "public"."posts"."id";



CREATE TABLE IF NOT EXISTS "public"."profile" (
    "civility" "text",
    "birthdate" "text",
    "firstname" "text",
    "lastname" "text",
    "generated_id" "text" NOT NULL,
    "mobile" "text",
    "fix" "text",
    "email" "text",
    "street_number" "text",
    "address" "text",
    "city" "text",
    "postal_code" "text",
    "country" "text",
    "linkedin" "text",
    "how_did_you_hear_about_us" "text",
    "how_did_you_hear_about_us_other" "text",
    "id" "uuid" NOT NULL,
    "role" "public"."profile_roles" DEFAULT 'xpert'::"public"."profile_roles" NOT NULL,
    "company_role" "text",
    "company_name" "text",
    "referent_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "totale_progression" smallint DEFAULT '0'::smallint NOT NULL,
    "profile_progression" smallint DEFAULT '0'::smallint NOT NULL,
    "expertise_progression" smallint DEFAULT '0'::smallint NOT NULL,
    "status_progression" smallint DEFAULT '0'::smallint NOT NULL,
    "mission_progression" smallint DEFAULT '0'::smallint NOT NULL,
    "sector" "text",
    "service_dependance" "text",
    "siret" "text",
    "username" "text",
    "avatar_url" "text",
    "has_seen_my_missions" boolean DEFAULT false,
    "has_seen_available_missions" boolean DEFAULT false,
    "has_seen_messaging" boolean DEFAULT false,
    "has_seen_community" boolean DEFAULT false,
    "has_seen_blog" boolean DEFAULT false,
    "has_seen_newsletter" boolean DEFAULT false,
    "has_seen_my_profile" boolean DEFAULT false,
    "sector_other" "text",
    "company_role_other" "text",
    "has_seen_created_missions" boolean DEFAULT false,
    "area" "text"[],
    "france_detail" "text"[],
    "regions" "text"[],
    "sector_renewable_energy" "text",
    "sector_waste_treatment" "text",
    "sector_energy" "text",
    "sector_infrastructure" "text",
    "sector_infrastructure_other" "text",
    "sector_renewable_energy_other" "text",
    "cv_name" "text",
    "community_banning_explanations" "text",
    "is_banned_from_community" boolean DEFAULT false NOT NULL,
    "admin_opinion" "public"."admin_opinion",
    "affected_referent_id" "uuid",
    "collaborator_is_absent" boolean DEFAULT false,
    "collaborator_replacement_id" "uuid",
    "get_welcome_call" boolean DEFAULT false,
    "is_authorized_referent" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."profile" OWNER TO "postgres";


COMMENT ON COLUMN "public"."profile"."role" IS 'Xpert or Company';



CREATE TABLE IF NOT EXISTS "public"."profile_education" (
    "id" integer NOT NULL,
    "education_diploma" "text",
    "detail_diploma" "text",
    "school" "text",
    "department" "text",
    "education_others" "text",
    "profile_id" "uuid"
);


ALTER TABLE "public"."profile_education" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."profile_education_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."profile_education_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."profile_education_id_seq" OWNED BY "public"."profile_education"."id";



CREATE TABLE IF NOT EXISTS "public"."profile_experience" (
    "id" integer NOT NULL,
    "is_last" "text",
    "post" "text",
    "company" "text",
    "duree" "text",
    "has_led_team" "text" DEFAULT 'false'::"text" NOT NULL,
    "how_many_people_led" "text",
    "sector" "text",
    "comments" "text",
    "profile_id" "uuid",
    "sector_energy" "text",
    "sector_renewable_energy" "text",
    "sector_waste_treatment" "text",
    "sector_infrastructure" "text",
    "post_type" "text"[],
    "post_other" "text",
    "sector_other" "text",
    "sector_infrastructure_other" "text",
    "sector_renewable_energy_other" "text"
);


ALTER TABLE "public"."profile_experience" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."profile_experience_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."profile_experience_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."profile_experience_id_seq" OWNED BY "public"."profile_experience"."id";



CREATE TABLE IF NOT EXISTS "public"."profile_mission" (
    "id" integer NOT NULL,
    "sector" "text"[],
    "posts_type" "text"[],
    "specialties" "text"[],
    "expertises" "text"[],
    "others" "text",
    "availability" "text",
    "desired_tjm" "text",
    "desired_monthly_brut" "text",
    "workstation_needed" "text" DEFAULT 'false'::"text",
    "workstation_description" "text",
    "profile_id" "uuid" DEFAULT "auth"."uid"(),
    "student_contract" "text",
    "revenu_type" "public"."revenu_type",
    "sector_other" "text",
    "specialties_others" "text",
    "expertises_others" "text",
    "area" "text"[],
    "regions" "text"[],
    "france_detail" "text"[],
    "job_titles" "text"[],
    "job_titles_other" "text",
    "job_titles_search" "text" GENERATED ALWAYS AS ("public"."get_job_titles_search"("job_titles")) STORED
);


ALTER TABLE "public"."profile_mission" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."profile_mission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."profile_mission_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."profile_mission_id_seq" OWNED BY "public"."profile_mission"."id";



CREATE TABLE IF NOT EXISTS "public"."profile_status" (
    "id" integer NOT NULL,
    "iam" "text",
    "status" "text",
    "company_name" "text",
    "juridic_status" "text",
    "siret" "text",
    "has_portage" boolean,
    "portage_name" "text",
    "urssaf_name" "text",
    "kbis_name" "text",
    "civil_responsability_name" "text",
    "rib_name" "text",
    "profile_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "juridic_status_other" "text"
);


ALTER TABLE "public"."profile_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sectors" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."sectors" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."sectors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."sectors_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."sectors_id_seq" OWNED BY "public"."sectors"."id";



CREATE TABLE IF NOT EXISTS "public"."selection_matching" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mission_id" bigint NOT NULL,
    "xpert_id" "uuid" NOT NULL,
    "matching_score" numeric(5,2) NOT NULL,
    "column_status" "public"."selection_column_type" DEFAULT 'postulant'::"public"."selection_column_type" NOT NULL,
    "is_matched" boolean DEFAULT true NOT NULL,
    "is_candidate" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."selection_matching" OWNER TO "postgres";


ALTER TABLE "public"."selection_matching" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."selection_matching_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."specialties" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."specialties" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."specialties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."specialties_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."specialties_id_seq" OWNED BY "public"."specialties"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."status_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."status_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."status_id_seq" OWNED BY "public"."profile_status"."id";



CREATE TABLE IF NOT EXISTS "public"."subjects" (
    "id" integer NOT NULL,
    "label" character varying(255),
    "value" character varying(255),
    "json_key" character varying(255)
);


ALTER TABLE "public"."subjects" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."subjects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."subjects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."subjects_id_seq" OWNED BY "public"."subjects"."id";



CREATE TABLE IF NOT EXISTS "public"."supplier_notes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."supplier_notes" OWNER TO "postgres";


ALTER TABLE "public"."supplier_notes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."supplier_notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."task_history" (
    "id" bigint NOT NULL,
    "task_id" bigint NOT NULL,
    "action" "public"."task_history_action" NOT NULL,
    "changed_by" "uuid" NOT NULL,
    "changed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "old_values" "jsonb",
    "new_values" "jsonb"
);


ALTER TABLE "public"."task_history" OWNER TO "postgres";


ALTER TABLE "public"."task_history" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."task_history_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "assigned_to" "uuid" NOT NULL,
    "subject_type" "public"."task_subject_type" NOT NULL,
    "xpert_id" "uuid",
    "supplier_id" "uuid",
    "mission_id" bigint,
    "details" "text",
    "status" "public"."task_status" DEFAULT 'pending'::"public"."task_status" NOT NULL,
    "completed_at" timestamp with time zone,
    "last_updated_at" timestamp with time zone,
    "last_updated_by" "uuid",
    CONSTRAINT "check_subject_references" CHECK (((("subject_type" = 'xpert'::"public"."task_subject_type") AND ("xpert_id" IS NOT NULL) AND ("supplier_id" IS NULL) AND ("mission_id" IS NULL)) OR (("subject_type" = 'supplier'::"public"."task_subject_type") AND ("supplier_id" IS NOT NULL) AND ("xpert_id" IS NULL) AND ("mission_id" IS NULL)) OR (("subject_type" = 'mission'::"public"."task_subject_type") AND ("mission_id" IS NOT NULL) AND ("xpert_id" IS NULL) AND ("supplier_id" IS NULL)) OR (("subject_type" = 'other'::"public"."task_subject_type") AND ("xpert_id" IS NULL) AND ("supplier_id" IS NULL) AND ("mission_id" IS NULL))))
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


ALTER TABLE "public"."tasks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tasks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."unique_posts" AS
 SELECT DISTINCT "pe"."post"
   FROM ("public"."profile_experience" "pe"
     LEFT JOIN "public"."profile" "p" ON ((("p"."id" = "pe"."profile_id") AND ("p"."role" = 'xpert'::"public"."profile_roles"))))
  WHERE (("pe"."post" IS NOT NULL) AND ("p"."role" = 'xpert'::"public"."profile_roles") AND ("pe"."is_last" = 'true'::"text"))
  ORDER BY "pe"."post";


ALTER TABLE "public"."unique_posts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."unique_posts_with_referents" AS
 SELECT "u"."post",
    "count"("pe"."id") AS "post_count",
    "array_agg"(DISTINCT ROW("pr"."id", "pr"."firstname", "pr"."lastname")::"public"."referent_type") FILTER (WHERE ("pr"."id" IS NOT NULL)) AS "referents"
   FROM ((("public"."unique_posts" "u"
     LEFT JOIN "public"."profile_experience" "pe" ON ((("u"."post" = "pe"."post") AND ("pe"."is_last" = 'true'::"text"))))
     LEFT JOIN "public"."profile" "p" ON (("pe"."profile_id" = "p"."id")))
     LEFT JOIN "public"."profile" "pr" ON (("p"."affected_referent_id" = "pr"."id")))
  GROUP BY "u"."post"
  ORDER BY "u"."post";


ALTER TABLE "public"."unique_posts_with_referents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_alerts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "blog_alert" boolean DEFAULT true NOT NULL,
    "fav_alert" boolean DEFAULT true NOT NULL,
    "answer_message_mail" boolean DEFAULT true NOT NULL,
    "new_mission_alert" boolean DEFAULT true NOT NULL,
    "new_message_alert" boolean DEFAULT true NOT NULL,
    "newsletter" boolean DEFAULT true NOT NULL,
    "mission_state_change_alert" boolean DEFAULT true NOT NULL,
    "show_on_website" boolean DEFAULT true NOT NULL,
    "show_profile_picture" boolean DEFAULT true NOT NULL,
    "categories" "text"[],
    "topics" "text"[],
    "center_of_interest" "text"[],
    "new_test" "text"
);


ALTER TABLE "public"."user_alerts" OWNER TO "postgres";


ALTER TABLE "public"."user_alerts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_alerts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."xpert_notes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "xpert_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."xpert_notes" OWNER TO "postgres";


ALTER TABLE "public"."xpert_notes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."xpert_notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."company_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."diplomas" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."diplomas_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."expertises" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."expertises_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."habilitations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."habilitations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."infrastructures" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."infrastructures_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."job_titles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."job_titles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."juridic_status" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."juridic_status_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."languages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."languages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."posts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."posts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."profile_education" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."profile_education_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."profile_experience" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."profile_experience_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."profile_expertise" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."expertise_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."profile_mission" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."profile_mission_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."profile_status" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."status_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."sectors" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."sectors_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."specialties" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."specialties_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."subjects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."subjects_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_notes"
    ADD CONSTRAINT "chat_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat"
    ADD CONSTRAINT "chat_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_roles"
    ADD CONSTRAINT "company_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contact_xpert_demands"
    ADD CONSTRAINT "contact_xpert_demands_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."diplomas"
    ADD CONSTRAINT "diplomas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_expertise"
    ADD CONSTRAINT "expertise_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expertises"
    ADD CONSTRAINT "expertises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."habilitations"
    ADD CONSTRAINT "habilitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."infrastructures"
    ADD CONSTRAINT "infrastructures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_titles"
    ADD CONSTRAINT "job_titles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."juridic_status"
    ADD CONSTRAINT "juridic_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mission_application"
    ADD CONSTRAINT "mission_application_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mission_canceled"
    ADD CONSTRAINT "mission_canceled_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mission_checkpoints"
    ADD CONSTRAINT "mission_checkpoints_mission_id_key" UNIQUE ("mission_id");



ALTER TABLE ONLY "public"."mission_checkpoints"
    ADD CONSTRAINT "mission_checkpoints_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mission_notes"
    ADD CONSTRAINT "mission_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notifications_pkey1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_education"
    ADD CONSTRAINT "profile_education_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_experience"
    ADD CONSTRAINT "profile_experience_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_expertise"
    ADD CONSTRAINT "profile_expertise_profile_id_key" UNIQUE ("profile_id");



ALTER TABLE ONLY "public"."profile_mission"
    ADD CONSTRAINT "profile_mission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_mission"
    ADD CONSTRAINT "profile_mission_profile_id_key" UNIQUE ("profile_id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_status"
    ADD CONSTRAINT "profile_status_profile_id_key" UNIQUE ("profile_id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."sectors"
    ADD CONSTRAINT "sectors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."selection_matching"
    ADD CONSTRAINT "selection_matching_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."specialties"
    ADD CONSTRAINT "specialties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_status"
    ADD CONSTRAINT "status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."supplier_notes"
    ADD CONSTRAINT "supplier_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_history"
    ADD CONSTRAINT "task_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "unique_generated_id" UNIQUE ("generated_id");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "unique_slug" UNIQUE ("slug");



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."xpert_notes"
    ADD CONSTRAINT "xpert_notes_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_affected_referent_id" ON "public"."profile" USING "btree" ("affected_referent_id");



CREATE INDEX "idx_chat_notes_chat_id" ON "public"."chat_notes" USING "btree" ("chat_id");



CREATE INDEX "idx_chat_notes_created_by" ON "public"."chat_notes" USING "btree" ("created_by");



CREATE INDEX "idx_mission_notes_created_by" ON "public"."mission_notes" USING "btree" ("created_by");



CREATE INDEX "idx_mission_notes_mission_id" ON "public"."mission_notes" USING "btree" ("mission_id");



CREATE INDEX "idx_supplier_notes_created_by" ON "public"."supplier_notes" USING "btree" ("created_by");



CREATE INDEX "idx_supplier_notes_supplier_id" ON "public"."supplier_notes" USING "btree" ("supplier_id");



CREATE INDEX "idx_xpert_notes_created_by" ON "public"."xpert_notes" USING "btree" ("created_by");



CREATE INDEX "idx_xpert_notes_xpert_id" ON "public"."xpert_notes" USING "btree" ("xpert_id");



CREATE INDEX "selection_matching_column_status_idx" ON "public"."selection_matching" USING "btree" ("column_status");



CREATE INDEX "selection_matching_mission_id_idx" ON "public"."selection_matching" USING "btree" ("mission_id");



CREATE UNIQUE INDEX "selection_matching_mission_xpert_unique_idx" ON "public"."selection_matching" USING "btree" ("mission_id", "xpert_id");



CREATE INDEX "selection_matching_xpert_id_idx" ON "public"."selection_matching" USING "btree" ("xpert_id");



CREATE INDEX "task_history_changed_at_idx" ON "public"."task_history" USING "btree" ("changed_at");



CREATE INDEX "task_history_task_id_idx" ON "public"."task_history" USING "btree" ("task_id");



CREATE INDEX "tasks_assigned_to_idx" ON "public"."tasks" USING "btree" ("assigned_to");



CREATE INDEX "tasks_created_by_idx" ON "public"."tasks" USING "btree" ("created_by");



CREATE INDEX "tasks_mission_id_idx" ON "public"."tasks" USING "btree" ("mission_id");



CREATE INDEX "tasks_status_idx" ON "public"."tasks" USING "btree" ("status");



CREATE INDEX "tasks_subject_type_idx" ON "public"."tasks" USING "btree" ("subject_type");



CREATE INDEX "tasks_supplier_id_idx" ON "public"."tasks" USING "btree" ("supplier_id");



CREATE INDEX "tasks_xpert_id_idx" ON "public"."tasks" USING "btree" ("xpert_id");



CREATE OR REPLACE TRIGGER "after_mission_application_insert" AFTER INSERT ON "public"."mission_application" FOR EACH ROW EXECUTE FUNCTION "public"."create_selection_matching"();



CREATE OR REPLACE TRIGGER "assign_referent_mission_trigger" BEFORE INSERT ON "public"."mission" FOR EACH ROW EXECUTE FUNCTION "public"."assign_referent_mission"();



CREATE OR REPLACE TRIGGER "assign_referent_trigger" BEFORE INSERT ON "public"."profile" FOR EACH ROW EXECUTE FUNCTION "public"."assign_referent"();



CREATE OR REPLACE TRIGGER "create_checkpoints_after_mission_insert" AFTER INSERT ON "public"."mission" FOR EACH ROW EXECUTE FUNCTION "public"."create_mission_checkpoints"();



CREATE OR REPLACE TRIGGER "notify_new_chat_trigger" AFTER INSERT ON "public"."chat" FOR EACH ROW WHEN (("new"."type" = 'chat'::"public"."chat_type")) EXECUTE FUNCTION "public"."notify_new_conversation"();



CREATE OR REPLACE TRIGGER "notify_new_echo_message_trigger" AFTER INSERT ON "public"."message" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_echo_message"();



CREATE OR REPLACE TRIGGER "notify_new_forum_message_trigger" AFTER INSERT ON "public"."message" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_forum_message"();



CREATE OR REPLACE TRIGGER "set_chat_notes_updated_at" BEFORE UPDATE ON "public"."chat_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_mission_notes_updated_at" BEFORE UPDATE ON "public"."mission_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_xpert_notes_updated_at"();



CREATE OR REPLACE TRIGGER "set_supplier_notes_updated_at" BEFORE UPDATE ON "public"."supplier_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_xpert_notes_updated_at"();



CREATE OR REPLACE TRIGGER "set_xpert_notes_updated_at" BEFORE UPDATE ON "public"."xpert_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_xpert_notes_updated_at"();



CREATE OR REPLACE TRIGGER "slugify_title_unique" BEFORE INSERT OR UPDATE ON "public"."article" FOR EACH ROW EXECUTE FUNCTION "public"."set_unique_slug"();



CREATE OR REPLACE TRIGGER "task_insert_trigger" AFTER INSERT ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_task"();



CREATE OR REPLACE TRIGGER "task_status_update_notify" AFTER UPDATE ON "public"."tasks" FOR EACH ROW WHEN ((("new"."status" = 'done'::"public"."task_status") AND ("old"."status" <> 'done'::"public"."task_status"))) EXECUTE FUNCTION "public"."notify_task_done"();



CREATE OR REPLACE TRIGGER "trigger_enforce_is_authorized_referent" BEFORE INSERT OR UPDATE ON "public"."profile" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_is_authorized_referent"();



CREATE OR REPLACE TRIGGER "update_chat_updated_at" AFTER INSERT ON "public"."message" FOR EACH ROW EXECUTE FUNCTION "public"."update_chat_timestamp"();



CREATE OR REPLACE TRIGGER "update_mission_checkpoints_updated_at" BEFORE UPDATE ON "public"."mission_checkpoints" FOR EACH ROW EXECUTE FUNCTION "public"."update_mission_checkpoints_updated_at"();



CREATE OR REPLACE TRIGGER "update_task_last_updated" BEFORE UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_task_timestamp"();



CREATE OR REPLACE TRIGGER "update_totale_progression_column_trigger" BEFORE UPDATE OF "profile_progression", "expertise_progression", "mission_progression", "status_progression" ON "public"."profile" FOR EACH ROW EXECUTE FUNCTION "public"."update_progression"();



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat"
    ADD CONSTRAINT "chat_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat"
    ADD CONSTRAINT "chat_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat_notes"
    ADD CONSTRAINT "chat_notes_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_notes"
    ADD CONSTRAINT "chat_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat"
    ADD CONSTRAINT "chat_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."contact_xpert_demands"
    ADD CONSTRAINT "contact_xpert_demands_asked_xpert_fkey" FOREIGN KEY ("asked_xpert") REFERENCES "public"."profile"("generated_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contact_xpert_demands"
    ADD CONSTRAINT "contact_xpert_demands_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "message_answer_to_fkey" FOREIGN KEY ("answer_to") REFERENCES "public"."message"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "message_send_by_fkey" FOREIGN KEY ("send_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_affected_referent_id_fkey" FOREIGN KEY ("affected_referent_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mission_application"
    ADD CONSTRAINT "mission_application_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission_application"
    ADD CONSTRAINT "mission_application_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission_canceled"
    ADD CONSTRAINT "mission_canceled_mission_fkey" FOREIGN KEY ("mission") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission_checkpoints"
    ADD CONSTRAINT "mission_checkpoints_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission_notes"
    ADD CONSTRAINT "mission_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mission_notes"
    ADD CONSTRAINT "mission_notes_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_xpert_associated_id_fkey" FOREIGN KEY ("xpert_associated_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_affected_referent_id_fkey" FOREIGN KEY ("affected_referent_id") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_collaborator_replacement_id_fkey" FOREIGN KEY ("collaborator_replacement_id") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."profile_education"
    ADD CONSTRAINT "profile_education_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_experience"
    ADD CONSTRAINT "profile_experience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_expertise"
    ADD CONSTRAINT "profile_expertise_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_mission"
    ADD CONSTRAINT "profile_mission_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_referent_id_fkey" FOREIGN KEY ("referent_id") REFERENCES "public"."profile"("generated_id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profile_status"
    ADD CONSTRAINT "profile_status_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."selection_matching"
    ADD CONSTRAINT "selection_matching_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."selection_matching"
    ADD CONSTRAINT "selection_matching_xpert_id_fkey" FOREIGN KEY ("xpert_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."supplier_notes"
    ADD CONSTRAINT "supplier_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."supplier_notes"
    ADD CONSTRAINT "supplier_notes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_history"
    ADD CONSTRAINT "task_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."task_history"
    ADD CONSTRAINT "task_history_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_last_updated_by_fkey" FOREIGN KEY ("last_updated_by") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_xpert_id_fkey" FOREIGN KEY ("xpert_id") REFERENCES "public"."profile"("id");



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."xpert_notes"
    ADD CONSTRAINT "xpert_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."xpert_notes"
    ADD CONSTRAINT "xpert_notes_xpert_id_fkey" FOREIGN KEY ("xpert_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Admins can insert matches" ON "public"."selection_matching" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Admins can update matches" ON "public"."selection_matching" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Admins can view all matches" ON "public"."selection_matching" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Allow read for all" ON "public"."article" FOR SELECT USING (true);



CREATE POLICY "CRUD FOR AUTH" ON "public"."chat" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."mission_application" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "candidate_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_education" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_experience" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_expertise" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_mission" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_status" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id or admin" ON "public"."profile_experience" USING ((("auth"."uid"() = "profile_id") OR (EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Enable insert for admin users only" ON "public"."profile_experience" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Enable insert for admin users only" ON "public"."profile_expertise" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Enable insert for admin users only" ON "public"."profile_mission" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Enable insert for admin users only" ON "public"."profile_status" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



CREATE POLICY "Enable insert for all users" ON "public"."profile" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."company_roles" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."contact_xpert_demands" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."diplomas" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."expertises" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."habilitations" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."infrastructures" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."job_titles" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."juridic_status" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."languages" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."message" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."mission" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."mission_application" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "candidate_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."notification" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."sectors" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."specialties" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."subjects" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."profile_education" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."profile_experience" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."profile_expertise" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."profile_mission" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."profile_status" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable read access for all users" ON "public"."company_roles" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."contact_xpert_demands" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."diplomas" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."expertises" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."habilitations" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."infrastructures" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."job_titles" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."juridic_status" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."languages" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."message" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."mission" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."mission_application" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profile" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profile_education" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profile_experience" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profile_expertise" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profile_mission" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profile_status" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."sectors" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."specialties" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."subjects" FOR SELECT USING (true);



CREATE POLICY "Enable update for auth" ON "public"."company_roles" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."diplomas" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."expertises" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."habilitations" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."infrastructures" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."job_titles" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."juridic_status" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."languages" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."message" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."posts" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."sectors" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."specialties" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for auths" ON "public"."subjects" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for users based on email" ON "public"."mission" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "created_by")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));



CREATE POLICY "Enable update for users based on email" ON "public"."profile_education" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable update for users based on email" ON "public"."profile_experience" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable update for users based on email" ON "public"."profile_expertise" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable update for users based on email" ON "public"."profile_mission" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable update for users based on email" ON "public"."profile_status" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable update for users based on email or admin" ON "public"."profile" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "id") OR (EXISTS ( SELECT 1
   FROM "public"."profile" "profile_1"
  WHERE (("profile_1"."id" = "auth"."uid"()) AND ("profile_1"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Seule l'application peut créer des notifications" ON "public"."notification" FOR INSERT WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can update their own profile_education or admin can updat" ON "public"."profile_education" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND (("profile"."id" = "profile_education"."profile_id") OR ("profile"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Users can update their own profile_experience or admin can upda" ON "public"."profile_experience" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND (("profile"."id" = "profile_experience"."profile_id") OR ("profile"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Users can update their own profile_expertise or admin can updat" ON "public"."profile_expertise" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND (("profile"."id" = "profile_expertise"."profile_id") OR ("profile"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Users can update their own profile_mission or admin can update" ON "public"."profile_mission" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND (("profile"."id" = "profile_mission"."profile_id") OR ("profile"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Users can update their own profile_status or admin can update a" ON "public"."profile_status" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND (("profile"."id" = "profile_status"."profile_id") OR ("profile"."role" = 'admin'::"public"."profile_roles"))))));



CREATE POLICY "Utilisateurs peuvent mettre à jour leurs notifications" ON "public"."notification" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Utilisateurs peuvent supprimer leurs notifications" ON "public"."notification" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Utilisateurs peuvent voir leurs notifications" ON "public"."notification" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."article" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_xpert_demands" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."diplomas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expertises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."habilitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."infrastructures" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_titles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."juridic_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "manage_chat_notes" ON "public"."chat_notes" USING ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"]))))));



CREATE POLICY "manage_mission_notes" ON "public"."mission_notes" USING ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"]))))));



CREATE POLICY "manage_supplier_notes" ON "public"."supplier_notes" USING ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"]))))));



CREATE POLICY "manage_xpert_notes" ON "public"."xpert_notes" USING ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"public"."profile_roles", 'project_manager'::"public"."profile_roles", 'intern'::"public"."profile_roles", 'hr'::"public"."profile_roles", 'adv'::"public"."profile_roles"]))))));



ALTER TABLE "public"."message" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "message_crud" ON "public"."message" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "message_delete_admin" ON "public"."message" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."id" = "auth"."uid"()) AND ("profile"."role" = 'admin'::"public"."profile_roles")))));



ALTER TABLE "public"."mission_application" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mission_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_education" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_experience" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_expertise" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_mission" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."selection_matching" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."specialties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."supplier_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."xpert_notes" ENABLE ROW LEVEL SECURITY;


CREATE PUBLICATION "realtime_messages_publication_v2_34_1" WITH (publish = 'insert, update, delete, truncate');


-- ALTER PUBLICATION "realtime_messages_publication_v2_34_1" OWNER TO "supabase_admin";




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."message";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notification";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";













































































































































































































































GRANT ALL ON FUNCTION "public"."assign_referent"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_referent"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_referent"() TO "service_role";



GRANT ALL ON FUNCTION "public"."assign_referent_mission"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_referent_mission"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_referent_mission"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_matching_score"("p_mission_id" bigint, "p_xpert_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_matching_score"("p_mission_id" bigint, "p_xpert_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_matching_score"("p_mission_id" bigint, "p_xpert_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_mission_checkpoints"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_mission_checkpoints"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_mission_checkpoints"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_notification"("user_id" "uuid", "link" "text", "message" "text", "subject" "text", "status" "public"."notification_status", "is_global" boolean, "category" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_notification"("user_id" "uuid", "link" "text", "message" "text", "subject" "text", "status" "public"."notification_status", "is_global" boolean, "category" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_notification"("user_id" "uuid", "link" "text", "message" "text", "subject" "text", "status" "public"."notification_status", "is_global" boolean, "category" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_selection_matching"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_selection_matching"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_selection_matching"() TO "service_role";



GRANT ALL ON FUNCTION "public"."do_nothing"() TO "anon";
GRANT ALL ON FUNCTION "public"."do_nothing"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."do_nothing"() TO "service_role";



GRANT ALL ON FUNCTION "public"."do_nothing_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."do_nothing_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."do_nothing_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_is_authorized_referent"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_is_authorized_referent"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_is_authorized_referent"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_mission_unique_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_mission_unique_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_mission_unique_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_new_mission_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_new_mission_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_new_mission_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_id_f"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_id_f"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_id_f"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_slug"("input_text" "text", "table_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_slug"("input_text" "text", "table_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_slug"("input_text" "text", "table_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_combined_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_combined_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_combined_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_full_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_full_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_full_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_job_titles_search"("titles" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_job_titles_search"("titles" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_job_titles_search"("titles" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profile_other_languages"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_profile_other_languages"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profile_other_languages"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_email_confirmation"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_email_confirmation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_email_confirmation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_conversation"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_conversation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_conversation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_echo_message"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_echo_message"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_echo_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_forum_message"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_forum_message"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_forum_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_task"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_task"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_task"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_task_done"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_task_done"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_task_done"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_unique_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_unique_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_unique_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_chat_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_chat_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_chat_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_mission_checkpoints_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_mission_checkpoints_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_mission_checkpoints_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_progression"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_progression"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_progression"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_task_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_task_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_task_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_xpert_notes_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_xpert_notes_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_xpert_notes_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."article" TO "anon";
GRANT ALL ON TABLE "public"."article" TO "authenticated";
GRANT ALL ON TABLE "public"."article" TO "service_role";



GRANT ALL ON SEQUENCE "public"."article_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."article_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."article_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat" TO "anon";
GRANT ALL ON TABLE "public"."chat" TO "authenticated";
GRANT ALL ON TABLE "public"."chat" TO "service_role";



GRANT ALL ON SEQUENCE "public"."chat_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chat_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chat_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat_notes" TO "anon";
GRANT ALL ON TABLE "public"."chat_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."chat_notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chat_notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chat_notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_roles" TO "anon";
GRANT ALL ON TABLE "public"."company_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."company_roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contact_xpert_demands" TO "anon";
GRANT ALL ON TABLE "public"."contact_xpert_demands" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_xpert_demands" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contact_xpert_demands_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contact_xpert_demands_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contact_xpert_demands_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."diplomas" TO "anon";
GRANT ALL ON TABLE "public"."diplomas" TO "authenticated";
GRANT ALL ON TABLE "public"."diplomas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."diplomas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."diplomas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."diplomas_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile_expertise" TO "anon";
GRANT ALL ON TABLE "public"."profile_expertise" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_expertise" TO "service_role";



GRANT ALL ON SEQUENCE "public"."expertise_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."expertise_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."expertise_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."expertises" TO "anon";
GRANT ALL ON TABLE "public"."expertises" TO "authenticated";
GRANT ALL ON TABLE "public"."expertises" TO "service_role";



GRANT ALL ON SEQUENCE "public"."expertises_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."expertises_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."expertises_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."habilitations" TO "anon";
GRANT ALL ON TABLE "public"."habilitations" TO "authenticated";
GRANT ALL ON TABLE "public"."habilitations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."habilitations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."habilitations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."habilitations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."infrastructures" TO "anon";
GRANT ALL ON TABLE "public"."infrastructures" TO "authenticated";
GRANT ALL ON TABLE "public"."infrastructures" TO "service_role";



GRANT ALL ON SEQUENCE "public"."infrastructures_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."infrastructures_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."infrastructures_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."job_titles" TO "anon";
GRANT ALL ON TABLE "public"."job_titles" TO "authenticated";
GRANT ALL ON TABLE "public"."job_titles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."job_titles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."job_titles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."job_titles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."juridic_status" TO "anon";
GRANT ALL ON TABLE "public"."juridic_status" TO "authenticated";
GRANT ALL ON TABLE "public"."juridic_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."juridic_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."juridic_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."juridic_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."message" TO "anon";
GRANT ALL ON TABLE "public"."message" TO "authenticated";
GRANT ALL ON TABLE "public"."message" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mission" TO "anon";
GRANT ALL ON TABLE "public"."mission" TO "authenticated";
GRANT ALL ON TABLE "public"."mission" TO "service_role";



GRANT ALL ON TABLE "public"."mission_application" TO "anon";
GRANT ALL ON TABLE "public"."mission_application" TO "authenticated";
GRANT ALL ON TABLE "public"."mission_application" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mission_application_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mission_application_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mission_application_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mission_canceled" TO "anon";
GRANT ALL ON TABLE "public"."mission_canceled" TO "authenticated";
GRANT ALL ON TABLE "public"."mission_canceled" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mission_canceled_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mission_canceled_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mission_canceled_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mission_checkpoints" TO "anon";
GRANT ALL ON TABLE "public"."mission_checkpoints" TO "authenticated";
GRANT ALL ON TABLE "public"."mission_checkpoints" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mission_checkpoints_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mission_checkpoints_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mission_checkpoints_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mission_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mission_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mission_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mission_notes" TO "anon";
GRANT ALL ON TABLE "public"."mission_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."mission_notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mission_notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mission_notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mission_notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notification" TO "anon";
GRANT ALL ON TABLE "public"."notification" TO "authenticated";
GRANT ALL ON TABLE "public"."notification" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";



GRANT ALL ON TABLE "public"."profile_education" TO "anon";
GRANT ALL ON TABLE "public"."profile_education" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_education" TO "service_role";



GRANT ALL ON SEQUENCE "public"."profile_education_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_education_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_education_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile_experience" TO "anon";
GRANT ALL ON TABLE "public"."profile_experience" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_experience" TO "service_role";



GRANT ALL ON SEQUENCE "public"."profile_experience_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_experience_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_experience_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile_mission" TO "anon";
GRANT ALL ON TABLE "public"."profile_mission" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_mission" TO "service_role";



GRANT ALL ON SEQUENCE "public"."profile_mission_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_mission_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_mission_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile_status" TO "anon";
GRANT ALL ON TABLE "public"."profile_status" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_status" TO "service_role";



GRANT ALL ON TABLE "public"."sectors" TO "anon";
GRANT ALL ON TABLE "public"."sectors" TO "authenticated";
GRANT ALL ON TABLE "public"."sectors" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sectors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sectors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sectors_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."selection_matching" TO "anon";
GRANT ALL ON TABLE "public"."selection_matching" TO "authenticated";
GRANT ALL ON TABLE "public"."selection_matching" TO "service_role";



GRANT ALL ON SEQUENCE "public"."selection_matching_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."selection_matching_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."selection_matching_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."specialties" TO "anon";
GRANT ALL ON TABLE "public"."specialties" TO "authenticated";
GRANT ALL ON TABLE "public"."specialties" TO "service_role";



GRANT ALL ON SEQUENCE "public"."specialties_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."specialties_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."specialties_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."subjects" TO "anon";
GRANT ALL ON TABLE "public"."subjects" TO "authenticated";
GRANT ALL ON TABLE "public"."subjects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."subjects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subjects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subjects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."supplier_notes" TO "anon";
GRANT ALL ON TABLE "public"."supplier_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."supplier_notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."supplier_notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."supplier_notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."supplier_notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."task_history" TO "anon";
GRANT ALL ON TABLE "public"."task_history" TO "authenticated";
GRANT ALL ON TABLE "public"."task_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."task_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."task_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."task_history_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."unique_posts" TO "anon";
GRANT ALL ON TABLE "public"."unique_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."unique_posts" TO "service_role";



GRANT ALL ON TABLE "public"."unique_posts_with_referents" TO "anon";
GRANT ALL ON TABLE "public"."unique_posts_with_referents" TO "authenticated";
GRANT ALL ON TABLE "public"."unique_posts_with_referents" TO "service_role";



GRANT ALL ON TABLE "public"."user_alerts" TO "anon";
GRANT ALL ON TABLE "public"."user_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."user_alerts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."xpert_notes" TO "anon";
GRANT ALL ON TABLE "public"."xpert_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."xpert_notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."xpert_notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."xpert_notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."xpert_notes_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
