-- Inscrits à la newsletter depuis le site vitrine (xpert-one).
-- Le formulaire public insère (clé anon) ; le staff interne lit dans le CRM.

create table if not exists public.newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  consent boolean not null default true,
  source text not null default 'site_vitrine',
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Le site vitrine (clé anon) peut inscrire un email
create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

-- Le staff interne (CRM) peut lire les inscrits
create policy "newsletter_staff_select" on public.newsletter_subscribers
  for select to authenticated
  using (
    exists (
      select 1 from public.profile p
      where p.id = (select auth.uid())
        and p.role not in ('xpert'::profile_roles, 'company'::profile_roles)
    )
  );

-- Le staff interne peut supprimer un inscrit
create policy "newsletter_staff_delete" on public.newsletter_subscribers
  for delete to authenticated
  using (
    exists (
      select 1 from public.profile p
      where p.id = (select auth.uid())
        and p.role not in ('xpert'::profile_roles, 'company'::profile_roles)
    )
  );

create index if not exists idx_newsletter_subscribers_created_at
  on public.newsletter_subscribers (created_at desc);
