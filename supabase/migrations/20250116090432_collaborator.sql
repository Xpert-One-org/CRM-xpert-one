
create or replace view "public"."unique_last_jobs" as  SELECT DISTINCT
        CASE
            WHEN ((pe.post = 'other'::text) AND (pe.post_other IS NOT NULL)) THEN pe.post_other
            ELSE pe.post
        END AS post
   FROM (profile_experience pe
     LEFT JOIN profile p ON (((p.id = pe.profile_id) AND (p.role = 'xpert'::profile_roles))))
  WHERE ((pe.post IS NOT NULL) AND (p.role = 'xpert'::profile_roles) AND (pe.is_last = 'true'::text) AND ((pe.post <> 'other'::text) OR (pe.post_other IS NOT NULL)))
  ORDER BY
        CASE
            WHEN ((pe.post = 'other'::text) AND (pe.post_other IS NOT NULL)) THEN pe.post_other
            ELSE pe.post
        END;


create or replace view "public"."unique_posts_with_referents" as  SELECT u.post,
    array_agg(DISTINCT ROW(pr.id, pr.firstname, pr.lastname)::referent_type) FILTER (WHERE (pr.id IS NOT NULL)) AS referents
   FROM (((unique_last_jobs u
     LEFT JOIN profile_experience pe ON (
        CASE
            WHEN (u.post = pe.post) THEN true
            WHEN (u.post = pe.post_other) THEN true
            ELSE false
        END))
     LEFT JOIN profile p ON ((pe.profile_id = p.id)))
     LEFT JOIN profile pr ON ((p.affected_referent_id = pr.id)))
  GROUP BY u.post
  ORDER BY u.post;



