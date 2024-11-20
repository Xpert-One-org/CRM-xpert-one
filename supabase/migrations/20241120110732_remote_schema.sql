

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


CREATE TYPE "public"."revenu_type" AS ENUM (
    'tjm',
    'brut'
);


ALTER TYPE "public"."revenu_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_mission_unique_id"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  new_mission_number TEXT;
  last_mission_number INT;
BEGIN
  -- Select the maximum generated ID from the profile table
  SELECT MAX(mission_number::INT) INTO last_mission_number FROM public.mission;

  -- If no ID exists, start from 1
  IF last_mission_number IS NULL THEN
    last_mission_number := 0;
  END IF;

  -- Increment the last generated ID by 1
  new_mission_number := 'M ' || TO_CHAR(last_mission_number + 1, 'FM0000');

  RETURN new_mission_number;
END;$$;


ALTER FUNCTION "public"."generate_mission_unique_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_new_mission_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  new_mission_number TEXT;
  last_mission_number INT;
BEGIN
  -- Select the maximum generated numeric part of the mission_number from the mission table
  SELECT MAX(CAST(SUBSTRING(mission_number FROM '\d+') AS INT)) INTO last_mission_number FROM public.mission;

  -- If no ID exists, start from 1
  IF last_mission_number IS NULL THEN
    last_mission_number := 0;
  END IF;

  -- Increment the last generated ID by 1
  new_mission_number := 'M ' || TO_CHAR(last_mission_number + 1, 'FM0000');

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
    SET "search_path" TO ''
    AS $$DECLARE
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


CREATE OR REPLACE FUNCTION "public"."update_progression"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
        NEW.totale_progression := NEW.profile_progression / 4 + NEW.expertise_progression / 4 + NEW.mission_progression / 4 + NEW.status_progression / 4;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_progression"() OWNER TO "postgres";

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
    "state" "public"."mission_state" DEFAULT 'to_validate'::"public"."mission_state" NOT NULL
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



ALTER TABLE "public"."mission" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."mission_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notification" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text",
    "read_by" "uuid"[],
    "chat_id" bigint
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
    "role" "text" DEFAULT 'NULL'::"text" NOT NULL,
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
    "is_banned_from_community" boolean DEFAULT false NOT NULL
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
    "job_titles_other" "text"
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



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



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



ALTER TABLE ONLY "public"."specialties"
    ADD CONSTRAINT "specialties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_status"
    ADD CONSTRAINT "status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "unique_generated_id" UNIQUE ("generated_id");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "unique_slug" UNIQUE ("slug");



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "slugify_title_unique" BEFORE INSERT OR UPDATE ON "public"."article" FOR EACH ROW EXECUTE FUNCTION "public"."set_unique_slug"();



CREATE OR REPLACE TRIGGER "update_chat_updated_at" AFTER INSERT ON "public"."message" FOR EACH ROW EXECUTE FUNCTION "public"."update_chat_timestamp"();



CREATE OR REPLACE TRIGGER "update_totale_progression_column_trigger" BEFORE UPDATE OF "profile_progression", "expertise_progression", "mission_progression", "status_progression" ON "public"."profile" FOR EACH ROW EXECUTE FUNCTION "public"."update_progression"();



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat"
    ADD CONSTRAINT "chat_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat"
    ADD CONSTRAINT "chat_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE SET NULL;



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



ALTER TABLE ONLY "public"."mission_application"
    ADD CONSTRAINT "mission_application_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission_application"
    ADD CONSTRAINT "mission_application_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission_canceled"
    ADD CONSTRAINT "mission_canceled_mission_fkey" FOREIGN KEY ("mission") REFERENCES "public"."mission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mission"
    ADD CONSTRAINT "mission_xpert_associated_id_fkey" FOREIGN KEY ("xpert_associated_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notification_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON UPDATE CASCADE ON DELETE CASCADE;



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



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Allow read for all" ON "public"."article" FOR SELECT USING (true);



CREATE POLICY "CRUD FOR AUTH" ON "public"."chat" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."mission_application" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "candidate_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_education" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_experience" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_expertise" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_mission" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_status" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



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



CREATE POLICY "Enable update for users based on email or admin" ON "public"."profile" FOR UPDATE USING (((( SELECT "auth"."uid"() AS "uid") = "id") OR (( SELECT "profile_1"."role"
   FROM "public"."profile" "profile_1"
  WHERE ("profile_1"."id" = ( SELECT "auth"."uid"() AS "uid"))) = 'admin'::"text"))) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "id") OR (( SELECT "profile_1"."role"
   FROM "public"."profile" "profile_1"
  WHERE ("profile_1"."id" = ( SELECT "auth"."uid"() AS "uid"))) = 'admin'::"text")));



ALTER TABLE "public"."article" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_xpert_demands" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."diplomas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expertises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."habilitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."infrastructures" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_titles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."juridic_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."message" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mission_application" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_education" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_experience" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_expertise" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_mission" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."specialties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."message";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";













































































































































































































































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



GRANT ALL ON FUNCTION "public"."get_profile_other_languages"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_profile_other_languages"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profile_other_languages"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_email_confirmation"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_email_confirmation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_email_confirmation"() TO "service_role";



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



GRANT ALL ON FUNCTION "public"."update_progression"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_progression"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_progression"() TO "service_role";


















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



GRANT ALL ON SEQUENCE "public"."mission_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mission_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mission_id_seq" TO "service_role";



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



GRANT ALL ON TABLE "public"."user_alerts" TO "anon";
GRANT ALL ON TABLE "public"."user_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."user_alerts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "service_role";



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

--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE OR REPLACE TRIGGER "on_email_confirmation" AFTER UPDATE OF "confirmed_at" ON "auth"."users" FOR EACH ROW WHEN (("new"."confirmed_at" IS NOT NULL)) EXECUTE FUNCTION "public"."notify_email_confirmation"();



CREATE POLICY " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'profile_files'::"text"));



CREATE POLICY " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_0" ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'mission_files'::"text"));



CREATE POLICY " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_1" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'mission_files'::"text"));



CREATE POLICY " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_2" ON "storage"."objects" FOR UPDATE USING (("bucket_id" = 'mission_files'::"text"));



CREATE POLICY " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_1" ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'profile_files'::"text"));



CREATE POLICY " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_2" ON "storage"."objects" FOR UPDATE USING (("bucket_id" = 'profile_files'::"text"));



CREATE POLICY "Allow Select  1zbfv_0" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'logo'::"text"));



CREATE POLICY "Allow select and insert for auth 1tf88_0" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK (("bucket_id" = 'chat'::"text"));



CREATE POLICY "Allow select and insert for auth 1tf88_1" ON "storage"."objects" FOR SELECT TO "authenticated" USING (("bucket_id" = 'chat'::"text"));



GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "postgres";
GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "postgres";
