-- PERF: correctifs issus des advisors Supabase (lint performance).
--
-- 1) auth_rls_initplan (31 politiques) : les politiques RLS qui appellent
--    auth.uid()/auth.role()/auth.jwt() directement ré-évaluent la fonction
--    POUR CHAQUE LIGNE scannée. En les enveloppant dans un sous-select
--    scalaire "(select auth.uid())", Postgres les évalue UNE fois par requête
--    (InitPlan). Sémantique strictement identique, gain majeur sur les scans.
--    Le bloc DO ci-dessous réécrit automatiquement toutes les politiques du
--    schéma public concernées (une politique déjà enveloppée est réécrite en
--    forme équivalente, sans effet).
--
-- 2) unindexed_foreign_keys (24 FK) : index de couverture sur les colonnes
--    de clés étrangères utilisées par les jointures du CRM (profile!referent,
--    mission!created_by, notification.user_id, message.chat_id, ...).

do $$
declare
  r record;
  new_qual text;
  new_check text;
  stmt text;
begin
  for r in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (
        coalesce(qual, '') ~ 'auth\.(uid|role|jwt)\(\)'
        or coalesce(with_check, '') ~ 'auth\.(uid|role|jwt)\(\)'
      )
  loop
    new_qual := r.qual;
    new_check := r.with_check;

    if new_qual is not null then
      new_qual := replace(new_qual, 'auth.uid()', '(select auth.uid())');
      new_qual := replace(new_qual, 'auth.role()', '(select auth.role())');
      new_qual := replace(new_qual, 'auth.jwt()', '(select auth.jwt())');
    end if;

    if new_check is not null then
      new_check := replace(new_check, 'auth.uid()', '(select auth.uid())');
      new_check := replace(new_check, 'auth.role()', '(select auth.role())');
      new_check := replace(new_check, 'auth.jwt()', '(select auth.jwt())');
    end if;

    stmt := format('alter policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
    if new_qual is not null then
      stmt := stmt || format(' using (%s)', new_qual);
    end if;
    if new_check is not null then
      stmt := stmt || format(' with check (%s)', new_check);
    end if;

    execute stmt;
  end loop;
end $$;

-- Index de couverture des clés étrangères (advisor: unindexed_foreign_keys)
create index if not exists idx_article_author_id on public.article (author_id);
create index if not exists idx_chat_created_by on public.chat (created_by);
create index if not exists idx_chat_mission_id on public.chat (mission_id);
create index if not exists idx_chat_receiver_id on public.chat (receiver_id);
create index if not exists idx_contact_xpert_demands_asked_xpert on public.contact_xpert_demands (asked_xpert);
create index if not exists idx_contact_xpert_demands_sent_by on public.contact_xpert_demands (sent_by);
create index if not exists idx_message_answer_to on public.message (answer_to);
create index if not exists idx_message_send_by on public.message (send_by);
create index if not exists idx_message_chat_id on public.message (chat_id);
create index if not exists idx_mission_affected_referent_id on public.mission (affected_referent_id);
create index if not exists idx_mission_created_by on public.mission (created_by);
create index if not exists idx_mission_xpert_associated_id on public.mission (xpert_associated_id);
create index if not exists idx_mission_application_candidate_id on public.mission_application (candidate_id);
create index if not exists idx_mission_application_mission_id on public.mission_application (mission_id);
create index if not exists idx_mission_canceled_mission on public.mission_canceled (mission);
create index if not exists idx_notification_user_id on public.notification (user_id);
create index if not exists idx_profile_collaborator_replacement_id on public.profile (collaborator_replacement_id);
create index if not exists idx_profile_referent_id on public.profile (referent_id);
create index if not exists idx_profile_bans_unbanned_by on public.profile_bans (unbanned_by);
create index if not exists idx_profile_education_profile_id on public.profile_education (profile_id);
create index if not exists idx_profile_experience_profile_id on public.profile_experience (profile_id);
create index if not exists idx_task_history_changed_by on public.task_history (changed_by);
create index if not exists idx_tasks_last_updated_by on public.tasks (last_updated_by);
create index if not exists idx_user_alerts_user_id on public.user_alerts (user_id);
