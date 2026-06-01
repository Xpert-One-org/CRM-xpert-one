-- Automation : prévenir par email les xperts dont le métier correspond
-- lorsqu'une mission est VALIDÉE par le CRM (transition d'un état "en attente"
-- vers un état "ouverte" : open / open_all).
--
-- Mécanisme : un trigger AFTER UPDATE OF state appelle l'edge function
-- `brevo-management` (type=new_mission_validated). L'edge function récupère
-- les xperts correspondants via la fonction RPC ci-dessous puis envoie l'email
-- (TO info@xpertone.fr, BCC les xperts ciblés).

-- 1) Matching xperts <-> mission.
--    "Le métier correspond" = le job_title de la mission fait partie des
--    job_titles recherchés par le xpert OU les expertises se recoupent.
--    Opt-out respecté via user_alerts.new_mission_alert (NULL/absent = inclus).
create or replace function public.get_matching_xperts_for_mission(
  p_mission_id bigint
)
returns table (email text, firstname text)
language sql
security definer
set search_path = public
as $$
  select distinct p.email, p.firstname
  from public.mission m
  join public.profile p
    on p.role = 'xpert'
   and p.email is not null
  left join public.profile_mission pm on pm.profile_id = p.id
  left join public.profile_expertise pe on pe.profile_id = p.id
  left join public.user_alerts ua on ua.user_id = p.id
  where m.id = p_mission_id
    and coalesce(ua.new_mission_alert, true) = true
    and (
      (
        m.job_title is not null
        and m.job_title = any(coalesce(pm.job_titles, '{}'::text[]))
      )
      or (
        m.expertises is not null
        and array_length(m.expertises, 1) is not null
        and (
          coalesce(pm.expertises, '{}'::text[]) && m.expertises
          or coalesce(pe.expertises, '{}'::text[]) && m.expertises
        )
      )
    );
$$;

comment on function public.get_matching_xperts_for_mission(bigint) is
  'Retourne les emails des xperts dont le métier (job_titles/expertises) correspond à la mission, en respectant l''opt-out user_alerts.new_mission_alert. Utilisé par l''edge function brevo-management (type=new_mission_validated).';

-- 2) Trigger : à la validation CRM (état "en attente" -> "ouverte").
drop trigger if exists brevo_new_mission_validated on public.mission;

create trigger brevo_new_mission_validated
after update of state on public.mission
for each row
when (
  old.state is distinct from new.state
  and old.state in ('to_validate', 'in_process', 'open_all_to_validate')
  and new.state in ('open', 'open_all')
)
execute function supabase_functions.http_request(
  'https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management',
  'POST',
  '{"Content-type":"application/json"}',
  '{"type":"new_mission_validated"}',
  '5000'
);
