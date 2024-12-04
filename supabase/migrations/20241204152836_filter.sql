alter table "public"."profile_mission" add column "job_titles_search" text generated always as (get_job_titles_search(job_titles)) stored;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_job_titles_search(titles text[])
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
    RETURN array_to_string(titles, ',');
END;
$function$
;


